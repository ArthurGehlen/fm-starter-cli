# fm-starter-cli

CLI tool to automate the setup of React projects from Frontend Mentor challenges.

This tool creates a new React project using Vite and copies the relevant challenge files into the new project structure, removing the need for manual setup when starting a new Frontend Mentor project.

---

## Features

When provided with the directory of a Frontend Mentor challenge, the CLI will:

* Create a new React project using Vite
* Move the `assets` folder into `src/assets`, replacing the existing one
* Copy the following folder:

  * `design`
* Copy the following files:

  * `preview.jpg`
  * `README.md`
  * `README-template.md`
  * `style-guide.md`
* Merge the challenge `.gitignore` with the generated project's `.gitignore`
* Extract all textual content from `index.html` and generate a `.txt` file
* Automatically install project dependencies

---

## Requirements

* Node.js version 18 or higher

---

## Installation (Global)

```bash
npm install -g fm-starter-cli
```

---

## Usage

Run the command and provide the path to your Frontend Mentor challenge folder:

```bash
fm-starter-cli C:\path\to\frontend-mentor-challenge
```

A new folder will be created in your current working directory using the challenge folder name as the base:

```bash
challenge-name-react/
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
