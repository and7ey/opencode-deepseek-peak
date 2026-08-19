import test from "node:test"
import assert from "node:assert/strict"
import { formatStatus, isPeakAt } from "./deepseek-pricing-status.mjs"

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
  assert.match(formatStatus(utc(1, 0)), /^DS PEAK \| PL [0-9]{2}:[0-9]{2} \| next [0-9]{2}:[0-9]{2}$/)
  assert.match(formatStatus(utc(4, 0)), /^DS OFF-PEAK \| PL [0-9]{2}:[0-9]{2} \| next [0-9]{2}:[0-9]{2}$/)
})
