// import express from 'express';
// import dotenv from 'dotenv';
// import dbConnect from './config/db.js';
// import baseURL from './routes/index.js';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// dotenv.config();

// const app = express();

// // Middlewares
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: true,
//     credentials: true
// }));

// const PORT = process.env.PORT || 5000;

// // Server connection
// const server = app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// // DB connection
// dbConnect();

// // Logging requests
// app.use((req, res, next) => {
//     console.log(`Route: ${req.method}:${req.originalUrl}`);
//     next();
// });

// // Routes
// app.use('/api', baseURL);

// // Handle Errors
// process.on('unhandledRejection', (reason, p) => {
//     console.error('Unhandled Rejection at:', p, 'reason:', reason);
//     server.close(() => process.exit(1));
// });
// process.on('uncaughtException', (e) => {
//     console.error('Uncaught exception:', e);
//     server.close(() => process.exit(1));
// });
