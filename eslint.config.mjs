import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      sourceType: "module", // ES6 모듈 활성화
      ecmaVersion: 2020, // 최신 문법 지원
      globals: globals.browser
    },
    rules: {
      "semi": ["error", "always"], // 세미콜론 사용
      "quotes": ["error", "single"], // 작은 따옴표 사용
      "react/react-in-jsx-scope": "off", // React 자동 import 고려
      "prettier/prettier": "error" // Prettier 연동
    },
    plugins: {
      react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  js.configs.recommended, // ESLint 추천 설정
  react.configs.recommended, // React 추천 설정
];
