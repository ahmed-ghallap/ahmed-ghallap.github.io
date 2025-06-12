import './tailwind.css';
import './styles.scss';

import './animations/wavesA.js';
import './animations/heroA.js';

import { createApp } from 'vue';
import  chatComponent  from './components/Chat.vue'

const chatApp = document.querySelector('#chat-app');
if (chatApp) {
  const app = createApp(chatComponent);
  app.mount(chatApp);
}