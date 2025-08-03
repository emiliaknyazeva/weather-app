import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // === Игнорируем лишние файлы/папки ===
  {
    ignores: [
      "node_modules",
      "build",
      "client/build",
      "dist",
      "package-lock.json",
      "client/package-lock.json"
    ]
  },

  // === Базовые JS-правила ===
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },

  // === React/ESM для фронтенда ===
  {
    files: ["client/src/**/*.{js,jsx}"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2021,
      globals: { ...globals.browser },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    }
  },

  // === Поддержка Jest для тестов ===
  {
    files: ["tests/**/*.js", "client/src/**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  },

  // === JSON ===
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"]
  },

  // === Markdown ===
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  },

  // === CSS ===
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"]
  },

  // === Prettier ===
  {
    files: ["**/*.{js,jsx,css,md,json}"],
    plugins: { prettier: prettierPlugin },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: true,
          trailingComma: "es5",
          printWidth: 80
        }
      ]
    }
  }
]);
