const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
    modulePathIgnorePatterns: ['<rootDir>/.localdevserver'],
    moduleNameMapper: {
        // Explicitly map the component module
        '^c/agGridWrapper$': '<rootDir>/force-app/main/default/lwc/agGridWrapper/agGridWrapper',
        // Add other mappings if needed
        ...jestConfig.moduleNameMapper, // Ensure existing mappings are preserved
    },
    // Add setupFilesAfterEnv to run global setup before tests
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
};
