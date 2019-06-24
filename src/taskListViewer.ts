import * as Vue from 'vue/dist/vue.common.js';
import { createVueComponent } from './vue';
import * as fs from 'fs';
import { ProcessReader, windowsCommand } from './processReader';

class TaskListViewer {
    template = fs.readFileSync('./src/taskListViewer.html').toString();
    constructor() {
        console.log('command', windowsCommand);
        this.test();
    }
    async test() {
        console.log(await new ProcessReader().read());
    }
}
Vue.component('task-list-viewer', createVueComponent(new TaskListViewer()))