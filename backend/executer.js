import { spawn } from 'child_process';
import fs from 'fs/promises';  // Use fs/promises for promise-based file operations

async function CPP_Compiler(cppCode, input) {
    await fs.writeFile('./TempFile/temp_cpp.cpp', cppCode);
    const compileCommand = ['g++', './TempFile/temp_cpp.cpp', '-o', './TempFile/temp_cpp'];
    const compileProcess = spawn(compileCommand[0], compileCommand.slice(1));

    const compilePromise = new Promise((resolve, reject) => {
        compileProcess.on('exit', (code) => {
            if (code === 0) {
                resolve('./TempFile/temp_cpp.exe');
            } else {
                reject('Compilation failed');
            }
        });
    });
    try {
        const compiledExecutablePath = await Promise.race([compilePromise, new Promise((_, reject) => setTimeout(() => reject('Compilation timeout'), 1000))]);// if Compilation take more than 1sec then reject the Compilation
        const runCommand = compiledExecutablePath;
        const runProcess = spawn(runCommand);
        runProcess.stdin.write(input);
        runProcess.stdin.end();
        let output = '';
        runProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        runProcess.stderr.on('data', (error) => {
            throw error.toString();
        });
        await Promise.race([new Promise((resolve) => runProcess.on('close', resolve)), new Promise((_, reject) => setTimeout(() => reject('Execution timeout'), 1000))]);
        // if Execution take more than 1 sec then stop Execution
        return output;
    } catch (error) {
        return error;
    }
}


async function JS_Compiler(jsCode, input) {
    await fs.writeFile('./TempFile/temp_js.js', jsCode);
    const runCommand = ['node', './TempFile/temp_js.js'];
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
        // Wait for the execution to finish or throw an error if it takes more than 1 second
        const result = await Promise.race([runPromise, new Promise((_, reject) => setTimeout(() => reject('Execution timeout'), 1000))]);
        return result;
    } catch (error) {
        return error;
    }
}

async function Python_Compiler(pythonCode, input) {
    await fs.writeFile('./TempFile/temp_python.py', pythonCode);
    const runCommand = ['python', './TempFile/temp_python.py'];
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
        // Wait for the execution to finish or throw an error if it takes more than 1 second
        const result = await Promise.race([runPromise, new Promise((_, reject) => setTimeout(() => reject('Execution timeout'), 1000))]);
        return result;
    } catch (error) {
        return error;
    }
}

export { CPP_Compiler, JS_Compiler, Python_Compiler }