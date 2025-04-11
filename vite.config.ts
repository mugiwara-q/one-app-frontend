import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import fs from 'fs'
import dotenv from 'dotenv'; 
//dotenv.config({ path: '../.env' });  // global file
dotenv.config({ path: '.env' });  // Load environment variables from .env file

export default defineConfig({

  envDir: '\'', //'../', for global
  preview: { // FOR PRODUCTION
    port: Number(process.env.VITE_FRONTEND_PORT),
  },
  server: { // FOR DEV
    port : Number(process.env.VITE_FRONTEND_PORT),
    https: {
      key: fs.readFileSync('./.cert/key.pem'),
      cert: fs.readFileSync('./.cert/cert.pem'),
    },
  },

  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      },
      {
        find: '@assets',
        replacement: path.resolve(__dirname, './src/assets')
      },
      {
        find: '@utils',
        replacement: path.resolve(__dirname, './src/_utils')
      },
      {
        find: '@auth',
        replacement: path.resolve(__dirname, './src/pages/auth')
      },
      {
        find: '@public',
        replacement: path.resolve(__dirname, './src/pages/public')
      },
      {
        find: '@private',
        replacement: path.resolve(__dirname, './src/pages/private')
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, './src/pages')
      },
      {
        find: '@ui',
        replacement: path.resolve(__dirname, './src/components/ui')
      },
      {
        find: '@layout',
        replacement: path.resolve(__dirname, './src/components/layout')
      },
      {
        find: '@partials',
        replacement: path.resolve(__dirname, './src/components/partials')
      },
      {
        find: '@components',
        replacement: path.resolve(__dirname, './src/components')
      },
      {
        find: '@styles',
        replacement: path.resolve(__dirname, './src/styles')
      },
    ]
  }

})
