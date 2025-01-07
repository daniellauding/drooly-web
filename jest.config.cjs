/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json',
      useESM: true,
      diagnostics: {
        ignoreCodes: [1343, 151001]
      },
      astTransformers: {
        before: [
          {
            path: 'node_modules/ts-jest-mock-import-meta',
            options: { 
              metaObjectReplacement: { 
                env: {
                  VITE_FIREBASE_API_KEY: 'test-api-key',
                  VITE_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
                  VITE_FIREBASE_PROJECT_ID: 'test-project-id',
                  VITE_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
                  VITE_FIREBASE_MESSAGING_SENDER_ID: 'test-sender-id',
                  VITE_FIREBASE_APP_ID: 'test-app-id',
                  VITE_FIREBASE_MEASUREMENT_ID: 'test-measurement-id',
                  VITE_GA_TRACKING_ID: 'test-ga-id'
                }
              }
            }
          }
        ]
      }
    }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@firebase|firebase)/)'
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  moduleDirectories: ['node_modules', 'src'],
  testTimeout: 10000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
}; 