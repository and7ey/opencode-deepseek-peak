import { Plugin } from "@opencode/plugin/tui"
import { jsx } from "@opentui/solid/jsx-runtime"
import { createSignal, Show } from "solid-js"
import { formatStatus, installClock, isDeepSeekProvider, isPeakAt } from "./deepseek-peak-status.mjs"

const TICK_MS = 30_000
const DEFAULT_SLOT = "prompt.footer.status"

/**
 * OpenCode DeepSeek peak/off-peak banner.
 *
 * Shown only while the selected provider is the native DeepSeek provider
 * (`context.ui.model.current()`), since the peak windows only apply to the
 * DeepSeek API. Rendered in the prompt footer (`prompt.footer.status` by
 * default; override with the `slot` plugin option), in the theme's error colour
 * during peak and muted otherwise.
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
      jsx(Show, {
        get when() {
          return isDeepSeekProvider(context.ui.model.current()?.providerID)
        },
        get children() {
          return jsx("text", {
            wrapMode: "none",
            truncate: true,
            get fg() {
              return isPeakAt(now()) ? context.theme.text.feedback.error.base : context.theme.text.muted
            },
            get children() {
              return formatStatus(now())
            },
          })
        },
      }),
  })

  return () => stopClock()
}

export default Plugin.define({ id: "opencode-deepseek-peak", setup })
export { setup }
