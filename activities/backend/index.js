import express from "express";

const app = express();
const PORT = 3000;

//get -> display name, var name="Charles",
//post -> logic, if username="charles" password="Pass123" success else failed;

app.use(express.json());

app.get("/getName", (req, res) => {
  var name = "Charles";
  res.status(200).json(name);
});

app.post("/login", (req, res) => {
  var { username, password } = req.body;
  if (username == "charles" && password == "Pass123") {
    res.status(200).json({
      message: "Login Successfull",
      status: "success",
    });
  } else {
    res.status(403).json({
      message: "Invalid username or password.",
      status: "failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
