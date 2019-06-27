import { execSync } from './execSync';

const targetFolder = 'angry-tasks-win32-x64';
async function buildExec(command) {
    console.log("> " + command);
    const output = await execSync(command);
    console.log(output);
}
async function main() {
    //await buildExec(`dir`);
    await buildExec(`del /Q /S ${targetFolder}`);
    await buildExec(`node_modules\\.bin\\electron-packager . --ignore="src|tsconfig\\.json|\\.vscode"`);
    //await buildExec(`xcopy src\\*.html angry-tasks-win32-x64\\src`);
}
main();
