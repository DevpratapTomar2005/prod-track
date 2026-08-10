import { app } from "./src/app.ts";
import { envConfig } from "./src/config/env.config.ts";
import { connectDB } from "./src/db/db.ts";

connectDB();

app.listen(envConfig.PORT, () => {
  console.log(`Server is running on port ${envConfig.PORT}...`);
});