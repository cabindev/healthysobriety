//server.js
const express = require('express');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const path = require('path');
const port = process.env.PORT || 3000;

app.prepare().then(() => {
    const server = express();

    // ตั้งค่าเสิร์ฟไฟล์ static จากโฟลเดอร์ public
    server.use('/images', express.static(path.join(__dirname, 'public/images')));

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${port}`);
    });
});