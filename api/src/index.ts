import { config } from "./config/env";
import app from "./server";

const PORT = config.PORT;

app.listen(PORT, () => console.log("Running on PORT:", PORT));
