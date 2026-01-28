# AGENTS.md - Clawdio Development Guide

## Project Overview

Clawdio is a SvelteKit application with TypeScript and Threlte (Three.js for Svelte) that renders an interactive 3D orange blob character displaying Dio's AI status in real-time.

**Tech Stack:**
- SvelteKit 2.x with Svelte 5
- TypeScript 5.x
- Threlte 7.x (Three.js wrapper)
- Vite 7.x

---

## Build Commands

```bash
# Development
npm run dev                    # Start dev server at http://localhost:5173

# Production
npm run build                  # Build for production (outputs to .svelte-kit)
npm run preview                # Preview production build locally

# Deployment
./deploy.sh                    # Deploy to GitHub Pages or Vercel
```

**No test framework or linting tools are currently configured.**

---

## Code Style Guidelines

### TypeScript

- Always use `lang="ts"` in Svelte `<script>` blocks
- Enable **strict mode** in `tsconfig.json`
- Use explicit types for props, function parameters, and return types
- Prefer interfaces over type aliases for object shapes
- Use `Record<K, T>` for dictionary types (see `Animations.ts:12`)

```typescript
// Good
interface AnimationConfig {
  scaleBase: number;
  scaleAmplitude: number;
}

// Good - Record for constants
export const ANIMATION_CONFIGS: Record<AnimationState, AnimationConfig> = { ... };
```

### Svelte Components

- Use Svelte 5 syntax with `$state()`, `$derived()`, `$effect()` as needed
- Export props with `export let propName: Type = defaultValue`
- Default callback props: `export let onAction: () => void = () => {}`
- Place `<script>` before markup, `<style>` at end of file
- Use Svelte's built-in `spring` for smooth animations (`svelte/motion`)
- Use `useFrame` hook from Threlte for per-frame updates

```svelte
<script lang="ts">
  import { spring } from 'svelte/motion';
  import { useFrame } from '@threlte/core';

  export let state: AnimationState = 'idle';
  export let onPoke: () => void = () => {};

  const scale = spring(1, { stiffness: 0.1, damping: 0.5 });

  useFrame((_, delta) => {
    time += delta;
    // Animation logic
  });
</script>
```

### Imports Organization

Group imports in this order with blank lines between groups:

1. Node/builtin imports
2. Framework/library imports (alphabetical within groups)
3. Threlte core imports
4. Threlte extras imports
5. Local imports (use `$lib` alias, relative paths for siblings)

```typescript
import { onMount } from 'svelte';
import { Canvas } from '@threlte/core';
import { ContactShadows, Float, Grid } from '@threlte/extras';
import Scene from '$lib/Scene.svelte';
import type { AnimationState } from './Animations';
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `Scene.svelte`, `Face.svelte` |
| Types/Interfaces | PascalCase | `AnimationState`, `AnimationConfig` |
| Variables/Functions | camelCase | `animationState`, `handlePoke()` |
| Constants | UPPER_SNAKE_CASE | `ANIMATION_CONFIGS` |
| Props | camelCase | `state`, `onPoke` |
| Files | kebab-case | `deploy.sh`, `+page.svelte` |

### Threlte/Three.js Patterns

- Use `<T.PerspectiveCamera>`, `<T.Mesh>`, `<T.Group>` etc.
- Use Threlte extras components: `Float`, `ContactShadows`, `Grid`, `OrbitControls`
- Props on components use camelCase: `enableZoom`, `autoRotate`
- For arrays, use `args` prop: `<T.SphereGeometry args={[1, 64, 64]} />`
- Use `position={[x, y, z]}` for 3D coordinates
- Color values as hex strings: `"#D4A373"`

### State Management

- Local component state: `let state: Type = value;`
- Animations: Svelte's `spring` or `tweened` stores
- Reactivity: `$:` reactive statements for state-derived values
- Global state: Pass via props, consider Svelte 5 runes if needed

```typescript
// Reactive statement
$: {
  switch (state) {
    case 'idle':
      scale.set(1);
      break;
    // ...
  }
}
```

### Error Handling

- Use `try/catch` for async operations
- Log errors with `console.error()` (see `+page.svelte:41`)
- Provide fallback UI states (loading, error messages)
- Handle SSR with `typeof window !== 'undefined'` checks

```typescript
async function fetchStatus() {
  try {
    const res = await fetch(API_URL);
    if (res.ok) {
      statusInfo = await res.json();
    }
  } catch (e) {
    console.error('Failed to fetch status:', e);
  } finally {
    loading = false;
  }
}
```

### CSS/Styling

- Use scoped `<style>` blocks in Svelte components
- Global styles: `:global(*)` for resets in `+page.svelte`
- CSS custom properties via `:global()` for theming
- Use `env(safe-area-inset-*)` for mobile/notch support
- Responsive: `@media (max-width: 480px)` blocks

```css
:global(body) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #FFF8F0 0%, #FFE4C4 100%);
}

@media (max-width: 480px) {
  h1 { font-size: 1.5rem; }
}
```

### Audio/Web Audio API

- Initialize lazily: `if (typeof window === 'undefined') return;`
- Store `AudioContext` in component state
- Create oscillators, gain nodes for sound synthesis
- Clean up with `osc.stop()` at appropriate times

```typescript
let audioCtx: AudioContext | null = null;

function playSound(type: 'poke' | 'happy') {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Sound synthesis...
}
```

### File Structure

```
src/
├── lib/
│   ├── Animations.ts     # Animation types and constants
│   ├── Scene.svelte      # 3D scene setup
│   └── Face.svelte       # Blob character component
├── routes/
│   └── +page.svelte      # Main app page
└── app.html
```

---

## Recommended Additions

- Add **ESLint + Prettier** for code formatting and linting
- Add **Vitest** for component/unit testing
- Add **playwright** for E2E testing
- Configure `svelte-check` for type checking in CI

---

## Environment Variables

- `VITE_DIO_STATUS_URL` - API endpoint for Dio status (default: `/api/dio-status`)

---

## Important Notes

- This is a **client-side 3D app** - no server endpoints in this repo
- Three.js objects must be externalized in `vite.config.ts` for SSR
- The blob character uses Threlte's `T` components exclusively
