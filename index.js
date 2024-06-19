const express = require("express");
const connectedToDb = require("./config/connectedToDb");
const cors = require("cors");
require("dotenv").config();

connectedToDb();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/user", require("./Routes/userRoutes"));
app.use("/api/post", require("./Routes/postRoutes"));
app.use("/api/comment", require("./Routes/commentRoutes"));
const port = process.env.port || 9000;
app.listen(port, () => {
  console.log(`server is listining port ${port}`);
});
