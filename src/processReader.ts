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

const windowsCommand = 'wmic process get processid,commandline';

class ProcessReader {
    read() {

    }
}