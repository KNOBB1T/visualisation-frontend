import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import WorkerPlugin from 'worker-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WorkerPlugin()],
})
