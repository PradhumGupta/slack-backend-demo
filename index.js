import express from 'express';
import authRouter from './routes/auth.js';
import connectDb from './config/db.js';
import morgan from 'morgan';
import { configDotenv } from "dotenv";
import workspaceRouter from './routes/workspace.route.js';
import channelRouter from './routes/channel.route.js';
configDotenv();

const app = express();

app.use(express.json());
app.use(morgan());

connectDb();

app.get("/", (req, res) => {
    res.send("Slack System");
})

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/workspaces/:workspace_id/channels", channelRouter);


app.listen(3000, () => {
    console.log("Server running on port 3000");
})