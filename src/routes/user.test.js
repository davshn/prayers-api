const server = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;
const { conection } = require("../models/index.js");
const { User } = require("../models/index");

describe("Register should create users correctly avoiding bad info", () => {
  const newUser = {
    name: "Test",
    lastname: "Test",
    dateOfBirth: "10/12/2020",
    email: "test@test.com",
    password: "Test123*",
    version: "1.0",
  };

  beforeAll(async () => {
    await conection.sync({ force: true, logging: false });
  });

  test("It should create a new user on correct info", async () => {
    const response = await request(server).post("/user/register").send(newUser);
    const user = await User.findOne({ where: { email: newUser.email } });
    expect(user.name).toBe("Test");
    expect(response.statusCode).toBe(200);
  });

  test("It should respond 400 on repeated email", async () => {
    newUser.name = "Testing";
    const response = await request(server).post("/user/register").send(newUser);
    const user = await User.findOne({ where: { email: newUser.email } });
    expect(user.name).toBe("Test");
    expect(response.statusCode).toBe(400);
  });

  test("It should respond with a 403 status on bad info", async () => {
    const response = await request(server).post("/user/register").send({});
    expect(response.statusCode).toBe(403);
  });

  test("It should respond with a 426 status on bad version", async () => {
    newUser.version = "0.0";
    const response = await request(server).post("/user/register").send(newUser);
    expect(response.statusCode).toBe(426);
  });
});

describe("Login should give a correct token avoiding bad info", () => {
  const newUser = {
    email: "test@test.com",
    password: "Test123*",
    version: "1.0",
    deviceInfo: "Testing",
  };

  test("It should login on right info", async () => {
    const response = await request(server).post("/user/login").send(newUser);
    const token = response.body.token;
    const decoded = jwt.verify(token, TOKEN_KEY);
    expect(response.statusCode).toBe(200);
    expect(decoded.email).toBe(newUser.email);
  });

  test("It should respond with a 403 status on bad info", async () => {
    const response = await request(server).post("/user/login").send({});
    expect(response.statusCode).toBe(403);
  });

  test("It should respond with a 402 status on bad user or password", async () => {
    newUser.email = "testing@testing.com";
    const response = await request(server).post("/user/login").send(newUser);
    expect(response.statusCode).toBe(402);
  });

  test("It should respond with a 426 status on bad version", async () => {
    newUser.version = "0.0";
    const response = await request(server).post("/user/login").send(newUser);
    expect(response.statusCode).toBe(426);
  });
});
