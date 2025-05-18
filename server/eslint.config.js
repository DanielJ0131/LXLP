export default [
    {
        ignores: ['node_modules/**']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'no-trailing-spaces': 'error',
            'eol-last': ['error', 'always'],
            semi: ['error', 'never'],
            indent: ['error', 4]
        }
    }
]
