"use babel";

import { CompositeDisposable } from "atom";

export default {
  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "import-to-require:toggle": () => this.toggle()
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  toggle() {
    const splitString = string => {
      return string
        .trim()
        .split("\n")
        .filter(line => line.length !== 0);
    };

    const extractPath = string => {
      const matchedText = string.match(/(\"|').+?(\"|')/i);
      if (!matchedText) {
        throw Error(`Missing data in "${string}"`);
      }
      return matchedText[0].trim();
    };

    const extractName = string => {
      const matchedText = string.match(/(?<=(import)).+?(?=(from))/i);
      return matchedText && matchedText[0].trim();
    };

    const createRequireString = string => {
      const path = extractPath(string);
      const name = extractName(string);
      const quote = string.includes('"') ? '"' : "'";

      if (!name) return `require(${path});`;

      if (name.match(/\{/i) && name.match(/\}/i) && !path.match(/\.\//i)) {
        const nameSring = string.match(/(?<=({)).+?(?=(}))/i)[0].trim();

        if (nameSring.includes(",")) {
          const names = nameSring.split(",").map(name => name.trim());
          let returnedString = "";
          names.forEach((name, i) => {
            if (nameSring.includes("as")) {
              const [originalName, newName] = nameSring
                .split("as")
                .map(name => name.trim());
              if (i === names.length - 1) {
                returnedString = `${returnedString}const ${newName} = require(${path});`;
              } else {
                returnedString = `${returnedString}const ${newName} = require(${path});\n`;
              }
              // return `const ${newName} = require(${path});`;
            } else {
              if (i === names.length - 1) {
                returnedString = `${returnedString}const ${name} = require(${path}).${name};`;
              } else {
                returnedString = `${returnedString}const ${name} = require(${path}).${name};\n`;
              }

              // return `const ${nameSring} = require(${path}).${nameSring};`;
            }
          });
          return returnedString;
        } else {
          if (nameSring.includes("as")) {
            const [originalName, newName] = nameSring
              .split("as")
              .map(name => name.trim());
            return `const ${newName} = require(${path});`;
          } else {
            return `const ${nameSring} = require(${path}).${nameSring};`;
          }
        }
      }

      if (name.match(/\{/i) && name.match(/\}/i) && path.match(/\.\//i)) {
        const nameSring = string.match(/(?<=({)).+?(?=(}))/i)[0].trim();

        if (nameSring.includes(",")) {
          const names = nameSring.split(",").map(name => name.trim());
          let returnedString = "";
          names.forEach((name, i) => {
            if (i === names.length - 1) {
              returnedString = `${returnedString}const ${name} = require(${path}).${name};`;
            } else {
              returnedString = `${returnedString}const ${name} = require(${path}).${name};\n`;
            }
          });
          return returnedString;
        } else {
          return `const ${nameSring} = require(${path}).${nameSring};`;
        }
      }

      if (!name.match(/\{/i) && !name.match(/\}/i) && path.match(/\.\//i)) {
        return `const ${name} = require(${quote}${
          path.match(/(?<=(")).+?(?=("))/i)[0]
        }${quote});`;
      }
      return `const ${name} = require(${path});`;
    };

    const parseString = string => {
      const arrayedString = splitString(string);
      if (arrayedString.length === 1) {
        return createRequireString(arrayedString[0].trim());
      } else {
        const convertedStrings = arrayedString.map(line =>
          createRequireString(line.trim())
        );
        let returnedString = "";
        convertedStrings.forEach((line, i) => {
          if (i === arrayedString.length - 1) {
            returnedString = `${returnedString}${line}`;
          } else {
            returnedString = `${returnedString}${line}\n`;
          }
        });
        return returnedString;
      }
    };

    const editor = atom.workspace.getActiveTextEditor();

    if (editor) {
      const selection = editor.getSelectedText();

      const returnedString = parseString(selection);

      editor.insertText(returnedString);
    }
  }
};
