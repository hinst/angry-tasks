const { exec } = require('child_process');

const windowsCommandTemplate = 'wmic process get $keys /format:csv';

class Process {
    name: string;
    memory: number;
    processId: number;
    children: Process[];
}

class ProcessInfo {
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
    parseInfo(rowText: string) {
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

function parseProcessInfoHeader(csvRowText: string) {
    const cells = csvRowText.split(',');
    const columns = new ProcessInfoColumns();
    for (const key of baseProcessInfoColumnsKeys) {
        columns[key] = cells.indexOf(key);
    }
    return columns;
}

function readProcessInfos(output: string) {
    const rows = output.split('\n').map(t => t.trim()).filter(t => t.length > 0);
    const headerRow = rows[0];
    const contentRows = rows.slice(1);
    const header = parseProcessInfoHeader(headerRow);
    const infos = contentRows.map(rowText => header.parseInfo(rowText));
    return infos;
}

export class ProcessReader {
    async read() {
        const output = await simpleExec(windowsCommand);
        return readProcessInfos(output);
    }
}