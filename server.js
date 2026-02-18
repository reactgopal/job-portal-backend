const app = require('./src/app');
const connectDB = require('./src/config/db');
const { PORT } = require('./src/config/env');

const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀  Server running!`);
    console.log(`🏠  Local:   http://localhost:${PORT}`);
    console.log(`🌐  Network: http://192.168.100.16:${PORT}`);
  });
};

startServer();
