const app = require("./src/app");
const env = require("./src/config/env");
const connectDatabase = require("./src/config/database");
const errorMiddleware =  require("./src/middleware/errorMiddleware");
const startServer = async () => {
    await connectDatabase();

    app.listen(env.port, () => {
        console.log(
            `Server running on port ${env.port} in ${env.nodeEnv} mode`
        );
    });
};
app.use(errorMiddleware);
startServer();