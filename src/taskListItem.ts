import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { Process } from './processReader';
import { createVueComponent } from './vue';

class TaskListItem {
    template = fs.readFileSync('./src/taskListItem.html').toString();
    propProcess: Process = new Process();
}
Vue.component('task-list-item', createVueComponent(new TaskListItem()));