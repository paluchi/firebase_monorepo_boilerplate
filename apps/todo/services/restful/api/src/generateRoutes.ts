import * as fs from "fs";
import * as path from "path";
import prettier from "prettier";
import { fileURLToPath } from "url";
import express from "express";

// Derive __filename and __dirname from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const availableMethods = ["get", "post", "put", "patch", "delete"];

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const getEndpointFiles = (
  dir: string
): { endpoints: string[]; middlewares: string[] } => {
  let endpoints: string[] = [];
  let middlewares: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      const subResults = getEndpointFiles(filePath);
      endpoints = endpoints.concat(subResults.endpoints);
      middlewares = middlewares.concat(subResults.middlewares);
    } else if (file.endsWith(".endpoint.ts") || file.endsWith(".reactive.ts")) {
      endpoints.push(filePath);
    } else if (file.endsWith(".middleware.ts")) {
      middlewares.push(filePath);
    }
  });

  return { endpoints, middlewares };
};

const getRoutePath = (filePath: string, baseDir: string): string => {
  let relativePath = path.relative(baseDir, filePath);
  const pathParts = relativePath.split(path.sep);

  // Remove the file extension and method part from the last part
  const fileName = pathParts.pop();
  if (!fileName) return "";

  const [functionName] = fileName.split(".");

  // Filter out parts wrapped in parentheses and replace square brackets with colons
  const routeParts = pathParts
    .filter((part) => !part.startsWith("(") && !part.endsWith(")"))
    .map((part) => part.replace(/\[(.*?)\]/g, ":$1"));
  routeParts.push(functionName);

  // Pop the last part as it is the method
  routeParts.pop();

  return `/${routeParts.join("/")}`;
};

const baseDir = path.join(__dirname, "methods");
const { endpoints: endpointFiles, middlewares: middlewareFiles } =
  getEndpointFiles(baseDir);

// Sort endpoint files by specificity and then by presence of parameters
endpointFiles
  .sort((a, b) => {
    const aParts = getRoutePath(a, baseDir).split("/");
    const bParts = getRoutePath(b, baseDir).split("/");

    // First sort by length (more specific routes first)
    if (bParts.length !== aParts.length) {
      return bParts.length - aParts.length;
    }

    // If lengths are equal, sort alphabetically
    const aPath = getRoutePath(a, baseDir);
    const bPath = getRoutePath(b, baseDir);
    return aPath.localeCompare(bPath);
  })
  .reverse();

let imports = "";
let routes = "";
let exportsContent = "";
const routeMap = new Map<
  string,
  { middlewares: string[]; endpoints: string[] }
>();

// Process middleware files
middlewareFiles.forEach((file, index) => {
  const importPath =
    `./${path.relative(__dirname, file).replace(/\\/g, "/")}`.replace(
      /\.ts$/,
      ""
    );
  const middlewareName = `middleware${index}`;
  const routePath = getRoutePath(file, baseDir);

  imports += `import ${middlewareName} from "${importPath}";\n`;

  if (!routeMap.has(routePath)) {
    routeMap.set(routePath, { middlewares: [], endpoints: [] });
  }
  routeMap.get(routePath)!.middlewares.push(middlewareName);
});

// Process endpoint files
endpointFiles.forEach((file, index) => {
  let importPath = `./${path.relative(__dirname, file).replace(/\\/g, "/")}`;
  importPath = importPath.replace(/\.ts$/, ""); // Remove the .ts extension
  const fileName = path.basename(file);
  const method = fileName.split(".")[0];

  if (method === "reactive") {
    const [functionName] = fileName.split(".");
    imports += `import ${functionName} from "${importPath}";\n`;
    exportsContent += `export const ${functionName} = ${functionName};\n`;
  } else if (availableMethods.includes(method)) {
    const routePath = getRoutePath(file, baseDir);
    const functionName = `endpoint${index}`;

    imports += `import ${functionName} from "${importPath}";\n`;

    if (!routeMap.has(routePath)) {
      routeMap.set(routePath, { middlewares: [], endpoints: [] });
    }
    routeMap
      .get(routePath)!
      .endpoints.push(`app.${method}("${routePath}", ${functionName});`);
  } else {
    console.log("Method not supported", method, file);
  }
});

// Generate routes with middlewares applied before endpoints
routeMap.forEach((value, routePath) => {
  value.middlewares.forEach((middleware) => {
    routes += `app.use("${routePath}", ${middleware});\n`;
  });
  value.endpoints.forEach((endpoint) => {
    routes += `${endpoint}\n`;
  });
});

// Generate the final content
const content = `
import express from "express";
import * as functions from "firebase-functions";

${imports}

const app = express();
app.use(express.json());

${routes}

// Fallback route for handling invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
  } else {
    app(req, res);
  }
});

${exportsContent}
`;

(async () => {
  try {
    // Format the generated code with Prettier
    const formattedContent = await prettier.format(content, {
      parser: "typescript",
    });

    // Write the generated code to a file
    const outputPath = path.join(__dirname, "index.ts");
    fs.writeFileSync(outputPath, formattedContent);
    console.log(`File written successfully to ${outputPath}`);
  } catch (error) {
    console.error("Error formatting or writing the file:", error);
  }
})();
