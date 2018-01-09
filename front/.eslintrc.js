module.exports = {
  extends: ["airbnb-base", "prettier"],
  plugins: ["react"],
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
    "react/jsx-filename-extension": 0,
    "class-methods-use-this": 0,
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-underscore-dangle": "off",
    "no-console": "off"
  }
};
