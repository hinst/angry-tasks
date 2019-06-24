import * as Vue from 'vue/dist/vue.common.js';
import { createVueComponent } from './vue';
import * as fs from 'fs';

class TaskListViewer {
    template = fs.readFileSync('./src/taskListViewer.html').toString();
}
Vue.component('task-list-viewer', createVueComponent(new TaskListViewer()))