const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const userRoutes = require('./routes/userRoutes');

io.on('connection', (socket) => {
    console.log('A user connected');
    // เมื่อมีการส่งข้อความจาก client
    socket.on('message', (message) => {
        console.log('Message received:', message);
        // ส่งข้อความกลับไปยัง client
        io.emit('message', message);
    });
    // เมื่อ client ตัดการเชื่อมต่อ
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

app.use(bodyParser.json());
app.use('/api/user', userRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});