const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

let token;

const mockUser = {
  email: "test@example.com",
  password: "password123",
  preferences: {
    categories: ["technology"],
    languages: ["en"],
    theme: "dark",
  },
};

describe("Authentication Routes", () => {
  test("POST /auth/register - Successful registration", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered");
  });

  test("POST /auth/register - Email already registered", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(mockUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already registered");
  });

  test("POST /auth/login - Successful login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: mockUser.email,
        password: mockUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();

    token = response.body.token;
  });

  test("POST /auth/login - Invalid credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: mockUser.email,
        password: "wrongpassword",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });
});

describe("Preferences Routes", () => {
  test("GET /preferences - Fetch user preferences", async () => {
    const response = await request(app)
      .get("/preferences")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(mockUser.preferences);
  });

  test("PUT /preferences - Update user preferences", async () => {
    const newPreferences = {
      categories: ["science"],
      languages: ["fr"],
    };

    const response = await request(app)
      .put("/preferences")
      .set("Authorization", `Bearer ${token}`)
      .send({ preferences: newPreferences });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Preferences updated");
  });
});

describe("News Routes", () => {
  test("GET /news - Fetch news with preferences", async () => {
    const response = await request(app)
      .get("/news")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test("GET /news - Unauthorized without token", async () => {
    const response = await request(app).get("/news");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
