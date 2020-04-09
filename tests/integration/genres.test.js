const request = require("supertest");
const { Genres } = require("../../Models/genre");
const { Users } = require("../../Models/user");
const mongoose = require("mongoose");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genres.deleteMany({});
    server.close();
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if a valid ID is passed", async () => {
      const genre = new Genres({ name: "genreid" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return a 404 if an invalid ID is passed", async () => {
      const res = await request(server).get("/api/genres/0");
      expect(res.status).toBe(404);
    });

    it("should return a 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define a default token value.
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new Users().generateAuthToken();
      name = "genre1";
    });

    it("should return a 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return a 400 if the genre is less than 3 characters", async () => {
      name = "ab";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return a 400 if the genre is more than 50 characters", async () => {
      name = new Array(52).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should save the genre if it is valid", async () => {
      await exec();
      const genre = Genres.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
