import * as Vue from 'vue/dist/vue.common.js';
import { createVueComponent } from './vue';
import * as fs from 'fs';
import { ProcessReader, windowsCommand, Process } from './processReader';
import './taskListItem';

class TaskListViewer {
    template = fs.readFileSync('./src/taskListViewer.html').toString();
    dataProcesses: Process[] = [];
    constructor() {
        console.log('command', windowsCommand);
        this.test();
    }
    async test() {
        console.log(await new ProcessReader().read());
    }
    created() {
        this.read();
    }
    async read() {
        const processes = await new ProcessReader().read();
        this.dataProcesses = processes;
    }
}
Vue.component('task-list-viewer', createVueComponent(new TaskListViewer()))