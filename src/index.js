import app from './app.js';

const SERVER_HOST = process.env.SERVER_HOST || "0.0.0.0";
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
  console.log(`Server running at http://${SERVER_HOST}:${PORT}`);
});

