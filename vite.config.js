import {defineConfig,loadEnv} from 'vite';
import {createLocalHandler} from './server/local.js';
export default defineConfig(({mode})=>({
 base:'./',
 plugins:[{
  name:'rotom-local-api',
  configureServer(server){
   // Unprefixed keys stay in this Node process. Vite exposes only VITE_ keys to React.
   const env={...loadEnv(mode,process.cwd(),''),...process.env};
   server.middlewares.use('/api/profile',createLocalHandler(env));
  }
 }]
}));
