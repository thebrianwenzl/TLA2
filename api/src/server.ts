import app from './app';

// This file is for starting the server
// app.ts exports the Express app for testing

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});