const readline = require("readline");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load firebase.json configuration
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "firebase.json"), "utf8")
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const getAvailableFunctions = () => {
  const functionsConfig = firebaseConfig.functions || [];
  return functionsConfig.map((func) => func.codebase);
};

const getAvailableHostingSites = () => {
  const hostingConfig = firebaseConfig.hosting || [];
  return Array.isArray(hostingConfig)
    ? hostingConfig.map((host) => host.site)
    : [hostingConfig.site];
};

const deployFunctions = async (skipPrompt) => {
  const availableFunctions = getAvailableFunctions();
  console.log(`Available functions: ${availableFunctions.join(", ")}`);

  if (skipPrompt) {
    try {
      if (skipPrompt === "all") {
        console.log("Deploying all functions...");
        execSync("firebase deploy --only functions", { stdio: "inherit" });
      } else if (availableFunctions.includes(skipPrompt))
        execSync(`firebase deploy --only functions:${skipPrompt}`, {
          stdio: "inherit",
        });
      else throw new Error("Invalid function name");
    } catch (error) {
      console.error("Error during deployment:", error.message);
    }
  } else {
    const deployAll = await askQuestion(
      "Do you want to deploy all functions? (yes/no) "
    );

    if (deployAll.toLowerCase() === "yes") {
      try {
        console.log("Deploying all functions...");
        execSync("firebase deploy --only functions", { stdio: "inherit" });
      } catch (error) {
        console.error("Error during deployment:", error.message);
      }
    } else {
      const functionName = await askQuestion(
        `Enter the name of the function to deploy (${availableFunctions.join(", ")}): `
      );

      if (functionName && availableFunctions.includes(functionName)) {
        try {
          console.log(`Deploying function ${functionName}...`);
          execSync(`firebase deploy --only functions:${functionName}`, {
            stdio: "inherit",
          });
        } catch (error) {
          console.error("Error during deployment:", error.message);
        }
      } else {
        console.log("Invalid function name or function name cannot be empty.");
      }
    }
  }
};

const deployHosting = async (skipPrompt) => {
  const availableHostingSites = getAvailableHostingSites();
  console.log(`Available hosting sites: ${availableHostingSites.join(", ")}`);

  if (skipPrompt) {
    try {
      if (skipPrompt === "all") {
        console.log("Deploying all hosting sites...");
        execSync("firebase deploy --only hosting", { stdio: "inherit" });
      } else if (availableHostingSites.includes(skipPrompt))
        execSync(`firebase deploy --only hosting:${skipPrompt}`, {
          stdio: "inherit",
        });
      else throw new Error("Invalid hosting site name");
    } catch (error) {
      console.error("Error during deployment:", error.message);
    }
  } else {
    const deployAll = await askQuestion(
      "Do you want to deploy all hosting sites? (yes/no) "
    );

    if (deployAll.toLowerCase() === "yes") {
      try {
        console.log("Deploying all hosting sites...");
        execSync("firebase deploy --only hosting", { stdio: "inherit" });
      } catch (error) {
        console.error("Error during deployment:", error.message);
      }
    } else {
      const siteName = await askQuestion(
        `Enter the name of the hosting site to deploy (${availableHostingSites.join(", ")}): `
      );

      if (siteName && availableHostingSites.includes(siteName)) {
        try {
          console.log(`Deploying hosting site ${siteName}...`);
          execSync(`firebase deploy --only hosting:${siteName}`, {
            stdio: "inherit",
          });
        } catch (error) {
          console.error("Error during deployment:", error.message);
        }
      } else {
        console.log(
          "Invalid hosting site name or hosting site name cannot be empty."
        );
      }
    }
  }
};

const main = async () => {
  const deployTarget = process.argv[2];
  const skipPrompt = process.argv[3];

  if (deployTarget === "functions") {
    await deployFunctions(skipPrompt);
  } else if (deployTarget === "hosting") {
    await deployHosting(skipPrompt);
  } else {
    console.log(
      'Invalid choice. Please use "functions" or "hosting" as an argument.'
    );
    rl.close();
  }
  rl.close();
};

main();
