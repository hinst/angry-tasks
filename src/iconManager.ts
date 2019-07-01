import { simpleExec } from "./simpleExec";

const fs = require('fs');
const iconFunctionScript = fs.readFileSync('third/Get-Icon.ps1');
const iconCommand = "Get-Icon -Path 'C:/windows/system32/WindowsPowerShell/v1.0/PowerShell.exe' -ToBase64";

class IconManager {
    async loadImage(path: string) {
        simpleExec('PowerShell '
    }
}