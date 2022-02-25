const request = require("supertest");
const app = require("../server");

describe("Test API endpoint /images", () => {
  describe("GET images", () => {
    it("GET /api/images and should return code 200", async () => {
      const res = await request(app).get("/api/images");
      expect(res.statusCode).toBe(200);
    });
    it("GET /api/images/1 and should return code 404", async () => {
      const res = await request(app).get("/api/images/1");
      expect(res.statusCode).toBe(404);
    });
  });
});
