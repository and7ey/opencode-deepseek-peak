# OpenCode DeepSeek Pricing Status

A small [OpenCode](https://opencode.ai) TUI plugin that shows whether the current DeepSeek API time is **PEAK** or **OFF-PEAK**.

Example:

```text
DS PEAK | LOCAL 10:40 CEST | next 12:00 CEST
```

The schedule is calculated locally from UTC. No API request or credentials are needed.

## Schedule

According to the [official DeepSeek API pricing page](https://api-docs.deepseek.com/quick_start/pricing/), peak pricing is:

- `01:00–04:00 UTC`
- `06:00–10:00 UTC`

The intervals are half-open: `01:00` is peak, `04:00` is off-peak, `06:00` is peak, and `10:00` is off-peak.

The displayed clock uses the computer's system timezone, including automatic daylight-saving changes. The timezone abbreviation is shown after the local time (for example, `CET`, `CEST`, or `PST`).

## Install

Clone the repository and install its runtime dependencies:

```bash
git clone https://github.com/kolodziejm/opencode-deepseek-pricing.git
cd opencode-deepseek-pricing
npm install
```

Then add the plugin to the **TUI configuration**, not `opencode.json`. OpenCode 1.18.18 loads TUI plugins from `tui.json`.

For a profile-specific setup, edit the profile's `tui.json`:

```json
{
  "$schema": "https://opencode.ai/tui.json",
  "plugin": [
    "/absolute/path/to/opencode-deepseek-pricing/deepseek-pricing-tui.mjs"
  ]
}
```

Restart OpenCode after changing the configuration.

## Development

Run the deterministic boundary tests:

```bash
npm test
```

The plugin uses the OpenCode 1.18.18 TUI plugin API and registers a component in the `app_bottom` slot. It refreshes the displayed time every 30 seconds and cleans up the timer when the plugin is disposed.

## License

MIT
