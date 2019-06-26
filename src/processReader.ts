const { exec } = require('child_process');

const windowsCommandTemplate = 'wmic process get $keys /format:csv';
/** Note: on my Windows 10, I get PrivatePageCount already in bytes, not in pages. */
const windowsMemoryPageSize = 4 * 1024;

export class Process {
    name: string;
    memory: number;
    processId: number;
    parentProcessId: number;
    children: Process[] = [];
    copyInfo(info: ProcessInfo) {
        this.processId = info.ProcessId;
        this.name = info.Name;
        this.memory = info.PrivatePageCount;
        this.parentProcessId = info.ParentProcessId;
    }
    get memoryText(): string {
        return getReadableBytes(this.memory);
    }
    get totalMemory(): number {
        let memory = this.memory;
        for (const child of this.children)
            memory += child.totalMemory;
        return memory;
    }
    get totalMemoryText(): string {
        return getReadableBytes(this.totalMemory);
    }
    static createFromInfo(info: ProcessInfo) {
        const process = new Process();
        process.copyInfo(info);
        return process;
    }
}

export class ProcessInfo {
    ProcessId: number = 0;
    Name: string = '';
    ParentProcessId: number = 0;
    PrivatePageCount: number = 0;
    UserModeTime: number = 0;
}
const processInfoKeys = Object.keys(new ProcessInfo());

/** Indexes of CSV cells */
class BaseProcessInfoColumns {
    ProcessId: number = -1;
    Name: number = -1;
    ParentProcessId: number = -1;
    PrivatePageCount: number = -1;
    UserModeTime: number = -1;
}
const baseProcessInfoColumnsKeys = Object.keys(new BaseProcessInfoColumns());

class ProcessInfoColumns extends BaseProcessInfoColumns {
    parseHeader(csvRowText: string) {
        const cells = csvRowText.split(',');
        for (const key of baseProcessInfoColumnsKeys) {
            this[key] = cells.indexOf(key);
        }
    }
    parseRow(rowText: string) {
        const cells = rowText.split(',');
        const info = new ProcessInfo();
        info.ProcessId = parseInt(cells[this.ProcessId]);
        info.Name = cells[this.Name];
        info.ParentProcessId = parseInt(cells[this.ParentProcessId]);
        info.PrivatePageCount = parseInt(cells[this.PrivatePageCount]);
        info.UserModeTime = parseInt(cells[this.UserModeTime]);
        return info;
    }
}

const processInfoKeysText = processInfoKeys.join(',');
export const windowsCommand = windowsCommandTemplate.replace('$keys', processInfoKeysText);

function simpleExec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const process = exec(command, (err, stdout, stderr) => {
            resolve(stdout);
        });
    });
}

function parseProcessInfos(output: string) {
    const rows = output.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    const headerRow = rows[0];
    const contentRows = rows.slice(1);
    const header = new ProcessInfoColumns();
    header.parseHeader(headerRow);
    const infos = contentRows.map(rowText => header.parseRow(rowText));
    return infos;
}

export class ProcessReader {
    async read() {
        const output = await simpleExec(windowsCommand);
        const infos = parseProcessInfos(output);
        const processes = this.compose(infos);
        return processes;
    }
    compose(infos: ProcessInfo[]) {
        const processes: Process[] = infos.map(info => Process.createFromInfo(info));
        const processList: Process[] = [];
        for (const process of processes) {
            const parentProcess = processes.find(p => p.processId == process.parentProcessId);
            if (parentProcess != null)
                parentProcess.children.push(process);
            else
                processList.push(process);
        }
        return processList;
    }
}

/** source https://ourcodeworld.com/articles/read/713/converting-bytes-to-human-readable-values-kb-mb-gb-tb-pb-eb-zb-yb-with-javascript */
function getReadableBytes(bytes: number) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const x = (bytes / Math.pow(1024, i));
    return x.toFixed(2) + ' ' + sizes[i];
}
