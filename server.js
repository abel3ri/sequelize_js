const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({
  path: `${__dirname}/.env`,
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
