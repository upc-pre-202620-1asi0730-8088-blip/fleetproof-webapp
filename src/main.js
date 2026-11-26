import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Material from '@primeuix/themes/material';
import { definePreset } from '@primeuix/themes';
import { Button, InputText, Select, Textarea, Dialog, DataTable, Column, Message, Tag, Toast } from 'primevue';
import ToastService from 'primevue/toastservice';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './style.css';
import App from './app.vue';
import router from './router.js';
import pinia from './pinia.js';
import i18n from './i18n.js';

const FleetProof = definePreset(Material, {
  semantic: { primary: { 50: '#EFF8F9', 100: '#E5F3F4', 200: '#B7DFE3', 300: '#81C6CE', 400: '#42A4AF', 500: '#087F8C', 600: '#08717D', 700: '#085D67', 800: '#094B53', 900: '#103C42', 950: '#09282D' } }
});
const app = createApp(App).use(pinia).use(i18n).use(router)
  .use(PrimeVue, { theme: { preset: FleetProof, options: { darkModeSelector: false } }, ripple: true, license: import.meta.env.VITE_PRIME_UI_LICENSE_KEY })
  .use(ToastService);
for (const [name, component] of Object.entries({ Button, InputText, Select, Textarea, Dialog, DataTable, Column, Message, Tag, Toast })) {
  app.component('pv-' + name.replace(/[A-Z]/g, (letter, index) => (index ? '-' : '') + letter.toLowerCase()), component);
}
app.mount('#app');
