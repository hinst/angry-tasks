const { exec, spawn } = require('child_process');

export function simpleExec(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const process = exec(command, (err, stdout, stderr) => {
            if (err == null)
                resolve(stdout);
            else
                reject(stderr);
        });
    });
}

export function simpleExecWithInput(command: string, input: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const process = spawn(command);
        process.stdin.write(input);
        process.stdin.write('\n');
        const outputArray: string[] = [];
        process.stdout.on('data', data => {
            outputArray.push(data.toString());
        });
        process.on('exit', (code) => {
            if (code == 0) {
                resolve(outputArray.join());
            } else
                reject(code);
        });    
    });
}

