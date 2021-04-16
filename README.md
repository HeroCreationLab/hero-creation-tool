# Hero Creation Tool for Foundry VTT - DnD5e

The project was migrated to Typescript using Flamewave000's fvtt-module-template as base (with some alterations, but the basics are the same).
> https://github.com/flamewave000/fvtt-module-template/blob/main/module.json

### Table of Contents

- [How to Run Locally](#How-to-Run-Locally)
- [Folder Structure](#Folder-Structure)
- [Project Files](#Project-Files)

## How to Run Locally

Install NodeJS if you don't already have it: [NodeJS](https://nodejs.org)

Run the NPM installer inside the project directory

```bash
cd path/to/fvtt-module-template
npm install
```

Each of these commands are executed as follows:

```bash
# replace <command> with one of the commands described below
npm run <command>
# For example:
npm run build
```

| Command             | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `build`             | This is the basic Build command. It will compile the code and output everything into the `dist/` directory. This is a ready to use output of the module. |
| `watch`     | This will run the Live Build process. This will monitor your project's files and whenever one of them changes, it will immediately process the changes output the new contents to the `dist/` directory. |
| `clean`     | This will "Clean" the directory by removing the `dist/` and `bundle/` directories. |
| `devbuild` | This is the same as the `build` command, except instead of outputting everything to the `dist/` folder, it will output the files to the `devDist` folder that is defined in the `package.json`. This will create the module's directory if it doesn't exists already, clear the contents of the directory, and then place the new project files in it. |
| `devwatch` | This is the same as the `watch` command, but just like the `devbuild` command, it outputs the updated files to the `devDist` directory defined in the `package.json`. This is the recommended command to use while you are working on your module. It will take care of updating the module in FoundryVTT so all you have to do is switch to the app and hit `F5` to refresh the page. |
| `devclean` | This will remove all the contents in the defined `devDist` folder. |
| `release`   | Builds and compresses the project into a ZIP file and places it and a copy of the compiled `module.json` file in the `bundle/` directory. This is ready for being referenced by the FoundryVTT Module system for the community to install your module. |

[top](#table-of-contents)

## Folder Structure

| Folder Name             | Description                                                  |
| ----------------------- | ------------------------------------------------------------ |
| `src/`                  | The directory containing all of your `.js` and `.ts` code files. |
| `lang/`                 | The directory containing your localization strings files.    |
| `dist/` (generated)     | This will contain the compiled source code, templates, project files, styles, and manifest. The contents can be directly copied to a FoundryVTT's modules directory, or zipped into a bundle for installing. |
| `styles/`			      | The directory containing any CSS you might have. |
| `templates/`            | The directory containing your Handlebars HTML template files. |

[top](#table-of-contents)

## Project Files

| File            | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| `.gitignore`    | This is used to ignore files and folders you don't want to be included in the git repository. |
| `CHANGELOG.md`  | A MarkDown file for describing the project's history of changes |
| `gulpfile.js`   | Gulp File that contains the various build scripts used automating the module building, live building, and packaging. |
| `LICENSE`       | UPDATE THIS FILE! The Copyright License for your project. GitHub has a very helpful page for [picking and appropriate license](https://choosealicense.com/) for your project. |
| `module.json`   | The FoundryVTT Module Manifest file that describes everything about your module. |
| `package.json`  | The NPM Package configuration. This contains additional information that is used in the build automation process. |
| `README.md`     | MarkDown file you can use to describe what your module is and how to use it. |
| `tsconfig.json` | TypeScript configuration. This defines the various settings used by the TypeScript transpiler. |

[top](#table-of-contents)
