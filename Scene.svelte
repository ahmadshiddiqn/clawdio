<script lang="ts">
  import { T, useFrame } from '@threlte/core';
  import { Float, OrbitControls } from '@threlte/extras';
  import Face from './Face.svelte';
  import type { AnimationState } from './Animations';

  let { state = 'idle', onPoke = () => {} } = $props();

  let autoRotate = $state(true);
  let rotationY = $state(0);
  let rotationX = $state(0);

  useFrame((_, delta) => {
    if (autoRotate) {
      rotationY += delta * 0.1;
    }
  });

  function handleEnd() {
    autoRotate = true;
  }
</script>

<T.PerspectiveCamera
  makeDefault
  position={[0, 1, 5]}
  fov={50}
>
  <OrbitControls
    enableZoom={false}
    enablePan={false}
    autoRotate={autoRotate}
    autoRotateSpeed={0.5}
    maxPolarAngle={Math.PI / 1.8}
    minPolarAngle={Math.PI / 3}
    on:end={handleEnd}
  />
</T.PerspectiveCamera>

<!-- Lighting -->
<T.AmbientLight intensity={0.6} />
<T.DirectionalLight
  position={[5, 5, 5]}
  intensity={1}
  castShadow
/>
<T.DirectionalLight
  position={[-3, 3, 3]}
  intensity={0.4}
  color="#FFE4C4"
/>
<T.PointLight
  position={[0, -2, 3]}
  intensity={0.3}
  color="#FFB6C1"
/>

<!-- Floating Blob -->
<Float
  floatIntensity={0.3}
  rotationIntensity={0.2}
  speed={1.5}
>
  <Face {state} {onPoke} />
</Float>

<!-- Ground shadow (simple circle) -->
<T.Mesh rotation.x={-Math.PI / 2} position.y={-1.4}>
  <T.CircleGeometry args={[1.5, 64]} />
  <T.MeshBasicMaterial color="#000000" transparent opacity={0.15} />
</T.Mesh>

<!-- Background -->
<T.Mesh position.z={-10}>
  <T.PlaneGeometry args={[50, 50]} />
  <T.MeshBasicMaterial color="#FFF8F0" />
</T.Mesh>
