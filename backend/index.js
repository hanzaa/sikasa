const fs = require('fs');
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors'); // Import cors module
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use cors middleware
app.use(cors());

// Routing
const userRouter = require('./routes/router');
app.use(userRouter);

// Create the 'encrypted' directory if it doesn't exist
const encryptedDir = './encrypted_files';
if (!fs.existsSync(encryptedDir)) {
  fs.mkdirSync(encryptedDir);
}

// Connect to the database
const db = require('./configs/db.config')
db.connect((err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Database Connected')
})

// Set up the server
port = process.env.PORT
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






