import { simpleExec as simpleExec } from './simpleExec';
import { getReadableBytes } from './format';

const windowsCommandTemplate = 'wmic process get $keys /format:csv';
/** Note: on my Windows 10, I get PrivatePageCount already in bytes, not in pages. */
const windowsMemoryPageSize = 4 * 1024;

export class Process {
    name: string;
    memory: number;
    processId: number;
    parentProcessId: number;
    children: Process[] = [];
    executablePath: string;
    copyInfo(info: ProcessInfo) {
        this.processId = info.ProcessId;
        this.name = info.Name;
        this.memory = info.PrivatePageCount;
        this.parentProcessId = info.ParentProcessId;
        this.executablePath = info.ExecutablePath;
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
    updateFrom(other: Process) {
        this.name = other.name;
        this.memory = other.memory;
        this.processId = other.processId;
        this.parentProcessId = other.parentProcessId;
        this.executablePath = other.executablePath;
        Processes.updateMerge(this.children, other.children);
    }
}

type ProcessMap = {[key: string]: Process};

export class Processes {
    static parseInfos(output: string) {
        const rows = output.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        const headerRow = rows[0];
        const contentRows = rows.slice(1);
        const header = new ProcessInfoColumns();
        header.parseHeader(headerRow);
        const infos = contentRows.map(rowText => header.parseRow(rowText));
        return infos;
    }
    static toMap(processes: Process[]): ProcessMap {
        const map: ProcessMap = {};
        for (const process of processes)
            map['' + process.processId] = process;
        return map;
    }
    static updateMerge(oldProcesses: Process[], newProcesses: Process[]) {
        const newMap = Processes.toMap(newProcesses);
        const deletions: number[] = [];
        for (let i = 0; i < oldProcesses.length; i++) {
            const oldProcess = oldProcesses[i];
            const isDeleted = newMap['' + oldProcess.processId] == null;
            if (isDeleted)
                deletions.push(i);
        }
        for (let i = deletions.length - 1; i >= 0; i--) {
            oldProcesses.splice(deletions[i], 1);
        }

        const oldMap = Processes.toMap(oldProcesses);
        for (let i = 0; i < newProcesses.length; i++) {
            const newProcess = newProcesses[i];
            const isInserted = oldMap['' + newProcess.processId] == null;
            if (isInserted)
                oldProcesses.splice(i, 0, newProcess);
        }

        for (const oldProcess of oldProcesses) {
            const newProcess = newMap['' + oldProcess.processId];
            if (newProcess != null)
                oldProcess.updateFrom(newProcess);
            else
                console.error("Can't find new process for", oldProcess);
        }
    }
}

export class ProcessInfo {
    ProcessId: number = 0;
    Name: string = null;
    ParentProcessId: number = 0;
    PrivatePageCount: number = 0;
    UserModeTime: number = 0;
    ExecutablePath: string = null;
}
const processInfoKeys = Object.keys(new ProcessInfo());
const processInfoKeysText = processInfoKeys.join(',');
export const windowsCommand = windowsCommandTemplate.replace('$keys', processInfoKeysText);

/** Indexes of CSV cells */
class BaseProcessInfoColumns {
    ProcessId: number = -1;
    Name: number = -1;
    ParentProcessId: number = -1;
    PrivatePageCount: number = -1;
    UserModeTime: number = -1;
    ExecutablePath: number = -1;
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
        info.ExecutablePath = cells[this.ExecutablePath];
        return info;
    }
}

export class ProcessReader {
    async read() {
        const output = await simpleExec(windowsCommand);
        const infos = Processes.parseInfos(output);
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

