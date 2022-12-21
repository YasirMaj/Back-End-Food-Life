const express = require("express");
const cors = require("cors");
const { postUsers, getUserById } = require("./controllers/user-controller");
const {
  postItem,
  getAllItems,
  getItemById,
} = require("./controllers/item-controller");
const { handleCustomError } = require("./error");

const app = express();

app.use(express.json());

app.post("/api/users", postUsers);

app.get("/api/users/:userId", getUserById);

app.post("/api/users/:userId/items", postItem);

app.get("/api/users/:userId/items", getAllItems);

app.get("/api/users/:userId/items/:itemId", getItemById);

app.all("/*", (req, res) => {
  res.status(404).send("404: URL Not Found")
})

app.use(handleCustomError);

app.listen(9494, () => {
  console.log("listen on 9494");
});

module.exports = app;
