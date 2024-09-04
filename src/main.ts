import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

// TODO fix the App type error on kitless setup when svelte 5 is released
const app = mount(App as any, { target: document.getElementById('app')! })

export default app