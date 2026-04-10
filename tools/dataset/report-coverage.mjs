import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const index = args.indexOf(name);
  if (index === -1) return defaultValue;
  return args[index + 1] ?? defaultValue;
};

const manifestPath = getArg("--manifest", "tools/dataset/manifest.sample.json");
const absolutePath = path.resolve(process.cwd(), manifestPath);
const manifest = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));

const tally = (key) => {
  return (manifest.items || []).reduce((acc, item) => {
    const value = item[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

console.log("Coverage report");
console.log("Lighting:", tally("lighting"));
console.log("Device:", tally("device"));
console.log("Context:", tally("context"));
console.log("AI tools:", tally("aiTool"));
