import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'
import App from './App.vue'
import router from './router'
import './styles/reset.css'
import './styles/variables.css'
import './styles/typography.css'
import './styles/transitions.css'
import './styles/patterns.css'
import './styles/print.css'

registerSW({ immediate: true })

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
