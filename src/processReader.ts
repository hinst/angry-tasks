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
const processInfoKeysText = processInfoKeys.join(',');
export const windowsCommand = windowsCommandTemplate.replace('$keys', processInfoKeysText);

function readWimcText() {
    return new Promise((resolve, reject) => {
        const process = exec(windowsCommand, (err, stdout, stderr) => {
            resolve(stdout);
        });
    });
}

export class ProcessReader {
    async read() {
        return await readWimcText();
    }
}