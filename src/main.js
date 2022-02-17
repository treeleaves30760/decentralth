import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueDapp } from 'vue-dapp'

const app = createApp(App)
app.use(router)
app.use(VueDapp)
app.mount('#app')
