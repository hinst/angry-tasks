import * as Vue from 'vue/dist/vue.common.js';
import { createVueComponent } from './vue';
import * as fs from 'fs';
import { ProcessReader, windowsCommand, Process, Processes } from './processReader';
import './taskListItem';

class TaskListViewer {
    template = fs.readFileSync('./src/taskListViewer.html').toString();
    dataProcesses: Process[] = [];
    constructor() {
    }
    created() {
        this.read();
        setInterval(() => this.read(), 2000);
    }
    async read() {
        const processes = await new ProcessReader().read();
        Processes.updateMerge(this.dataProcesses, processes);
    }
    refresh() {
        this.read();
    }
}
Vue.component('task-list-viewer', createVueComponent(new TaskListViewer()));