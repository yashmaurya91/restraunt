const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'info';

// Create a new MongoClient
mongoose.connect(`${url}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected successfully to MongoDB server");

    // Serve static files from the public directory
    app.use('/public', express.static(path.join(__dirname, 'public'), {
      setHeaders: function(res, path, stat) {
        res.set('Content-Type', 'text/css');
      }
    }));

    // Define the reservation schema
    const reservationSchema = new mongoose.Schema({
      name: String,
      email: String,
      phone: String,
      date: Date,
      time: String
    });

    // Create the Reservation model
    const Reservation = mongoose.model('Reservation', reservationSchema);

    // Route for the index.html file
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'index.html'));
    });

    // Route for the home.html file
    app.get('/home.html', (req, res) => {
      res.sendFile(path.join(__dirname, 'home.html'));
    });

    app.use(express.urlencoded({ extended: true }));

    app.post('/submit', async (req, res) => {
      const name = req.body.name;
      const email = req.body.email;
      const phone = req.body.phone;
      const date = req.body.date;
      const time = req.body.time;

      try {
        const reservation = await Reservation.findOne({ date: date, time: time });
        if (reservation) {
          // Reservation with same date and time already exists
          res.send('Sorry, there is already a reservation at this time. Please choose a different time.');
        } else {
          // Check if there is available slot
          const count = await Reservation.countDocuments({ date: date, time: time });
          if (count >= 5) {
            // No available slot
            res.send('Sorry, there are no available slots at this time. Please choose a different time.');
          } else {
            // Create a new Reservation document
            const newReservation = new Reservation({
              name: name,
              email: email,
              phone: phone,
              date: date,
              time: time
            });

            // Save the Reservation document to the database
            await newReservation.save();
            console.log('Reservation saved to database');
            res.send('Reservation successful!');
          }
        }
      } catch (err) {
        console.error(err);
        res.send('Reservation failed. Please try again.');
      }
    });

    // Start the server
    app.listen(3000, () => {
      console.log('Server is listening on port 3000');
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB server", err);
  });
