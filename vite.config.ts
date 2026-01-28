import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: [],
    external: ['three', '@threlte/core', '@threlte/extras']
  },
  resolve: {
    alias: {
      'three/examples/jsm/objects/GroundedSkybox.js': './src/lib/GroundedSkybox Shim.js'
    }
  },
  server: {
    fs: {
      allow: ['/home/opc/clawdio', '/workspace']
    }
  }
});
