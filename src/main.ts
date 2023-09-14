import { createApp } from 'vue';
import 'reset-css/reset.css';
import './style.css';

import App from './App.vue';

import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { FaTimes, FaChevronDown, FaChevronUp } from 'oh-vue-icons/icons';

addIcons(FaTimes, FaChevronDown, FaChevronUp);

const app = createApp(App);
app.component('VIcon', OhVueIcon);
app.mount('#app');
