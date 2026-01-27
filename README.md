# Clawdio 🦊

Cute orange blob character showing Dio's AI status in real-time!

## Features

- 🎮 **Interactive** - Tap/click to poke the blob!
- 💤 **Status States** - Idle, Thinking, Active
- 🎨 **Cute Animations** - Blinking, breathing, surprised reactions
- 📱 **Responsive** - Works on mobile and desktop
- 🍎 **iOS Widget Support** - Add to Home Screen for widget-like experience

## Status Mapping

| API State | Animation | Description |
|-----------|-----------|-------------|
| `sleeping` | 💤 Idle | No activity > 5 min |
| `thinking` | 🤔 Bored | 1-5 min since last activity |
| `active` | 😊 Idle | Recently active (< 1 min) |

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Adding to Home Screen (iOS)

1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. The blob will appear as an app icon!

## Tech Stack

- SvelteKit
- Threlte (Three.js for Svelte)
- TypeScript
