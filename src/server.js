import { createApp } from "./app.js";
import { config } from "./config/index.js";
import { startNotificationJob } from "./jobs/notificationJob.js";

const app = createApp();


app.listen(3001, () => {
    console.info(`Server running on port : localhost:${config.PORT}`);
    console.info(`Environment : ${config.ENV}`);
    startNotificationJob()
})
