import { createApp } from 'vue';
import App from './App.vue';

import { library } from '@fortawesome/fontawesome-svg-core';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
  faPen,
  faTrash,
  faBars,
  faFileCode,
  faSave,
  faFolderOpen,
  faFolder,
  faFileCirclePlus,
  faFolderPlus,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faPen,
  faTrash,
  faBars,
  faFileCode,
  faSave,
  faFolderOpen,
  faFolder,
  faFileCirclePlus,
  faFolderPlus
);

const app = createApp(App);

app.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app');
