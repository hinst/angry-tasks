import * as Vue from 'vue/dist/vue.common.js';
import * as fs from 'fs';
import { Process } from './processReader';
import { createVueComponent } from './vue';
import { IconManager } from './iconManager';

class TaskListItem {
    template = fs.readFileSync('./src/taskListItem.html').toString();
    propProcess = new Process();
    dataChildrenVisible = false;
    dataImgSrc = null;
    compExecutablePath() {
        const path = this.propProcess.executablePath;
        return path.length > 0 ? path : '(unavailable)';
    }
    created() {
        this.loadIcon();
    }
    async loadIcon() {
        const data = (await new IconManager().loadImageData(this.compExecutablePath())).trim();
        if (data.length > 0)
            this.dataImgSrc = 'data:image/png;base64,' + data;
        else
            this.dataImgSrc = 'third/iconfinder_office-06_3045423-i.png';
    }
}
Vue.component('task-list-item', createVueComponent(new TaskListItem()));