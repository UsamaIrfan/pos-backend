module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
    "simple-import-sort",
    "unused-imports",
  ],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",

    //#region  //*=========== Unused Import ===========
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    //#endregion  //*======== Unused Import ===========

    //#region  //*=========== Import Sort ===========
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // ext library & side effect imports
          ["^@?\\w", "^\\u0000"],
          // config
          ["^.*/config/.*$"],
          // controllers
          ["^.*/controllers/.*$"],
          // services
          ["^.*/services/.*$"],
          // entities
          ["^.*/entity/.*$"],
          // helpers
          ["^.*/helpers/.*$"],
          // middlewares
          ["^.*/middlewares/.*$"],
          // routes
          ["^.*/routes/.*$"],
          // utils
          ["^.*/utils/.*$"],
          // templates
          ["^.*/templates/.*$"],
          // types
          ["^.*/types/.*$"],
          // Other imports
          ["^src"],
          // relative paths up until 3 level
          [
            "^\\./?$",
            "^\\.(?!/?$)",
            "^\\.\\./?$",
            "^\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\./\\.\\.(?!/?$)",
          ],
          ["^src/types"],
          // other that didnt fit in
          ["^"],
        ],
      },
    ],
    //#endregion  //*======== Import Sort ===========
  },
};
