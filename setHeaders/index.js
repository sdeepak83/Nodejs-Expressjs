const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();

const PORT = 4000;
app.use(express.urlencoded({ extended: false }));
app.get("/users", (req, res) => {
  const html = `
  <ul>
  ${users.map((user) => `<li> ${user.first_name}</li>`).join("")}
  </ul>
  `;

  res.send(html);
});

// Here we can set the header

app.get("/api/users", (req, res) => {
  // res.setHeader("x-myname", "Deepak singh");
  console.log(req.headers);
  return res.json(users);
});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "sucess", id: users.length });
  });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    res.send(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating user" });
      }
      res.json({ status: "success", user: updatedUser });
    });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users.splice(userIndex, 1); // Remove the user

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting user" });
      }
      res.json({ status: "success", message: "User deleted" });
    });
  });

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Port is running on ${PORT}`);
  } else {
    console.log(error);
  }
});
