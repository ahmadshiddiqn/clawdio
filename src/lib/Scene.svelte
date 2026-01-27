<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import { ContactShadows, Float, Grid, OrbitControls } from '@threlte/extras';
  import Face from './Face.svelte';
  import type { AnimationState } from './Animations';

  export let state: AnimationState = 'idle';
  export let onPoke: () => void = () => {};

  let autoRotate = true;
  let rotationY = 0;
  let rotationX = 0;

  useTask((delta) => {
    if (autoRotate) {
      rotationY += delta * 0.1;
    }
  });
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
    on:end={() => autoRotate = true}
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

<!-- Ground shadow -->
<ContactShadows
  opacity={0.3}
  scale={10}
  blur={2}
  far={4}
  resolution={256}
  color="#000000"
/>

<!-- Subtle grid for depth -->
<Grid
  infiniteGrid
  fadeDistance={20}
  sectionColor="#D4A373"
  cellColor="#E8D5C4"
  sectionThickness={1}
  cellThickness={0.5}
  position.y={-1.5}
/>

<!-- Background gradient effect -->
<T.Mesh position.z={-10}>
  <T.PlaneGeometry args={[50, 50]} />
  <T.MeshBasicMaterial color="#FFF8F0" />
</T.Mesh>
