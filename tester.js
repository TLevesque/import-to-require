const string = `
// import { close as crossIcon, open as crossIcon } from "react-icons-kit/ionicons/close";
`;
// import { close as crossIcon } from "react-icons-kit/ionicons/close";
// import '../../styles/index.scss';
// import moment from 'moment';
// import React from "react";
// import Icon from "react-icons-kit";
// import PropTypes from "prop-types";
// import MobileDetect from "mobile-detect";
// import signS3 from "koa-s3-sign-upload";
// import { injectIntl } from "react-intl";
// import { IntlProvider, addLocaleData } from "react-intl";
// import { graphqlKoa, graphiqlKoa } from "graphql-server-koa";
// import Card from "../../library/cardstack/Card";
// import text from "../../helpers/text";
// import Button from "../../elements/buttons/Button";
// import BackButton from "../../elements/buttons/BackButton";
// import { checkmark } from "../../elements/utils";
// import { IntlProvider, addLocaleData } from "../../elements/helpers";
// import App, { Container } from "next/app";

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

parseString(string); //?
