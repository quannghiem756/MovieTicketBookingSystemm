const { io } = require('socket.io-client');
const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
const SHOWTIME_ID = '6951028dc910a6df968a9766'; // Use an existing showtime ID if possible, or any string
const SEAT_ID = 'A1';

async function testSync() {
  console.log('Connecting to socket...');
  const socket = io(BACKEND_URL);

  socket.on('connect', () => {
    console.log('Connected to socket. Joining room:', SHOWTIME_ID);
    socket.emit('join_showtime', SHOWTIME_ID);
  });

  socket.on('seat_held', (data) => {
    console.log('SUCCESS: Received seat_held event:', data);
    socket.disconnect();
    process.exit(0);
  });

  // Wait a bit for socket to join room
  setTimeout(async () => {
    console.log('Simulating holdSeat REST call...');
    try {
      // We need to login first to get a token
      console.log('Logging in...');
      const loginRes = await axios.post(`${BACKEND_URL}/api/users/login`, {
        email: 'admin@example.com', // Using seeded admin
        password: 'admin123'
      });
      const token = loginRes.data.accessToken;

      console.log('Sending hold request...');
      await axios.post(`${BACKEND_URL}/api/bookings/hold`, {
        showtimeId: SHOWTIME_ID,
        seatId: SEAT_ID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Hold request sent. Waiting for socket event...');
    } catch (error) {
      console.error('Error during REST call:', error.response?.data || error.message);
      socket.disconnect();
      process.exit(1);
    }
  }, 2000);

  // Timeout after 10 seconds
  setTimeout(() => {
    console.log('FAILED: Timeout waiting for seat_held event');
    socket.disconnect();
    process.exit(1);
  }, 10000);
}

testSync();
