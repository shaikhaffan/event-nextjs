#!/bin/bash

# Read the current package.json
PACKAGE_JSON=$(cat package.json)

# Check if devDependencies already has jest
if echo "$PACKAGE_JSON" | grep -q '"jest"'; then
  echo "Jest already exists in package.json"
else
  echo "Adding test dependencies to package.json..."
  
  # Create a temporary node script to update package.json
  node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    
    // Add test script
    pkg.scripts.test = "jest";
    pkg.scripts["test:watch"] = "jest --watch";
    pkg.scripts["test:coverage"] = "jest --coverage";
    
    // Add jest and testing dependencies
    pkg.devDependencies["@types/jest"] = "^29.5.12";
    pkg.devDependencies["jest"] = "^29.7.0";
    pkg.devDependencies["jest-environment-node"] = "^29.7.0";
    pkg.devDependencies["ts-jest"] = "^29.1.2";
    pkg.devDependencies["@testing-library/react"] = "^14.2.1";
    pkg.devDependencies["@testing-library/jest-dom"] = "^6.4.2";
    
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
    console.log("package.json updated successfully!");
  '
fi