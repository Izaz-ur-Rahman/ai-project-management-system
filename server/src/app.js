const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Project Management API is running",
    });
});

app.use("/api", routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

module.exports = app;