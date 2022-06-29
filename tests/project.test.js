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

const projectPayloadWithActive = {
  title: "Projet 1",
  description: "Description de test",
  start_date: "2022-01-17",
  end_date: "2022-01-17",
  tags: "ReactJs, Javascript",
  url: "https://google.fr",
  active: true,
};

const badProjectPayload = {
  title: "Projet 1",
  start_date: "2022-01-17",
  end_date: "2022-01-17",
};

const putProjectPayload = {
  title: "Projet 2",
  active: 0,
};

describe("Test API endpoint /projects", () => {
  beforeAll(async () => {
    const sql = "SET FOREIGN_KEY_CHECKS=0; TRUNCATE TABLE project; TRUNCATE TABLE images; SET FOREIGN_KEY_CHECKS=1;";
    await query(sql);
  });
  describe("POST new projects", () => {
    it("POST /api/projects with invalid value return code 422", async () => {
      const res = await request(app)
        .post("/api/projects")
        .field("data", JSON.stringify(badProjectPayload))
        .attach("images", `${__dirname}/wallpaper-test.png`);
      expect(res.statusCode).toBe(422);
    });
    it("POST /api/projects with valid value and images return code 201", async () => {
      const res = await request(app)
        .post("/api/projects")
        .attach("images", `${__dirname}/wallpaper-test.png`)
        .field("data", JSON.stringify(projectPayload));
      expect(res.body.images).toEqual(expect.arrayContaining([expect.objectContaining({ project_id: 1 })]));
      expect(res.statusCode).toBe(201);
    });
    it("POST /api/projects with valid value and bad format attachement return code 422", async () => {
      const res = await request(app).post("/api/projects").field("data", JSON.stringify(projectPayload)).attach("images", `${__dirname}/test.pdf`);
      expect(res.body).toEqual(expect.objectContaining({ message: "Seulement les formats, jpg / png / jpeg / svg sont autorisés" }));
      expect(res.statusCode).toBe(422);
    });
    it("POST /api/project with valid value and optional value 'active' return code 201", async () => {
      const res = await request(app)
        .post("/api/projects")
        .field("data", JSON.stringify(projectPayloadWithActive))
        .attach("images", `${__dirname}/wallpaper-test.png`);
      expect(res.body).toEqual(expect.objectContaining({ active: 1 }));
      expect(res.statusCode).toBe(201);
    });
    afterAll(async () => {
      const sql = "DELETE FROM project WHERE id>1";
      await query(sql);
    });
  });
  describe("GET all project", () => {
    it("GET /api/projects and should return code 200", async () => {
      const res = await request(app).get("/api/projects");
      expect(res.statusCode).toBe(200);
    });
    it("GET /api/projects and should return code 200", async () => {
      const res = await request(app).get("/api/projects/1").send();
      expect(res.body.images).toHaveLength(1);
      expect(res.statusCode).toBe(200);
    });
  });
  describe("PUT projects", () => {
    it("PUT /api/projects/1 with valid value return code 200", async () => {
      const res = await request(app).put("/api/projects/1").send(putProjectPayload);
      expect(res.body).toEqual(expect.objectContaining({ title: "Projet 2", active: 0 }));
      expect(res.statusCode).toBe(200);
    });
    it("PUT /api/projects/3 with unknown id return code 404", async () => {
      const res = await request(app).put("/api/projects/3").send(putProjectPayload);
      expect(res.statusCode).toBe(404);
    });
  });
  describe("DELETE project", () => {
    it("DELETE /api/projects/1 return code 204", async () => {
      const res = await request(app).delete("/api/projects/1");
      expect(res.statusCode).toBe(204);
    });
    it("DELETE /api/projects/3 with unknown id return code 404", async () => {
      const res = await request(app).delete("/api/projects/3");
      expect(res.statusCode).toBe(404);
    });
  });
});
