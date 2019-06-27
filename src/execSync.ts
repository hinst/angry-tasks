const { exec } = require('child_process');

export function execSync(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const process = exec(command, (err, stdout, stderr) => {
            if (err == null)
                resolve(stdout);
            else
                reject(stderr);
        });
    });
}

