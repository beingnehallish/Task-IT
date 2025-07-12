// server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Allow Vite frontend
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/task-it-database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Handle Socket.io connections
io.on('connection', (socket) => {
  console.log('🔌 A user connected');

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`🔊 User joined room: ${room}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('❎ A user disconnected');
  });
});

// Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes); // ✅ Use /api/auth/login, /api/auth/register, etc.

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);


// Start server
server.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
