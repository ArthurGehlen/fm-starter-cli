#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { execa } from "execa";

const fm_path = process.argv[2];
const project_name = path.basename(fm_path) + "-react"; // configurando o nome da pasta :)

async function run() {
  await execa(
    "npx",
    ["create-vite@latest", project_name, "--template", "react"],
    {
      stdio: "ignore",
    },
  );

  const vite_path = path.join(process.cwd(), project_name);

  // substituindo a pasta assets
  await fs.remove(path.join(vite_path, "src/assets"));
  await fs.copy(
    path.join(fm_path, "assets"),
    path.join(vite_path, "src/assets"),
  );

  await fs.copy(path.join(fm_path, "design"), path.join(vite_path, "design"));

  const files = [
    "README.md",
    "README-template.md",
    "style-guide.md",
    "preview.jpg",
  ];

  for (const file of files) {
    await fs.copy(path.join(fm_path, file), path.join(vite_path, file), {
      overwrite: true,
    });
  }

  // lendo o arquivo git pra mesclar com o vite + react
  const fm_git = await fs.readFile(path.join(fm_path, ".gitignore"), "utf-8");

  const vite_git_path = path.join(vite_path, ".gitignore");
  const vite_git = await fs.readFile(vite_git_path, "utf-8");

  await fs.writeFile(vite_git_path, vite_git + "\n" + fm_git);

  // extraindo o HTML
  const html = await fs.readFile(path.join(fm_path, "index.html"), "utf-8");

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/\n+/g, "\n")
    .trim();

  await fs.writeFile(path.join(vite_path, "text-content-txt"), text);

  // instalando node_modules
  await execa("npm", ["install"], {
    cwd: vite_path,
    stdio: "inherit",
  });
}

run();
