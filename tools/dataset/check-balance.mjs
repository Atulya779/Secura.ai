import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
const getArg = (name, defaultValue) => {
  const index = args.indexOf(name);
  if (index === -1) return defaultValue;
  return args[index + 1] ?? defaultValue;
};

const manifestPath = getArg("--manifest", "tools/dataset/manifest.sample.json");
const tolerance = Number(getArg("--tolerance", "0"));
const minPerClass = Number(getArg("--min-per-class", "1"));
const requireBalanced = !args.includes("--no-require-balanced");

const absolutePath = path.resolve(process.cwd(), manifestPath);
const manifest = JSON.parse(fs.readFileSync(absolutePath, "utf-8"));

const counts = { REAL: 0, AI_SAFE: 0, DEEPFAKE: 0 };
for (const item of manifest.items || []) {
  if (counts[item.category] !== undefined) {
    counts[item.category] += 1;
  }
}

const values = Object.values(counts);
const minCount = Math.min(...values);
const maxCount = Math.max(...values);

console.log("Dataset balance report");
console.log(counts);
console.log(`Min per class: ${minCount}`);
console.log(`Max per class: ${maxCount}`);

let hasError = false;
if (values.some((count) => count < minPerClass)) {
  console.error(`Each class must have at least ${minPerClass} samples.`);
  hasError = true;
}

if (requireBalanced && maxCount - minCount > tolerance) {
  console.error(`Class imbalance detected. Tolerance: ${tolerance}`);
  hasError = true;
}

if (hasError) {
  process.exit(1);
}
