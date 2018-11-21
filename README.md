# import-to-require package

Select the 'import' ES6 syntax line and press ctrl+alt+m to turn it into 'require' ES5 syntax.

You can select multiple lines to modify several import lines at a time. But doesn't support multi-cursors.

### Support those kinds of imports:

import moment from "moment";**
=> const moment = require(moment);**

import React from "react";**
=> const React = require(react);**

import text from "../../helpers/text";**
=> const text = require("../../helpers/text");**

import Button from "../../elements/buttons/Button";**
=> const Button = require("../../elements/buttons/Button");**

import { Container1 } from "next/app";**
=> const Container1 = require(next/app).Container1;**

import { checkmark } from "../../elements/utils";**
=> const checkmark = require(../../elements/utils).checkmark;;**

import { IntlProvider, addLocaleData } from "react-intl";**
=> const IntlProvider = require(react-intl).IntlProvider;**
=> const addLocaleData = require(react-intl).addLocaleData;\_\_

import { close as crossIcon } from "react-icons-kit/ionicons/close";**
=> const crossIcon = require(react-icons-kit/ionicons/close);**

import { close as crossIcon, open as openIcon } from "react-icons-kit/ionicons/close"**
=> const crossIcon = require(react-icons-kit/ionicons/close).close;**
=> const openIcon = require(react-icons-kit/ionicons/close).open;\_\_

import App, { Container, connect, coon as alias } from "next/app"**
=> const App = require(next/app);**
=> const Container = require(next/app).Container;**
=> const connect = require(next/app).connect;**
=> const alias = require(next/app).coon;\_\_
