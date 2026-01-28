const express = require('express');
const cors = require('cors');
const app = express();

// 1. Allow React to talk to this server
app.use(cors("*")); 

// 2. A simple test route
app.get('/', (req, res) => {
  res.send("Hello from the Backend! The handshake worked.");
});

// 3. Start the server on Port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});