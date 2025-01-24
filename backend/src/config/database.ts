// import { Sequelize } from 'sequelize-typescript';
// import dotenv from 'dotenv';
// import path from 'path';

// // Load environment variables from .env file
// dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// const DB_HOST = process.env.DB_HOST as string;
// const DB_PORT = parseInt(process.env.DB_PORT || '5432', 10);
// const DB_NAME = process.env.DB_NAME as string;
// const DB_USER = process.env.DB_USER as string;
// const DB_PASSWORD = process.env.DB_PASSWORD as string;

// if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
//   throw new Error('Database environment variables are not set properly');
// }

// // Initialize Sequelize instance
// const sequelize = new Sequelize({
//   database: DB_NAME,
//   username: DB_USER,
//   password: DB_PASSWORD,
//   host: DB_HOST,
//   port: DB_PORT,
//   dialect: 'postgres',
//   logging: false, // Set to console.log for debugging
//   models: [path.join(__dirname, '../models')], // Load models dynamically
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
//   define: {
//     timestamps: true, // Add createdAt and updatedAt fields
//     underscored: true, // Use snake_case for columns
//   },
// });

// // Function to establish DB connection
// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     process.exit(1);
//   }
// };

// export { sequelize, connectDB };

// // This file should be placed inside the 'config' folder and named 'database.ts'
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '../models/**/*.{ts,js}')],
  synchronize: true, // use only in development
  logging: true
});

const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { AppDataSource, connectDB };