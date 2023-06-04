module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    //   TODO Add Scope Enum Here
    // 'scope-enum': [2, 'always', ['yourscope', 'yourscope']],
    "type-enum": [
      2,
      "always",
      [
        "feat", // * feature
        "fix", // * fix
        "docs", // * documentation
        "chore", // * chore (if something irrelavant to the code itself is done. i.e: chore: updated lint rules, chore: updated .gitignore)
        "style", // * style (if changes are based on stylings only and not functionality itself)
        "refactor", // * refactor (code cleanups and readability improvements)
        "ci", // * ci (changes to deploy pipelines, git hooks etc)
        "test", // * test
        "perf", // * performance
        "revert", // * revert  (git revert to a specific commit)
        "merge", // merging branch (if confilict occurs)
      ],
    ],
  },
};
