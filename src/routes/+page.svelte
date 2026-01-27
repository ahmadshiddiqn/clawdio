<script lang="ts">
  import { Canvas } from '@threlte/core';
  import { onMount } from 'svelte';
  import Scene from '$lib/Scene.svelte';
  import type { AnimationState } from '$lib/Animations';

  const API_URL = import.meta.env.VITE_DIO_STATUS_URL || '/api/dio-status';

  let animationState: AnimationState = 'idle';
  let statusInfo: any = null;
  let loading = true;
  let clickCount = 0;
  let secretClicks = 0;
  let showSecret = false;

  const statusLabels: Record<AnimationState, { text: string; emoji: string }> = {
    idle: { text: 'Idle / Boring', emoji: '💤' },
    bored: { text: 'Bored / Thinking', emoji: '🤔' },
    surprised: { text: 'Surprised!', emoji: '😮' },
    happy: { text: 'Happy!', emoji: '😊' },
    excited: { text: 'Excited!', emoji: '🎉' },
    sleepy: { text: 'Sleepy...', emoji: '😴' }
  };

  async function fetchStatus() {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        statusInfo = await res.json();

        // Map API status to animation state
        if (statusInfo.state === 'sleeping') {
          animationState = 'idle'; // Could use 'sleepy' with eyes closed
        } else if (statusInfo.state === 'thinking') {
          animationState = 'bored';
        } else if (statusInfo.state === 'active') {
          animationState = 'idle';
        }
      }
    } catch (e) {
      console.error('Failed to fetch status:', e);
    } finally {
      loading = false;
    }
  }

  function handlePoke() {
    clickCount++;
    secretClicks++;

    // Easter egg: 7 clicks in quick succession
    if (secretClicks === 7) {
      animationState = 'excited';
      showSecret = true;
      secretClicks = 0;
      setTimeout(() => {
        showSecret = false;
        animationState = 'idle';
      }, 2000);
      return;
    }

    animationState = 'surprised';

    if (clickCount % 5 === 0) {
      // Special celebration
      setTimeout(() => {
        animationState = 'excited';
        setTimeout(() => {
          animationState = 'idle';
        }, 1200);
      }, 300);
    } else {
      setTimeout(() => {
        animationState = 'happy';
        setTimeout(() => {
          animationState = 'idle';
        }, 1000);
      }, 300);
    }
  }

  let pollInterval: ReturnType<typeof setInterval>;
  onMount(() => {
    fetchStatus();
    pollInterval = setInterval(fetchStatus, 10000);
    return () => { if (pollInterval) clearInterval(pollInterval); };
  });
</script>

<div class="container">
  {#if showSecret}
    <div class="secret-overlay">
      <span>🎉 SURPRISE! 🎉</span>
    </div>
  {/if}

  <div class="canvas-wrapper">
    <Canvas>
      <Scene {state={animationState} onPoke={handlePoke} />
    </Canvas>
  </div>

  <div class="ui-overlay">
    <div class="header">
      <h1>🦊 Clawdio</h1>
      <p class="tagline">Dio's status companion</p>
    </div>

    <div class="status-card">
      {#if loading}
        <p class="loading">Loading...</p>
      {:else if statusInfo}
        <div class="status-emoji">{statusLabels[animationState].emoji}</div>
        <h2>{statusLabels[animationState].text}</h2>
        <div class="status-details">
          <div class="detail-row">
            <span class="label">State:</span>
            <span class="value">{statusInfo.state}</span>
          </div>
          <div class="detail-row">
            <span class="label">Last Activity:</span>
            <span class="value">{statusInfo.sessionAgeMinutes?.toFixed(1)} min ago</span>
          </div>
          <div class="detail-row">
            <span class="label">Model:</span>
            <span class="value">{statusInfo.model}</span>
          </div>
        </div>
      {:else}
        <p class="error">Failed to load status</p>
      {/if}
    </div>

    <div class="instructions">
      <p>👆 Tap/click the blob!</p>
      <p class="hint">🐣 Easter eggs await...</p>
      <p class="refresh-hint">Status updates every 10s</p>
    </div>
  </div>
</div>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #FFF8F0 0%, #FFE4C4 100%);
    min-height: 100vh;
    overflow: hidden;
  }

  .container {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .secret-overlay {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    font-weight: bold;
    color: #FF6B6B;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    animation: bounce 0.5s ease infinite alternate;
    z-index: 100;
  }

  @keyframes bounce {
    from { transform: translateX(-50%) translateY(0); }
    to { transform: translateX(-50%) translateY(-10px); }
  }

  .canvas-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .ui-overlay {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    pointer-events: none;
  }

  .ui-overlay > * {
    pointer-events: auto;
  }

  .header {
    text-align: center;
    margin-top: env(safe-area-inset-top);
  }

  h1 {
    font-size: 2rem;
    color: #8B5E3C;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }

  .tagline {
    font-size: 0.9rem;
    color: #A67B5B;
  }

  .status-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 20px 30px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(139, 94, 60, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .status-emoji {
    font-size: 3rem;
    margin-bottom: 8px;
  }

  .status-card h2 {
    font-size: 1.2rem;
    color: #5D4037;
    margin-bottom: 12px;
  }

  .status-details {
    font-size: 0.85rem;
    color: #795548;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 4px 0;
    border-bottom: 1px solid rgba(139, 94, 60, 0.1);
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .label {
    color: #8D6E63;
  }

  .value {
    font-weight: 600;
    color: #5D4037;
  }

  .loading, .error {
    color: #8D6E63;
    font-style: italic;
  }

  .instructions {
    text-align: center;
    color: #A67B5B;
    font-size: 0.9rem;
  }

  .hint {
    font-size: 0.8rem;
    color: #8B5E3C;
    margin-top: 4px;
  }

  .refresh-hint {
    font-size: 0.75rem;
    opacity: 0.7;
    margin-top: 4px;
  }

  @media (max-width: 480px) {
    h1 { font-size: 1.5rem; }
    .status-card { padding: 16px 20px; width: 90%; }
    .status-emoji { font-size: 2.5rem; }
  }
</style>
