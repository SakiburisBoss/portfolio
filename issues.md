[18:32:58.147] Running build in Washington, D.C., USA (East) – iad1
[18:32:58.148] Build machine configuration: 2 cores, 8 GB
[18:32:58.176] Cloning github.com/SakiburisBoss/portfolio (Branch: main, Commit: 4d93710)
[18:32:58.774] Previous build caches not available
[18:32:59.009] Cloning completed: 833.000ms
[18:32:59.468] Running "vercel build"
[18:33:00.236] Vercel CLI 42.2.0
[18:33:00.593] Installing dependencies...
[18:33:04.321] npm warn deprecated q@1.5.1: You or someone you depend on is using Q, the JavaScript Promise library that gave JavaScript developers strong feelings about promises. They can almost certainly migrate to the native JavaScript promise now. Thank you literally everyone for joining me in this bet against the odds. Be excellent to each other.
[18:33:04.322] npm warn deprecated
[18:33:04.322] npm warn deprecated (For a CapTP with native promises, see @endo/eventual-send and @endo/captp)
[18:33:19.325] 
[18:33:19.326] added 449 packages in 18s
[18:33:19.326] 
[18:33:19.327] 148 packages are looking for funding
[18:33:19.327]   run `npm fund` for details
[18:33:19.588] Detected Next.js version: 15.3.3
[18:33:19.599] Running "npm run build"
[18:33:19.983] 
[18:33:20.010] > portfolio@0.1.0 prebuild
[18:33:20.010] > npm run lint:fix
[18:33:20.011] 
[18:33:20.178] 
[18:33:20.179] > portfolio@0.1.0 lint:fix
[18:33:20.179] > eslint --fix .
[18:33:20.179] 
[18:33:23.748] 
[18:33:23.749] /vercel/path0/app/projects/page.tsx
[18:33:23.749]   10:10  error  'auth' is defined but never used  @typescript-eslint/no-unused-vars
[18:33:23.749] 
[18:33:23.750] /vercel/path0/components/projects/project-detail.tsx
[18:33:23.750]   12:10  error  'useEffect' is defined but never used  @typescript-eslint/no-unused-vars
[18:33:23.750]   15:10  error  'set' is defined but never used        @typescript-eslint/no-unused-vars
[18:33:23.750] 
[18:33:23.750] /vercel/path0/scripts/fix-user-images.ts
[18:33:23.750]   67:9  error  'fixUserImages' is assigned a value but never used  @typescript-eslint/no-unused-vars
[18:33:23.750] 
[18:33:23.750] ✖ 4 problems (4 errors, 0 warnings)
[18:33:23.750] 
[18:33:23.892] Error: Command "npm run build" exited with 1
[18:33:24.188] 
[18:33:27.456] Exiting build container