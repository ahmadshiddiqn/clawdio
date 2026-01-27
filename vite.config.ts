import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['three', '@threlte/core', '@threlte/extras'],
    external: ['three/examples/jsm/objects/GroundedSkybox.js']
  },
  resolve: {
    alias: {
      'three/examples/jsm/objects/GroundedSkybox.js': path.resolve(__dirname, 'src/lib/stubs/GroundedSkybox.js')
    }
  },
  server: {
    fs: {
      allow: ['/home/opc/clawdio', '/workspace']
    }
  }
});
