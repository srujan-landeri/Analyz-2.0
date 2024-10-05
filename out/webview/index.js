"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_dom_1 = __importDefault(require("react-dom"));
const App_1 = require("./components/App");
require("./styles.css");
const google_1 = require("@react-oauth/google");
react_dom_1.default.render((0, jsx_runtime_1.jsx)(google_1.GoogleOAuthProvider, { clientId: "944125795870-j1vgdubdra1njjjq7t8sumjrn0p1fj3i.apps.googleusercontent.com", children: (0, jsx_runtime_1.jsx)(App_1.App, {}) }), document.getElementById('root'));
//# sourceMappingURL=index.js.map