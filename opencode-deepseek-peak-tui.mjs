import { Plugin } from "@opencode/plugin/tui"
import { jsx } from "@opentui/solid/jsx-runtime"
import { createSignal } from "solid-js"
import { formatStatus, installClock, isPeakAt } from "./deepseek-peak-status.mjs"

const TICK_MS = 30_000
const DEFAULT_SLOT = "prompt.footer.status"

/**
 * OpenCode DeepSeek peak/off-peak banner.
 *
 * Rendered in the prompt footer (`prompt.footer.status` by default; override
 * with the `slot` plugin option). The text is the theme's error colour while
 * the current UTC time is inside a DeepSeek peak window, and muted otherwise,
 * so PEAK stands out at a glance.
 */
async function setup(context) {
  const [now, setNow] = createSignal(new Date())
  const stopClock = installClock(setNow, TICK_MS)

  const slot =
    typeof context.options?.slot === "string" && context.options.slot.length > 0
      ? context.options.slot
      : DEFAULT_SLOT

  context.ui.slot({
    append: slot,
    render: () =>
      jsx("text", {
        wrapMode: "none",
        truncate: true,
        get fg() {
          return isPeakAt(now()) ? context.theme.text.feedback.error.base : context.theme.text.muted
        },
        get children() {
          return formatStatus(now())
        },
      }),
  })

  return () => stopClock()
}

export default Plugin.define({ id: "opencode-deepseek-peak", setup })
export { setup }
