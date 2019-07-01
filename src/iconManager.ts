import { simpleExec, simpleExecWithInput } from "./simpleExec";

const fs = require('fs');
const iconScript: string = fs.readFileSync('src/GetIcon.ps1').toString();
const iconScriptLine = iconScript.split('\n').map(line => line.trim()).join('');

export class IconManager {
    async loadImage(path: string) {
        const scriptLine = iconScriptLine.replace('$1', '\'' + path + '\'');
        console.log(scriptLine);
        const output = await simpleExec('PowerShell ' + scriptLine);
        console.log(output);
    }
}