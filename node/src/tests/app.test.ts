import request from "supertest";
import app from "../app";
import { JOIN_DIGITALOCEAN, JOIN_ONLYCOINERS } from "../settings";

describe("Express App Routes", () => {
  test("GET / should return JOIN_ONLYCOINERS", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe(JOIN_ONLYCOINERS); // Replace with the actual value of JOIN_ONLYCOINERS
  });

  test("GET /onlycoiners should return JOIN_ONLYCOINERS", async () => {
    const response = await request(app).get("/onlycoiners");
    expect(response.status).toBe(200);
    expect(response.text).toBe(JOIN_ONLYCOINERS);
  });

  test("GET /digitalocean should return JOIN_ONLYCOINERS", async () => {
    const response = await request(app).get("/digitalocean");
    expect(response.status).toBe(200);
    expect(response.text).toBe(JOIN_DIGITALOCEAN);
  });
});
