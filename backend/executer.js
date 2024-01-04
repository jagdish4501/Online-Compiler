import { spawn } from 'child_process';
import fs from 'fs/promises';  // Use fs/promises for promise-based file operations

async function writeCodeToFile(code, filePath) {
    await fs.writeFile(filePath, code);
}


async function compileCode(compileCommand, timeout = 1000) {
    const compileProcess = spawn(compileCommand[0], compileCommand.slice(1));
    const compilePromise = new Promise((resolve, reject) => {
        compileProcess.on('exit', (code) => {
            if (code === 0) {
                resolve('Compilation successFull');
            } else {
                reject('Compilation failed');
            }
        });
    });

    try {
        const compiledExecutablePath = await Promise.race([
            compilePromise,
            new Promise((_, reject) => setTimeout(() => reject('Compilation timeout'), timeout))
        ]);
        return compiledExecutablePath;
    } catch (error) {
        throw error;
    }
}

async function executeCode(runCommand, input, timeout = 1000) {
    const runProcess = spawn(runCommand[0], runCommand.slice(1));
    const runPromise = new Promise((resolve, reject) => {
        runProcess.stdin.write(input);
        runProcess.stdin.end();
        let output = '';
        runProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        runProcess.stderr.on('data', (error) => {
            reject(error.toString());
        });
        runProcess.on('close', () => {
            resolve(output);
        });
    });
    try {
        const result = await Promise.race([
            runPromise,
            new Promise((_, reject) => setTimeout(() => reject('Execution timeout'), timeout))
        ]);
        return result;
    } catch (error) {
        throw error;
    }
}


async function CPP_Compiler(Code, input) {
    const sourceFilePath = './TempFile/temp_cpp.cpp';
    const outputFilePath = './TempFile/temp_cpp.exe';
    const timeout = 1000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const compileCommand = ['g++', sourceFilePath, '-o', outputFilePath];
        const isCompiled = await compileCode(compileCommand, timeout);
        console.log(isCompiled)
        const runCommand = [outputFilePath]
        const result = await executeCode(runCommand, input, timeout);
        return result;
    } catch (error) {
        return error;
    }
}
async function java_Compiler(Code, input) {
    const sourceFilePath = 'Temp.java';
    const timeout = 1000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const compileCommand = ['javac', sourceFilePath];
        const isCompiled = await compileCode(compileCommand, timeout);
        console.log(isCompiled);
        const runCommand = ['java', 'Temp']
        const result = await executeCode(runCommand, input, timeout);
        await fs.unlink(sourceFilePath);//code for deleting sourceFile
        await fs.unlink('Temp.class');
        return result;
    } catch (error) {
        return error;
    }
}

async function JS_Compiler(Code, input) {
    const sourceFilePath = './TempFile/temp_js.js';
    const timeout = 1000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const runCommand = ['node', './TempFile/temp_js.js']
        const result = await executeCode(runCommand, input, timeout);
        return result;
    } catch (error) {
        return error;
    }
}

async function Python_Compiler(Code, input) {
    const sourceFilePath = './TempFile/temp_python.js';
    const timeout = 1000;
    try {
        await writeCodeToFile(Code, sourceFilePath);
        const runCommand = ['python', './TempFile/temp_js.js']
        const result = await executeCode(runCommand, input, timeout);
        return result;
    } catch (error) {
        return error;
    }
}

export { CPP_Compiler, JS_Compiler, Python_Compiler, java_Compiler }