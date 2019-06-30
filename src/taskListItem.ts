import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { Process } from './processReader';
import { createVueComponent } from './vue';

class TaskListItem {
    template = fs.readFileSync('./src/taskListItem.html').toString();
    propProcess = new Process();
    dataChildrenVisible = false;
    compExecutablePath() {
        const path = this.propProcess.executablePath;
        return path.length > 0 ? path : '(unavailable)';
    }
}
Vue.component('task-list-item', createVueComponent(new TaskListItem()));