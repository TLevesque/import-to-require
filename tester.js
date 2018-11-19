const string = `
import moment from 'moment';
import {
  IntlProvider,
  addLocaleData
} from "react-intl";
import text from "../../helpers/text";
import {
  IntlProvider,
  addLocaleData
} from "react-intl";
`;
// import { close as crossIcon } from "react-icons-kit/ionicons/close";
// import { close as crossIcon, open as openIcon } from "react-icons-kit/ionicons/close";
// import cleanFromNullValues from './cleanFromNullValues';
// import '../../styles/index.scss';
// import React from "react";
// import Icon from "react-icons-kit";
// import PropTypes from "prop-types";
// import MobileDetect from "mobile-detect";
// import signS3 from "koa-s3-sign-upload";
// import { injectIntl } from "react-intl";
// import { graphqlKoa, graphiqlKoa } from "graphql-server-koa";
// import Card from "../../library/cardstack/Card";
// import Button from "../../elements/buttons/Button";
// import BackButton from "../../elements/buttons/BackButton";
// import { checkmark } from "../../elements/utils";
// import { IntlProvider, addLocaleData } from "../../elements/helpers";
// import App, { Container } from "next/app";

const getAllIndexes = (arr, func) => {
  let indexes = [];
  arr.forEach((line, i) => {
    if (func(line)) indexes.push(i);
  });
  // let i = -1;
  // while ((i = arr.findIndex(func)) !== -1) {
  //   indexes.push(i);
  // }
  return indexes;
};

const splitString = string => {
  const trimString = string.trim();
  const lineArr = trimString.split("\n").map(line => line.trim()); //?
  const importIndex = getAllIndexes(lineArr, line => line === "import {"); //?
  const fromIndex = getAllIndexes(lineArr, line => line.match(/} from/)); //?
  if (importIndex !== -1 && fromIndex !== -1) {
    console.log("toto");
  } else {
    return lineArr.filter(line => line.length !== 0);
  }
};

const extractPath = string => {
  const matchedText = string.match(/(\"|').+?(\"|')/i);
  return matchedText && matchedText[0].trim();
};

const extractName = string => {
  const matchedText = string.match(/(?<=import).+?(?=from)/);
  return matchedText && matchedText[0].trim();
};

const createRequireString = string => {
  const path = extractPath(string); //?
  const name = extractName(string); //?
  const quote = string.includes('"') ? '"' : "'";

  if (!name && path) return `require(${path});`;
  if (!name && !path) return `kjdk`;

  if (name.match(/\{/i) && name.match(/\}/i) && !path.match(/\.\//i)) {
    const nameSring = string.match(/(?<=({)).+?(?=(}))/i)[0].trim();

    if (nameSring.includes(",")) {
      const names = nameSring.split(",").map(name => name.trim());
      let returnedString = "";
      names.forEach((name, i) => {
        if (name.includes("as")) {
          const [originalName, newName] = name
            .split("as")
            .map(name => name.trim());
          if (i === names.length - 1) {
            returnedString = `${returnedString}const ${newName} = require(${path});`;
          } else {
            returnedString = `${returnedString}const ${newName} = require(${path});\n`;
          }
        } else {
          if (i === names.length - 1) {
            returnedString = `${returnedString}const ${name} = require(${path}).${name};`;
          } else {
            returnedString = `${returnedString}const ${name} = require(${path}).${name};\n`;
          }
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
      path.match(/(?<=("|')).+?(?=("|'))/i)[0]
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
