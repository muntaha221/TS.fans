const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');
const http = require('http');
const { Server } = require('socket.io');

const Album = require('./models/Album');
const Song = require('./models/Song');
const seedData = require('./seedData');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/songs', require('./routes/songRoutes'));
app.use('/api/fans', require('./routes/fanRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Socket.io for Live Chat
io.on('connection', (socket) => {
  console.log('A user connected for Live Chat');
  
  socket.on('send_message', (data) => {
    // Broadcast the incoming message to all OTHER connected clients instantly
    socket.broadcast.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const seedDatabase = async () => {
  console.log('Clearing existing database collections...');
  await Album.deleteMany({});
  await Song.deleteMany({});
  
  const albumCount = await Album.countDocuments();
  if (albumCount === 0) {
    console.log('Seeding exhaustive eras into database...');
    for (const data of seedData) {
      const album = await Album.create({
        title: data.title,
        releaseDate: data.releaseDate,
        coverImage: data.coverImage,
        description: data.description
      });
      const songsToInsert = data.songs.map(song => ({
        title: song.title,
        duration: song.duration,
        previewUrl: song.previewUrl,
        albumId: album._id
      }));
      await Song.insertMany(songsToInsert);
    }
    console.log('Exhaustive initial albums and songs seeded successfully!');
  }
};

const startServer = () => {
  seedDatabase();
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Database Connection
const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // Attempt normal connection
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      console.log('Connected to local MongoDB');
      startServer();
    } catch (err) {
      console.warn('⚠️ Could not connect to local MongoDB. Initializing temporary In-Memory Database instead...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('Connected to In-Memory MongoDB');
      startServer();
    }
  } catch (error) {
    console.error('Fatal MongoDB connection error:', error);
  }
};

connectDB();
