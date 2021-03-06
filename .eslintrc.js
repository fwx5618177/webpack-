module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/recommended', '@vue/prettier'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/no-v-html': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
        parser: 'babel-eslint',
        ecmaVersion: 7,
        ecmaFeatures: {
            jsx: true
        },
    },
    overrides: [],
};