module.exports = {
    extends: [ "google" ],
    parserOptions: {
        ecmaVersion: 7, // This option is for syntax only.
        sourceType: "module"
    },
    env: {
        es6: true   // This option deals with libraries, such as Map, Set, etc.
    },
    rules: {
        "space-before-function-paren": [
            "error", {
                anonymous: "always",
                named: "always",
                asyncArrow: "always"
            }
        ],
        "comma-dangle": [ "error", "never" ], // no comma-dangle
        "object-curly-spacing": [ "error", "always" ],
        "array-bracket-spacing": [ "error", "always" ],
        "switch-colon-spacing": 0,
        "require-jsdoc": [ 0, {
            "require": {
                "FunctionDeclaration": false,
                "MethoDefinition": false,
                "ClassDeclaration": false,
                "ArrowFunctionExpression": false
            }
        }],
        "arrow-parens": [ "error", "as-needed" ]
    }
};
