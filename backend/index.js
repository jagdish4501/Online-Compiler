import http from 'http';

const PORT = 5000;
import { CPP_Compiler, JS_Compiler, Python_Compiler } from './executer.js';

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Connection with cross Origin are enbled' }));
    }
    else if (req.method === 'POST' && req.url === '/compile') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', async () => {
            let success = true; // Flag to track success or failure
            let result;

            try {
                const { code, language, input } = JSON.parse(data);
                if (language === 'cpp' || language === 'c')
                    result = await CPP_Compiler(code, input);
                else if (language === 'javascript')
                    result = await JS_Compiler(code, input);
                else if (language === 'python')
                    result = await Python_Compiler(code, input);
            } catch (error) {
                console.error('Error parsing JSON or executing code:', error);
                success = false;
            }

            // Send response based on success flag
            if (success) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: result }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error in parsing JSON or executing code' }));
            }
        });

    } else {
        res.writeHead(202, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
