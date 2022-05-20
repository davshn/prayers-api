const server = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;
const { conection } = require("../models/index.js");
const { User } = require("../models/index");

let userToken = "";

describe("Register should create users correctly avoiding bad info", () => {
  const newUser = {
    name: "Test",
    lastname: "Test",
    dateOfBirth: "10/12/2020",
    email: "test@test.com",
    password: "Test123*",
  };

  beforeAll(async () => {
    await conection.sync({ force: true, logging: false });
  });

  test("It should create a new user on correct info", async () => {
    const response = await request(server).post("/user/register").set("Version", "1.0").send(newUser);
    const user = await User.findOne({ where: { email: newUser.email } });
    expect(user.name).toBe("Test");
    expect(response.statusCode).toBe(200);
  });

  test("It should respond 400 on repeated email", async () => {
    newUser.name = "Testing";
    const response = await request(server).post("/user/register").set("Version", "1.0").send(newUser);
    const user = await User.findOne({ where: { email: newUser.email } });
    expect(user.name).toBe("Test");
    expect(response.statusCode).toBe(400);
  });

  test("It should respond with a 403 status on bad info", async () => {
    const response = await request(server).post("/user/register").set("Version", "1.0").send({});
    expect(response.statusCode).toBe(403);
  });

  test("It should respond with a 426 status on bad version", async () => {
    const response = await request(server).post("/user/register").set("Version", "0.0").send(newUser);
    expect(response.statusCode).toBe(426);
  });
});

describe("Login should give a correct token avoiding bad info", () => {
  const newUser = {
    email: "test@test.com",
    password: "Test123*",
    deviceInfo: "Testing",
  };

  test("It should login on right info", async () => {
    const response = await request(server).post("/user/login").set("Version", "1.0").send(newUser);
    userToken = response.body.token;
    const decoded = jwt.verify(userToken, TOKEN_KEY);
    expect(response.statusCode).toBe(200);
    expect(decoded.email).toBe(newUser.email);
  });

  test("It should respond with a 403 status on bad info", async () => {
    const response = await request(server).post("/user/login").set("Version", "1.0").send({});
    expect(response.statusCode).toBe(403);
  });

  test("It should respond with a 402 status on bad user or password", async () => {
    newUser.email = "testing@testing.com";
    const response = await request(server).post("/user/login").set("Version", "1.0").send(newUser);
    expect(response.statusCode).toBe(402);
  });

  test("It should respond with a 426 status on bad version", async () => {
    const response = await request(server).post("/user/login").set("Version", "0.0").send(newUser);
    expect(response.statusCode).toBe(426);
  });
});

describe("Info should give a info of current user avoiding bad info", () => {
  test("It should respond with correct user info", async () => {
    const response = await request(server)
      .get("/user/info")
      .set("Autentication", userToken)
      .send();

    const decoded = jwt.verify(userToken, TOKEN_KEY);
    expect(decoded.email).toBe(response.body.email);
    expect(response.statusCode).toBe(200);
  });

  test("It should respond with a 401 if user is not authenticated", async () => {
    const response = await request(server).get("/user/info").send();
    expect(response.statusCode).toBe(401);
  });
});

describe("Edit should change user info avoiding bad info", () => {
  const userEdit = {
    name: "",
    lastname: "",
    password: "",
  };

  test("It should change only name if only send name", async () => {
    userEdit.name = "changedName";
    const response = await request(server)
      .patch("/user/edit")
      .set("Autentication", userToken)
      .send(userEdit);

    const decoded = jwt.verify(userToken, TOKEN_KEY);
    const user = await User.findOne({ where: { email: decoded.email } });
    expect(user.name).toBe("changedName");
    expect(user.lastname).toBe("Test");
    expect(response.statusCode).toBe(200);
  });

  test("It should change only lastname if only send lastname", async () => {
    userEdit.name = "";
    userEdit.lastname = "changedLast";
    const response = await request(server)
      .patch("/user/edit")
      .set("Autentication", userToken)
      .send(userEdit);

    const decoded = jwt.verify(userToken, TOKEN_KEY);
    const user = await User.findOne({ where: { email: decoded.email } });
    expect(user.name).toBe("changedName");
    expect(user.lastname).toBe("changedLast");
    expect(response.statusCode).toBe(200);
  });

  test("It should respond with a 401 if user is not authenticated", async () => {
    const response = await request(server).get("/user/info").send();
    expect(response.statusCode).toBe(401);
  });
});

describe("Refresh should generate a new token avoiding bad info", () => {
  test("It should refresh on right info", async () => {
    const response = await request(server)
      .get("/user/refresh")
      .set("Autentication", userToken)
      .set("RefreshToken", "Testing")
      .set("Version", "1.0")
      .send();
    userToken = response.body.token;
    const decoded = jwt.verify(userToken, TOKEN_KEY);
    expect(response.statusCode).toBe(200);
    expect(decoded.email).toBe("test@test.com");
  });

  test("It should respond with a 401 if user dit not send a token ", async () => {
    const response = await request(server)
      .get("/user/refresh")
      .set("Autentication", userToken)
      .set("Version", "1.0")
      .send();
    expect(response.statusCode).toBe(401);
  });

  test("It should respond with a 426 status on bad version", async () => {
    const response = await request(server)
      .get("/user/refresh")
      .set("Autentication", userToken)
      .set("RefreshToken", "Testing")
      .set("Version", "0.0")
      .send();
    expect(response.statusCode).toBe(426);
  });
});
