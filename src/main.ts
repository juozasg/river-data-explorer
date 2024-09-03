import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

console.log('Hello from main.ts', typeof App, App)

const app = mount(App as any, { target: document.getElementById('app')! })

export default app