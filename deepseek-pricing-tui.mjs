import { jsx } from "@opentui/solid/jsx-runtime"
import { createSignal, onCleanup } from "solid-js"
import { formatStatus, installClock } from "./deepseek-pricing-status.mjs"

async function tui(api) {
  api.slots.register({
    slots: {
      app_bottom: () => {
        const [now, setNow] = createSignal(new Date())
        const disposeClock = installClock(setNow)
        onCleanup(disposeClock)

        return jsx("box", {
          flexDirection: "row",
          paddingLeft: 1,
          paddingRight: 1,
          children: jsx("text", {
            children: () => formatStatus(now()),
          }),
        })
      },
    },
  })
}

export { tui }
export default { id: "deepseek-pricing", tui }
