"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = Input;
const jsx_runtime_1 = require("react/jsx-runtime");
function Input({ className, ...props }) {
    return ((0, jsx_runtime_1.jsx)("input", { className: `p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-black ${className || ""}`, ...props }));
}
