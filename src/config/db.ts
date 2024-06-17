import mongoose from 'mongoose';
import { DB_CONNECTION_STRING } from './constants';
import { logger } from './logger';

const databaseConnection = async () => {
  try {
    const conn = await mongoose.connect(DB_CONNECTION_STRING, {} as mongoose.ConnectOptions);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Failed to connect to MongoDB ${err}`);
    process.exit(1);
  }
};

export default databaseConnection;