module.exports = {
  extends: ["airbnb-base", "prettier"],
  env: {
    browser: true,
    jest: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  parser: "babel-eslint",
  rules: {
    "no-console": "off"
  }
};
