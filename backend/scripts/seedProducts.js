import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import connectDB from "../config/mongodb.js";
import productModel from "../models/productModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..");
const projectRoot = path.resolve(backendRoot, "..");
const frontendAssetsDir = path.join(projectRoot, "frontend", "src", "assets");
const assetsFile = path.join(frontendAssetsDir, "assets.js");
const uploadDir = path.join(backendRoot, "uploads", "products");

const backendOrigin =
  process.env.PUBLIC_BACKEND_URL || `http://localhost:${process.env.PORT || 4000}`;
const seededImageBaseUrl = `${backendOrigin}/uploads/products`;

const getImportedAssets = (source) => {
  const imports = new Map();
  const importRegex = /^import\s+(\w+)\s+from\s+['"]\.\/([^'"]+)['"]/gm;
  let match;

  while ((match = importRegex.exec(source)) !== null) {
    imports.set(match[1], match[2]);
  }

  return imports;
};

const getProductsFromAssetsFile = (source, importedAssets) => {
  const marker = "export const products =";
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error("Could not find exported products array in frontend assets.js");
  }

  const productExpression = source.slice(start + marker.length).trim().replace(/;?\s*$/, "");
  const declarations = [...importedAssets.entries()]
    .map(
      ([variableName, fileName]) =>
        `const ${variableName} = ${JSON.stringify(`${seededImageBaseUrl}/${fileName}`)};`
    )
    .join("\n");

  return Function(`${declarations}\nreturn ${productExpression};`)();
};

const copyProductImages = async (products) => {
  await fs.mkdir(uploadDir, { recursive: true });

  const imageUrls = new Set(products.flatMap((product) => product.image));

  for (const imageUrl of imageUrls) {
    const fileName = imageUrl.split("/").pop();
    await fs.copyFile(path.join(frontendAssetsDir, fileName), path.join(uploadDir, fileName));
  }
};

const seedProducts = async () => {
  const force = process.argv.includes("--force");
  const source = await fs.readFile(assetsFile, "utf8");
  const importedAssets = getImportedAssets(source);
  const products = getProductsFromAssetsFile(source, importedAssets).map((product) => {
    const { _id, ...productWithoutId } = product;
    return productWithoutId;
  });

  await connectDB();

  const existingCount = await productModel.countDocuments();

  if (existingCount > 0 && !force) {
    console.log(`Products already exist (${existingCount}). Use "npm run seed -- --force" to replace them.`);
    process.exit(0);
  }

  if (force) {
    await productModel.deleteMany({});
  }

  await copyProductImages(products);
  await productModel.insertMany(products);

  console.log(`Seeded ${products.length} products.`);
  process.exit(0);
};

seedProducts().catch((error) => {
  console.error(error);
  process.exit(1);
});
