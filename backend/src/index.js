import express from "express";
import cors from 'cors';
import 'dotenv/config';
import connectDB from "./config/mongodb.js";
import userRoutes from "./routes/userRoute.js";
import productRoutes from "./routes/productRoute.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./routes/orderRoute.js"
import adminRoutes from "./routes/adminRoute.js";
import path from "path";
import { ensureUploadDirs } from "./utils/uploadtoDir.js";

// app config
const app = express()
const port = process.env.PORT
connectDB()



// middlewares
app.use(express.json());
app.use(cookieParser());

ensureUploadDirs();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "https://mustafamart.store"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// api endpoints
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("Backend is Runing")
});

app.listen(port, () => console.log(`Server started on port ${port}`))