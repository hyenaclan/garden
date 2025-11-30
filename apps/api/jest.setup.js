// Set IS_LOCAL for local JWT decoding in tests
if (!process.env.IS_LOCAL) {
  process.env.IS_LOCAL = "true";
}

// Set NODE_ENV to test for test-specific code paths
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}
