require('source-map-support').install();
import * as fs from 'fs';

import * as Vue from 'vue/dist/vue.common.js';
import { createVueComponent } from './vue';
import './taskListViewer';

class AppComponent {
    el = '#app';
    template = fs.readFileSync('./src/app.html').toString();
}

new Vue(createVueComponent(new AppComponent()));