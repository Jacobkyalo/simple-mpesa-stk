import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import stkRouter from "./routes/stkRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server running at ${port}`);
});

// app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));
app.use(stkRouter);
