import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      sourceType: "module", // 명시적으로 'module'로 설정
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.cjs"], // CommonJS 파일에만 적용
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
