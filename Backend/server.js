// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// const authRoutes = require('./routes/auth');
// const sampleRoutes = require('./routes/sample');

// app.use('/api/auth', authRoutes);
// app.use('/api/sample', sampleRoutes);

// app.get('/', (req, res) => {
//   res.send("Backend Running...");
// });

// let samples = [];

// app.post('/api/samples', (req, res) => {
//     const sample = {
//         id: Date.now().toString(),
//         ...req.body,   // ✅ includes barcode
//         createdAt: new Date()
//     };

//     samples.push(sample);
//     console.log("Saved Data:", samples);
//     res.json(sample);
// });

// app.get('/api/samples', (req, res) => {
//     res.json(samples);
// });

// app.listen(5000, () => console.log('Server running on port 5000'));

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json());

/* ===============================
   ROUTES IMPORT
================================= */
const authRoutes = require('./routes/auth');
const sampleRoutes = require('./routes/sample');
const testRoutes = require('./routes/tests');


/* ===============================
   API ROUTES
================================= */
app.use('/api/auth', authRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/tests', testRoutes);


/* ===============================
   HOME ROUTE
================================= */
app.get('/', (req, res) => {
  res.send('Backend Running...');
});


/* ===============================
   TEMP SAMPLE MEMORY API
================================= */
// let samples = [];

// app.post('/api/samples', (req, res) => {

//   const sample = {
//     id: Date.now().toString(),
//     ...req.body,
//     createdAt: new Date()
//   };

//   samples.push(sample);

//   console.log('Saved Data:', samples);

//   res.json(sample);
// });

// app.get('/api/samples/:userId', (req, res) => {

//   const userId = req.params.userId;

//   const userSamples = samples.filter(s => s.userId == userId);

//   res.json(userSamples);
// });


/* ===============================
   SERVER START
================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});