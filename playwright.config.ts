import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  expect: {
    timeout: 5_000
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry"
  }
});