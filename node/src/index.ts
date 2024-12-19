import app from "./app";
import { PORT } from "./settings";

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
