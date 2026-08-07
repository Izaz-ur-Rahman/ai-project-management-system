const app = require("./src/app");
const env = require("./src/config/env");
const connectDatabase = require("./src/config/database");

const startServer = async () => {
    await connectDatabase();

    app.listen(env.port, () => {
        console.log(
            `Server running on port ${env.port} in ${env.nodeEnv} mode`
        );
    });
};

startServer();