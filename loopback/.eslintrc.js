module.exports = {

  extends: '@loopback/eslint-config',
  "rules": {
    "@typescript-eslint/naming-convention": [
      "error",

      {
        "selector": "property",
        "format": ["camelCase", "UPPER_CASE", "PascalCase", "snake_case"],
        "leadingUnderscore": "allow",
        "trailingUnderscore": "allow",
        filter: {
          regex: '^any$',
          match: false,
        },
      }
    ]
  }
};
