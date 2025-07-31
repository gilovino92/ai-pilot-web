import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const targetDir = path.join(process.cwd(), "src", "components", "ui");

const filenames = fs
  .readdirSync(targetDir)
  .map((file) => path.parse(file).name);

const components = filenames.join(" ");
const command = `pnpx shadcn@latest add ${components} --overwrite`;

console.log("Executing command:");
console.log(command);

try {
  execSync(command, { stdio: "inherit" });
} catch (error) {
  console.error("Error executing command:", error);
}
