import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueDapp } from 'vue-dapp'
import BootstrapVue3 from 'bootstrap-vue-3'


const app = createApp(App)
app.use(router)
app.use(VueDapp)
app.use(BootstrapVue3)
app.mount('#app')
