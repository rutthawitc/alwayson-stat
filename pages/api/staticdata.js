import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const dataDirectory = path.join(process.cwd(), "jsons");
  const filenames = fs.readdirSync(dataDirectory);

  const data = filenames.map((filename) => {
    const filePath = path.join(dataDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  });
  res.status(200).json(data);
}
