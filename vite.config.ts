import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })

export default defineConfig(({ mode }) => {

  dotenv.config({
    path: `.env.${mode}`
  });

  const env = loadEnv(mode, process.cwd());
  const port: number = parseInt(env.VITE_PORT);

  console.log("MODE: ", mode);
  console.log("PORT: ", port);

  return {
    plugins: [react()],
    server: {
      port: port,
    },
    preview: {
      port: port,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // 'process.env': env
      'process.env.VITE_PORT': JSON.stringify(env.VITE_PORT),
    }
  };
});