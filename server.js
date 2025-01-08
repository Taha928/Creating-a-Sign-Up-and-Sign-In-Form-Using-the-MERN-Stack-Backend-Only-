const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const http = require('http');
const server = http.createServer(app);
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config();

io.on('connection', (socket) => {
  console.log('a user connected');
});

// ... existing code ...
const categoryRoutes = require('./routes/categoryRoutes');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/categories', categoryRoutes);
// ... existing code ...
// Add body parser middleware
app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/users', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
