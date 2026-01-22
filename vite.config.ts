import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const resolveBase = (command: 'build' | 'serve') => {
  if (command !== 'build') {
    return '/'
  }

  if (process.env.VITE_BASE) {
    return process.env.VITE_BASE
  }

  const repository = process.env.GITHUB_REPOSITORY
  if (!repository) {
    return '/'
  }

  const [, repoName] = repository.split('/')
  if (!repoName || repoName.endsWith('.github.io')) {
    return '/'
  }

  return `/${repoName}/`
}

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: resolveBase(command),
  build: {
    outDir: 'docs',
  },
}))
