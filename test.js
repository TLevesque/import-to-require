// "use strict";
//
// var _slicedToArray = (function() {
//   function sliceIterator(arr, i) {
//     var _arr = [];
//     var _n = true;
//     var _d = false;
//     var _e = undefined;
//     try {
//       for (
//         var _i = arr[Symbol.iterator](), _s;
//         !(_n = (_s = _i.next()).done);
//         _n = true
//       ) {
//         _arr.push(_s.value);
//         if (i && _arr.length === i) break;
//       }
//     } catch (err) {
//       _d = true;
//       _e = err;
//     } finally {
//       try {
//         if (!_n && _i["return"]) _i["return"]();
//       } finally {
//         if (_d) throw _e;
//       }
//     }
//     return _arr;
//   }
//   return function(arr, i) {
//     if (Array.isArray(arr)) {
//       return arr;
//     } else if (Symbol.iterator in Object(arr)) {
//       return sliceIterator(arr, i);
//     } else {
//       throw new TypeError(
//         "Invalid attempt to destructure non-iterable instance"
//       );
//     }
//   };
// })();
//
// var getAllIndexes = function getAllIndexes(arr, func) {
//   var indexes = [];
//   arr.forEach(function(line, i) {
//     if (func(line)) indexes.push(i);
//   });
//   return indexes;
// };
//
// var splitString = function splitString(string) {
//   var trimString = string.trim();
//   var lineArr = trimString.split("\n").map(function(line) {
//     return line.trim();
//   });
//   var importIndex = getAllIndexes(lineArr, function(line) {
//     return line === "import {";
//   });
//   var fromIndex = getAllIndexes(lineArr, function(line) {
//     return (
//       line.match(/} from/) && !line.match(/import {/) && !line.match(/, {/)
//     );
//   });
//   if (importIndex.length > 0 && fromIndex.length > 0) {
//     var indexList = importIndex
//       .map(function(importInd, i) {
//         return [importInd, fromIndex[i]];
//       })
//       .map(function(arr) {
//         var arrLength = +arr[1] - +arr[0] + 1;
//         var indexes = [];
//         var i = +arr[0];
//         while (i <= +arr[1]) {
//           indexes.push(i);
//           i++;
//         }
//         return indexes;
//       })
//       .reduce(function(prev, curr) {
//         return prev.concat(curr);
//       });
//     var arrays = importIndex
//       .map(function(index, i) {
//         return lineArr.slice(index, fromIndex[i] + 1);
//       })
//       .map(function(arr) {
//         return arr.join("");
//       });
//     lineArr.forEach(function(line, i, arr) {
//       if (!indexList.includes(i)) arrays.push(line);
//     });
//     return arrays;
//   } else {
//     return lineArr.filter(function(line) {
//       return line.length !== 0;
//     });
//   }
// };
//
// var extractPath = function extractPath(string) {
//   var matchedText = string.match(/(\"|\')(.+?)(\"|\')/i);
//   return matchedText && matchedText[2].trim();
// };
//
// var extractName = function extractName(string) {
//   var matchedText = string.match(/import(.*?)from/);
//   return matchedText && matchedText[1].trim();
// };
//
// var createRequireString = function createRequireString(string) {
//   var path = extractPath(string);
//   var name = extractName(string);
//   var quote = string.match(/"/) ? '"' : "'";
//
//   if (!name && path) return "require(" + quote + path + quote + ");";
//
//   if (name.match(/\{/i) && name.match(/\}/i) && !path.match(/\.\//i)) {
//     var nameSring = string.match(/{(.+?)}/i)[1].trim();
//     var extraName =
//       string
//         .match(/import(.+?){/i)[1]
//         .trim()
//         .replace(",", "") ||
//       string
//         .match(/}(.+?)from/i)[1]
//         .trim()
//         .replace(",", "") ||
//       null;
//     if (nameSring.includes(",")) {
//       var names = nameSring.split(",").map(function(name) {
//         return name.trim();
//       });
//       var returnedString = extraName
//         ? "const " + extraName + " = require(" + quote + path + quote + ");\n"
//         : "";
//       names.forEach(function(name, i) {
//         if (name.includes("as")) {
//           var _name$split$map = name.split(" as ").map(function(name) {
//               return name.trim();
//             }),
//             _name$split$map2 = _slicedToArray(_name$split$map, 2),
//             originalName = _name$split$map2[0],
//             newName = _name$split$map2[1];
//
//           if (i === names.length - 1) {
//             returnedString =
//               returnedString +
//               "const " +
//               newName +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               originalName +
//               ";";
//           } else {
//             returnedString =
//               returnedString +
//               "const " +
//               newName +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               originalName +
//               ";\n";
//           }
//         } else {
//           if (i === names.length - 1) {
//             returnedString =
//               returnedString +
//               "const " +
//               name +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               name +
//               ";";
//           } else {
//             returnedString =
//               returnedString +
//               "const " +
//               name +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               name +
//               ";\n";
//           }
//         }
//       });
//       return returnedString;
//     } else {
//       if (nameSring.includes("as")) {
//         var _nameSring$split$map = nameSring.split("as").map(function(name) {
//             return name.trim();
//           }),
//           _nameSring$split$map2 = _slicedToArray(_nameSring$split$map, 2),
//           originalName = _nameSring$split$map2[0],
//           newName = _nameSring$split$map2[1];
//
//         return extraName
//           ? "const " +
//               extraName +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ");\nconst " +
//               newName +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               originalName +
//               ";"
//           : "const " +
//               newName +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               originalName +
//               ";";
//       } else {
//         return extraName
//           ? "const " +
//               extraName +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ");\nconst " +
//               nameSring +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               nameSring +
//               ";"
//           : "const " +
//               nameSring +
//               " = require(" +
//               quote +
//               path +
//               quote +
//               ")." +
//               nameSring +
//               ";";
//       }
//     }
//   }
//
//   if (name.match(/\{/i) && name.match(/\}/i) && path.match(/\.\//i)) {
//     var _nameSring = string.match(/{(.+?)}/i)[1].trim();
//
//     if (_nameSring.includes(",")) {
//       var _names = _nameSring.split(",").map(function(name) {
//         return name.trim();
//       });
//       var _returnedString = "";
//       _names.forEach(function(name, i) {
//         if (i === _names.length - 1) {
//           _returnedString =
//             _returnedString +
//             "const " +
//             name +
//             " = require(" +
//             quote +
//             path +
//             quote +
//             ")." +
//             name +
//             ";";
//         } else {
//           _returnedString =
//             _returnedString +
//             "const " +
//             name +
//             " = require(" +
//             quote +
//             path +
//             quote +
//             ")." +
//             name +
//             ";\n";
//         }
//       });
//       return _returnedString;
//     } else {
//       return (
//         "const " +
//         _nameSring +
//         " = require(" +
//         quote +
//         path +
//         quote +
//         ")." +
//         _nameSring +
//         ";"
//       );
//     }
//   }
//
//   if (!name.match(/\{/i) && !name.match(/\}/i) && path.match(/\.\//i)) {
//     return "const " + name + " = require(" + quote + path + quote + ");";
//   }
//
//   return "const " + name + " = require(" + quote + path + quote + ");";
// };
//
// var parseString = function parseString(string) {
//   var arrayedString = splitString(string);
//   if (arrayedString.length === 1) {
//     return createRequireString(arrayedString[0].trim());
//   } else {
//     var convertedStrings = arrayedString.map(function(line) {
//       return createRequireString(line.trim());
//     });
//     var returnedString = "";
//     convertedStrings.forEach(function(line, i) {
//       if (i === arrayedString.length - 1) {
//         returnedString = "" + returnedString + line;
//       } else {
//         returnedString = "" + returnedString + line + "\n";
//       }
//     });
//     return returnedString;
//   }
// };
// // import text from '../../helpers/text';
// // import Button from '../../elements/buttons/Button';
// // import { Container1 } from 'next/app';
// // import { checkmark } from '../../elements/utils';
// // import { IntlProvider, addLocaleData } from 'react-intl';
// // import {
// //   compose,
// //   withApollo,
// //   gql
// // } from 'react-apollo';
// const string = `
// import { close as crossIcon, open as openIcon } from 'react-icons-kit/ionicons/close';
// import App, { Container, connect, coon as alias } from 'next/app';
// import { close as crossIcon } from 'react-icons-kit/ionicons/close';
// import React from 'react';
// import moment from 'moment';
// `;
//
// parseString(string); //?
