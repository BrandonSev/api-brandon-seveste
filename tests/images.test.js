const request = require("supertest");
const app = require("../server");
const { query } = require("../db-connection");

const projectPayload = {
  title: "Projet 1",
  description: "Description de test",
  start_date: "2022-01-17",
  end_date: "2022-01-17",
  tags: "ReactJs, Javascript",
  url: "https://google.fr",
};

describe("Test API endpoint /images", () => {
  beforeAll(async () => {
    const sql = `SET FOREIGN_KEY_CHECKS=0;
  truncate project;
  truncate images;
  SET FOREIGN_KEY_CHECKS=1;`;
    await query(sql);
    await request(app).post("/api/projects").field("data", JSON.stringify(projectPayload)).attach("images", `${__dirname}/wallpaper-test.png`);
  });

  describe("GET images", () => {
    it("GET /api/images and should return code 200", async () => {
      const res = await request(app).get("/api/images");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);
    });
    it("GET /api/images/1 and should return code 404", async () => {
      const res = await request(app).get("/api/images/2");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST images", () => {
    it("POST /api/images and should return code 200", async () => {
      const res = await request(app)
        .post("/api/images")
        .field("data", JSON.stringify({ project_id: 1 }))
        .attach("images", `${__dirname}/wallpaper-test.png`);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveLength(1);
    });
    it("POST /api/images and should return code 422", async () => {
      const res = await request(app).post("/api/images").attach("images", `${__dirname}/wallpaper-test.png`);
      expect(res.statusCode).toBe(422);
    });
    it("POST /api/images and should return code 422", async () => {
      const res = await request(app)
        .post("/api/images")
        .field("data", JSON.stringify({ project_id: 1 }));
      expect(res.statusCode).toBe(422);
    });
  });

  describe("PUT images", () => {
    it("PUT /api/images and should return code 404", async () => {
      const res = await request(app).put("/api/images/3").send();
      expect(res.statusCode).toBe(404);
    });
    it("PUT /api/images and should return code 404", async () => {
      const res = await request(app).put("/api/images/2").attach("images", `${__dirname}/wallpaper-test.png`);
      expect(res.statusCode).toBe(200);
    });
    it("PUT /api/images and should return code 404", async () => {
      const res = await request(app)
        .put("/api/images/2")
        .field("data", JSON.stringify({ project_id: 1 }));
      expect(res.statusCode).toBe(200);
    });
    it("PUT /api/images and should return code 404", async () => {
      const res = await request(app)
        .put("/api/images/2")
        .attach("images", `${__dirname}/wallpaper-test.png`)
        .field("data", JSON.stringify({ project_id: 1 }));
      expect(res.statusCode).toBe(200);
    });
  });

  describe("DELETE images", () => {
    it("DELETE /api/images and should return code 404", async () => {
      const res = await request(app).delete("/api/images/3").send();
      expect(res.statusCode).toBe(404);
    });
    it("DELETE /api/images and should return code 404", async () => {
      const res = await request(app).delete("/api/images/2");
      expect(res.statusCode).toBe(204);
    });
  });

  afterAll(async () => {
    const sql = `SET FOREIGN_KEY_CHECKS=0;
  truncate images;
  truncate project;
  SET FOREIGN_KEY_CHECKS=1;`;
    await query(sql);
  });
});
