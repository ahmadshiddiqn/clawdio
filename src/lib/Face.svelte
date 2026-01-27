<script lang="ts">
  import { T, useFrame } from '@threlte/core';
  import { spring } from 'svelte/motion';
  import type { AnimationState } from './Animations';

  export let state: AnimationState = 'idle';
  export let onPoke: () => void = () => {};

  let rotationY = 0;
  let rotationX = 0;
  let time = 0;
  let clickCount = 0;

  // Spring animations
  const scale = spring(1, { stiffness: 0.1, damping: 0.5 });
  const eyeOpenness = spring(1, { stiffness: 0.15, damping: 0.6 });
  const mouthOpen = spring(0, { stiffness: 0.2, damping: 0.5 });
  const leftEyeX = spring(-0.25, { stiffness: 0.1, damping: 0.5 });
  const rightEyeX = spring(0.25, { stiffness: 0.1, damping: 0.5 });

  // Sound synthesis for cute sounds
  let audioCtx: AudioContext | null = null;

  function playSound(type: 'poke' | 'happy' | 'surprise' | 'bored') {
    if (typeof window === 'undefined') return;

    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch (type) {
      case 'poke':
        // Boing sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
        break;
      case 'happy':
        // Cute chirp
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);

        // Second chirp
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1);
        osc2.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.2);
        gain2.gain.setValueAtTime(0.15, audioCtx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc2.start(audioCtx.currentTime + 0.1);
        osc2.stop(audioCtx.currentTime + 0.25);
        break;
      case 'surprise':
        // Wah! sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
        break;
      case 'bored':
        // Hmm sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(180, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
        break;
    }
  }

  $: {
    switch (state) {
      case 'idle':
        scale.set(1);
        eyeOpenness.set(1);
        mouthOpen.set(0.1);
        break;
      case 'bored':
        scale.set(1);
        eyeOpenness.set(0.6);
        mouthOpen.set(0.03);
        break;
      case 'surprised':
        scale.set(1.2);
        eyeOpenness.set(1.4);
        mouthOpen.set(0.5);
        break;
      case 'happy':
        scale.set(1.1);
        eyeOpenness.set(1.2);
        mouthOpen.set(0.35);
        break;
    }
  }

  useFrame((_, delta) => {
    time += delta;

    if (state === 'idle') {
      const breath = Math.sin(time * 1.5) * 0.03;
      scale.set(1 + breath);

      // Random blink
      if (Math.sin(time * 0.7 + clickCount) > 0.96) {
        eyeOpenness.set(0.05);
        setTimeout(() => eyeOpenness.set(1), 120 + Math.random() * 80);
      }

      rotationY = Math.sin(time * 0.25) * 0.08;
      rotationX = Math.cos(time * 0.2) * 0.03;
    } else if (state === 'bored') {
      rotationX = Math.sin(time * 0.15) * 0.08;
      leftEyeX.set(-0.22);
      rightEyeX.set(0.22);

      // Look down occasionally
      if (Math.sin(time * 0.3) > 0.9) {
        rotationX = 0.15;
      }
    } else if (state === 'surprised') {
      rotationY = (Math.random() - 0.5) * 0.25;
      rotationX = (Math.random() - 0.5) * 0.15;
    } else if (state === 'happy') {
      // Wiggle
      rotationY = Math.sin(time * 8) * 0.1;
      scale.set(1.08 + Math.sin(time * 10) * 0.02);
    }
  });

  function handleClick() {
    clickCount++;
    state = 'surprised';
    playSound('surprise');
    onPoke();

    // Easter egg: every 5th poke does something special
    if (clickCount % 5 === 0) {
      setTimeout(() => {
        state = 'happy';
        playSound('happy');
        setTimeout(() => {
          state = 'idle';
        }, 1500);
      }, 400);
    } else if (clickCount % 3 === 0) {
      // Double surprise
      setTimeout(() => {
        state = 'surprised';
        playSound('poke');
        scale.set(1.3);
        setTimeout(() => scale.set(1), 200);
        setTimeout(() => {
          state = 'idle';
        }, 800);
      }, 200);
    } else {
      setTimeout(() => {
        state = 'happy';
        playSound('happy');
        setTimeout(() => {
          state = 'idle';
        }, 1000);
      }, 300);
    }
  }
</script>

<T.Group rotation.y={rotationY} rotation.x={rotationX} scale={$scale}>
  <!-- Main Body (Orange Blob) -->
  <T.Mesh onClick={handleClick}>
    <T.SphereGeometry args={[1, 64, 64]} />
    <T.MeshStandardMaterial
      color="#D4A373"
      roughness={0.35}
      metalness={0.15}
    />
  </T.Mesh>

  <!-- Left Eye -->
  <T.Group position={[$leftEyeX, 0.2, 0.88]}>
    <T.Mesh>
      <T.SphereGeometry args={[0.2, 32, 32]} />
      <T.MeshStandardMaterial color="white" />
    </T.Mesh>
    <T.Mesh position.z={0.14}>
      <T.SphereGeometry args={[0.09, 16, 16]} />
      <T.MeshStandardMaterial color="#2d3436" />
    </T.Mesh>
    <T.Mesh position={[0.03, 0.04, 0.16]}>
      <T.SphereGeometry args={[0.025, 8, 8]} />
      <T.MeshStandardMaterial color="white" />
    </T.Mesh>
  </T.Group>

  <!-- Right Eye -->
  <T.Group position={[$rightEyeX, 0.2, 0.88]}>
    <T.Mesh>
      <T.SphereGeometry args={[0.2, 32, 32]} />
      <T.MeshStandardMaterial color="white" />
    </T.Mesh>
    <T.Mesh position.z={0.14}>
      <T.SphereGeometry args={[0.09, 16, 16]} />
      <T.MeshStandardMaterial color="#2d3436" />
    </T.Mesh>
    <T.Mesh position={[0.03, 0.04, 0.16]}>
      <T.SphereGeometry args={[0.025, 8, 8]} />
      <T.MeshStandardMaterial color="white" />
    </T.Mesh>
  </T.Group>

  <!-- Mouth -->
  <T.Mesh position={[0, -0.12, 0.92]} scale={[1, $mouthOpen, 1]}>
    <T.TorusGeometry args={[0.14, 0.055, 16, 32, Math.PI]} />
    <T.MeshStandardMaterial color="#7B5E3C" />
  </T.Mesh>

  <!-- Subtle blush (just tint, not prominent) -->
  <T.Mesh position={[-0.55, -0.05, 0.65]}>
    <T.SphereGeometry args={[0.08, 16, 16]} />
    <T.MeshStandardMaterial color="#FFB6C1" transparent opacity={0.3} />
  </T.Mesh>
  <T.Mesh position={[0.55, -0.05, 0.65]}>
    <T.SphereGeometry args={[0.08, 16, 16]} />
    <T.MeshStandardMaterial color="#FFB6C1" transparent opacity={0.3} />
  </T.Mesh>
</T.Group>
