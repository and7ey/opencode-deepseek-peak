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

test("isPeakAt is off-peak all weekend", () => {
  // 2026-01-16 Fri, 17 Sat, 18 Sun, 19 Mon
  const at = (day, hour) => new Date(Date.UTC(2026, 0, day, hour))
  assert.equal(isPeakAt(at(16, 2)), true)
  assert.equal(isPeakAt(at(16, 8)), true)
  assert.equal(isPeakAt(at(17, 2)), false)
  assert.equal(isPeakAt(at(17, 8)), false)
  assert.equal(isPeakAt(at(18, 2)), false)
  assert.equal(isPeakAt(at(18, 8)), false)
  assert.equal(isPeakAt(at(19, 2)), true)
})

test("formatStatus skips the weekend for the next transition", () => {
  const saturday = new Date(Date.UTC(2026, 0, 17, 2, 0))
  assert.equal(formatStatus(saturday, "Europe/Warsaw"), "DS OFF-PEAK | LOCAL 03:00 CET | next 02:00 CET")
})
