// Copyright 2026 Cloudflare, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// During local development (npm run dev / npm run preview) we relay /api to the
// Go backend so the browser talks to a single origin, mirroring what nginx does
// in the docker-compose setup. The backend host can be overridden with the
// BACKEND_URL env var (used by nothing yet, handy for native runs).
const backend = process.env.BACKEND_URL || 'http://localhost:11110'

// `proxy` is Vite's own dev-server config key (server.proxy); it must keep that
// name even though, in our domain language, it is "the blind relay" that carries
// API traffic. Renaming this key would silently disable /api forwarding.
const proxy = {
  '/api': {
    target: backend,
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [vue()],
  server: { host: true, port: 5173, proxy },
  preview: { host: true, port: 5173, proxy },
})
