import './assets/global.css'

import App from './App.svelte'

const ua = window.navigator.userAgent;
let app;
if(!ua.includes('Chrom')) {
  alert('Currently only Chrome browsers are supported. Other browser support will be available soon')
} else {

  app = new App({
    target: document.getElementById('app')
  })
}

export default app;

