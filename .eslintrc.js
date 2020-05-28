module.exports = {
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        jest: true,
        node: true,
    },
    globals: {},
    plugins: ['prettier', 'react-hooks'],
    extends: ['prettier'],
    rules: {
        'no-use-before-define': ['error', 'nofunc'],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
    },
    parser: 'babel-eslint',
};
