const request = require("supertest");
const { Genres } = require("../../Models/genre");
const { Users } = require("../../Models/user");
const mongoose = require("mongoose");

let server;
//////////////////////////////////////////////////////////////////////
describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genres.deleteMany({});
    await server.close();
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

  //////////////////////////////////////////////////////////////////////

  describe("POST /", () => {
    // Define a default token value.
    let token;
    let name;

    const exec = () => {
      return request(server)
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

  //////////////////////////////////////////////////////////////////////
  describe("PUT /:id", () => {
    let token;
    let genre;
    let id;
    let name;

    const exec = () => {
      return request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genres({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new Users().generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;
      const res = await exec();
      //console.log("res object: ", res.error); //To check for the error details.
      expect(res.status).toBe(404);
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

    it("should save the genre edit if it is valid", async () => {
      name = "genre2";
      await exec();
      const genre = Genres.find({ name: "genre2" });
      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre2");
    });
  });

  //////////////////////////////////////////////////////////////////////

  describe("DELETE /:id", () => {
    let token;
    let genre;
    let id;

    const exec = () => {
      return request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genres({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new Users({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 if the user is not an admin", async () => {
      token = new Users({ isAdmin: false }).generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the genre if input is valid", async () => {
      await exec();

      const genreInDb = await Genres.findById(id);

      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
