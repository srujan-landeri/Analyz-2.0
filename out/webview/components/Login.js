"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = __importDefault(require("react"));
const google_1 = require("@react-oauth/google");
function Login() {
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("p", { className: 'text-center text-2xl font-bold' }, "Login to Chat"),
        react_1.default.createElement(google_1.GoogleLogin, { onSuccess: credentialResponse => {
                console.log(credentialResponse);
            }, onError: () => {
                console.log('Login Failed');
            } })));
}
//# sourceMappingURL=Login.js.map