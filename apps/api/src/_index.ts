import * as fs from "fs";
import * as path from "path";
import express from "express";
import * as functions from "firebase-functions";

const availableMethods = ["get", "post", "put", "patch", "delete"];

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const getEndpointFiles = (dir: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.resolve(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getEndpointFiles(filePath));
    } else if (file.endsWith(".endpoint.js") || file.endsWith(".reactive.js")) {
      results.push(filePath);
    }
  });

  return results;
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
const endpointFiles = getEndpointFiles(baseDir);

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

endpointFiles.forEach((file) => {
  const methodCallback = require(file).default;
  const fileName = path.basename(file);

  const method = fileName.split(".")[0];

  if (method === "reactive") {
    const [functionName] = fileName.split(".");

    console.log("Reactive:", functionName, `\n${file}`);

    exports[functionName] = methodCallback;
  } else if (availableMethods.includes(method)) {
    const routePath = getRoutePath(file, baseDir);
    console.log("Route", method.toUpperCase(), routePath, `\n${file}`);
    app[method as keyof express.Application](routePath, methodCallback);
  } else console.log("Method not supported", method, file);
});

// Fallback route for handling invalid routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
