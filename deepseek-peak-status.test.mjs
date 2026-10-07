import test from "node:test"
import assert from "node:assert/strict"
import { formatStatus, isDeepSeekProvider, isPeakAt } from "./deepseek-peak-status.mjs"

const utc = (hour, minute = 0) => new Date(Date.UTC(2026, 0, 15, hour, minute))

test("DeepSeek peak windows use inclusive start and exclusive end", () => {
  assert.equal(isPeakAt(utc(0, 59)), false)
  assert.equal(isPeakAt(utc(1, 0)), true)
  assert.equal(isPeakAt(utc(3, 59)), true)
  assert.equal(isPeakAt(utc(4, 0)), false)
  assert.equal(isPeakAt(utc(5, 59)), false)
  assert.equal(isPeakAt(utc(6, 0)), true)
  assert.equal(isPeakAt(utc(9, 59)), true)
  assert.equal(isPeakAt(utc(10, 0)), false)
})

test("status contains state, Warsaw local time, and next transition", () => {
  assert.equal(formatStatus(utc(1, 0), "Europe/Warsaw"), "DS PEAK | LOCAL 02:00 CET | next 05:00 CET")
  assert.equal(formatStatus(utc(4, 0), "Europe/Warsaw"), "DS OFF-PEAK | LOCAL 05:00 CET | next 07:00 CET")
})

test("isDeepSeekProvider matches only the native DeepSeek provider", () => {
  assert.equal(isDeepSeekProvider("deepseek"), true)
  assert.equal(isDeepSeekProvider("deepseek/deepseek-v4-pro"), true)
  assert.equal(isDeepSeekProvider("opencode-go/deepseek-v4.1-flash"), false)
  assert.equal(isDeepSeekProvider("openrouter/deepseek/deepseek-chat"), false)
  assert.equal(isDeepSeekProvider("nvidia/deepseek-ai/deepseek-v4.1-flash"), false)
  assert.equal(isDeepSeekProvider("deepseek-ai"), false)
  assert.equal(isDeepSeekProvider(undefined), false)
})
