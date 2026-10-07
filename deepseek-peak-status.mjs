const PEAK_WINDOWS_UTC = [
  [60, 240], // 01:00–04:00 UTC
  [360, 600], // 06:00–10:00 UTC
]

export function isPeakAt(date) {
  const minute = date.getUTCHours() * 60 + date.getUTCMinutes()
  return PEAK_WINDOWS_UTC.some(([start, end]) => minute >= start && minute < end)
}

export const DEEPSEEK_PROVIDER_ID = "deepseek"

/**
 * True when a provider id (or a `provider/model` reference) is the native
 * DeepSeek provider. The banner is only shown while DeepSeek pricing applies,
 * so `opencode-go/deepseek-*`, `openrouter/deepseek/*` and the like are not
 * DeepSeek.
 */
export function isDeepSeekProvider(reference) {
  if (typeof reference !== "string") return false
  const slash = reference.indexOf("/")
  const id = slash === -1 ? reference : reference.slice(0, slash)
  return id === DEEPSEEK_PROVIDER_ID
}

function nextTransitionAt(date) {
  const dayStart = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  const currentMinute = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60
  const transitionMinutes = [60, 240, 360, 600]
  const nextMinute = transitionMinutes.find((minute) => minute > currentMinute)
  return new Date(dayStart + (nextMinute ?? 24 * 60 + 60) * 60_000)
}

export function systemTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
}

function localTime(date, timeZone) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date)
}

export function formatStatus(date, timeZone = systemTimeZone()) {
  const state = isPeakAt(date) ? "PEAK" : "OFF-PEAK"
  const local = localTime(date, timeZone)
  const next = localTime(nextTransitionAt(date), timeZone)
  return `DS ${state} | LOCAL ${local} | next ${next}`
}

export function installClock(onTick, intervalMs = 30_000) {
  const timer = setInterval(() => onTick(new Date()), intervalMs)
  return () => clearInterval(timer)
}

export { PEAK_WINDOWS_UTC }
