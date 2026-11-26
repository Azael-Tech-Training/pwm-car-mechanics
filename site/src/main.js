import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import '@pwm/shared/styles/tokens.css'
import './styles/site.css'

createApp(App).use(router).mount('#app')
