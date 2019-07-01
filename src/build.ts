import { simpleExec } from './simpleExec';

const targetFolder = 'angry-tasks-win32-x64';
async function buildExec(command) {
    console.log("> " + command);
    const output = await simpleExec(command);
    console.log(output);
}
async function main() {
    //await buildExec(`dir`);
    try {
        await buildExec(`rmdir /Q /S ${targetFolder}`);
    } catch (e) {
        console.log('Could not delete target folder');
    }
    const ignored = `--ignore="src|tsconfig\\.json|\\.vscode|${targetFolder}\\.zip|${targetFolder}|third-ref"`;
    await buildExec(`node_modules\\.bin\\electron-packager . ${ignored} --app-copyright="Alexander Savinykh, 2019"`);
    await buildExec(`xcopy src\\*.html angry-tasks-win32-x64\\src\\`);
    await buildExec(`xcopy src\\*.css angry-tasks-win32-x64\\resources\\app\\src\\`);
    await buildExec(`xcopy third angry-tasks-win32-x64\\`);

    await buildExec(`del ${targetFolder}.zip`);
    await buildExec(`"C:\\Program Files\\7-Zip\\7z.exe" a -tzip -bd ${targetFolder} ${targetFolder}`);
}
main();
