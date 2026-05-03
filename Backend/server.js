

// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// /* ===============================
//    ROUTES IMPORT
// ================================= */
// const authRoutes = require('./routes/auth');
// const sampleRoutes = require('./routes/sample');
// const testRoutes = require('./routes/tests');


// /* ===============================
//    API ROUTES
// ================================= */
// app.use('/api/auth', authRoutes);
// app.use('/api/sample', sampleRoutes);
// app.use('/api/tests', testRoutes);


// /* ===============================
//    HOME ROUTE
// ================================= */
// app.get('/', (req, res) => {
//   res.send('Backend Running...');
// });


// /* ===============================
//    TEMP SAMPLE MEMORY API
// ================================= */
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

// app.get('/api/samples', (req, res) => {
//   res.json(samples);
// });


// /* ===============================
//    SERVER START
// ================================= */
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


/* ===============================
   MIDDLEWARE
================================= */
app.use(cors());
app.use(express.json());

/* ===============================
   DEBUG LOGGER (must be before routes)
================================= */
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

/* ===============================
   ROUTES IMPORT
================================= */
const authRoutes = require('./routes/auth');
const sampleRoutes = require('./routes/sample');
const testRoutes = require('./routes/tests');
const trackingRoutes = require('./routes/tracking'); // ✅ IMPORTANT FIX

/* ===============================
   API ROUTES
================================= */
app.use('/api/auth', authRoutes);
//app.use('/api/samples', sampleRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/tracking', trackingRoutes); // ✅ FIXED

/* ===============================
   HOME ROUTE
================================= */
app.get('/', (req, res) => {
  res.send('🚀 Backend Running Successfully');
});

/* ===============================
   TEMP SAMPLE API (testing purpose)
================================= */
// let samples = [];

// app.post('/api/samples', (req, res) => {

//   const sample = {
//     id: Date.now().toString(),
//     ...req.body,
//     createdAt: new Date()
//   };
// CREATE SAMPLE
app.post('/api/samples', (req, res) => {
  const sample = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };

//   samples.push(sample);

//   console.log('Saved Data:', samples);
  console.log("Saved Sample:", sample);
});

//   res.json(sample);
// });

// app.get('/api/samples/:userId', (req, res) => {

//   const userId = req.params.userId;

//   const userSamples = samples.filter(s => s.userId == userId);

//   res.json(userSamples);
// });
// GET SAMPLES
app.get('/api/samples', (req, res) => {
  res.json(samples);
});

/* ===============================
   404 HANDLER
================================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

/* ===============================
   GLOBAL ERROR HANDLER
================================= */
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message
  });
});

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
