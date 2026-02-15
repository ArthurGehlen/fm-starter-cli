#!/usr/bin/env node

import { spawnSync } from "child_process";
import { promises as fs } from "fs";
import path from "path";

// Path to the Frontend Mentor challenge folder and Name of the new React project that will be created
const fm_path = process.argv[2];
const project_name = path.basename(fm_path) + "-react";

/**
 * Runs shell commands in a cross-platform way.
 * On Windows, commands like npm/npx must be executed through cmd.exe.
 *
 * stdio is set to "pipe" for stdout to remove TTY detection,
 * which prevents Vite from entering interactive mode.
 */
function run_command(cmd, args = [], cwd = process.cwd()) {
  const is_win = process.platform === "win32";

  const result = spawnSync(
    is_win ? "cmd.exe" : cmd,
    is_win ? ["/c", cmd, ...args] : args,
    {
      stdio: ["ignore", "ignore", "inherit"],
      cwd,
      env: {
        ...process.env,
        CI: "true",
        npm_config_yes: "true",
      },
    },
  );

  if (result.error) {
    console.error("Command failed:", result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status);
  }
}

async function run() {
  console.log("\nCreating Vite + React project...");

  run_command(
    "npx",
    [
      "-y",
      "create-vite@latest",
      project_name,
      "--template",
      "react",
      "--no-install",
      "--force",
    ],
    process.cwd(),
  );

  const vite_path = path.join(process.cwd(), project_name);

  console.log("Copying challenge assets...");

  // Replace default Vite assets with Frontend Mentor assets
  await fs.rm(path.join(vite_path, "src/assets"), {
    recursive: true,
    force: true,
  });

  await fs.cp(
    path.join(fm_path, "assets"),
    path.join(vite_path, "src/assets"),
    { recursive: true },
  );

  await fs.cp(path.join(fm_path, "design"), path.join(vite_path, "design"), {
    recursive: true,
  });

  console.log("Copying documentation files...");

  const files = [
    "README.md",
    "README-template.md",
    "style-guide.md",
    "preview.jpg",
  ];

  for (const file of files) {
    await fs.copyFile(path.join(fm_path, file), path.join(vite_path, file));
  }

  console.log("Merging .gitignore files...");

  // Merge Frontend Mentor .gitignore with Vite's .gitignore
  const fm_git = await fs.readFile(path.join(fm_path, ".gitignore"), "utf-8");
  const vite_git_path = path.join(vite_path, ".gitignore");
  const vite_git = await fs.readFile(vite_git_path, "utf-8");

  await fs.writeFile(vite_git_path, vite_git + "\n" + fm_git);

  console.log("Extracting text content from index.html...");

  // Extract readable text content from the original HTML
  const html = await fs.readFile(path.join(fm_path, "index.html"), "utf-8");

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/\n+/g, "\n")
    .trim();

  await fs.writeFile(path.join(vite_path, "text-content.txt"), text);

  console.log("Installing dependencies...");

  run_command("npm", ["install"], vite_path);

  console.log("\nProject ready at:", vite_path);
}

run();
