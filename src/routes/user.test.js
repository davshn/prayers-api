const server = require("../server");
const request = require("supertest");

describe("Server is running", () => {
  test("It should respond with a 404 status in /", async () => {
    const response = await request(server).get("/").send();
    expect(response.statusCode).toBe(404);
  });
});