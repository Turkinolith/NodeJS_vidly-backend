const { Rentals } = require("../../Models/rental");
const { Users } = require("../../Models/user");
const { Movies } = require("../../Models/movie");
const request = require("supertest");
const mongoose = require("mongoose");
const moment = require("moment");

//////////////////////////////////////////////////////////////////

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");
    token = new Users().generateAuthToken();
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();

    movie = new Movies({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      numberInStock: 10,
      genre: { name: "12345" },
    });

    await movie.save();

    rental = new Rentals({
      renter: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });
  afterEach(async () => {
    await Rentals.deleteMany({});
    await Movies.deleteMany({});
    await server.close();
  });

  describe("POST /", () => {
    it("should return a 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return a 400 if the customerId is not provided", async () => {
      customerId = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return a 400 if the movieId is not provided", async () => {
      movieId = "";
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 404 if no rental is found for the customerId/movieId", async () => {
      await Rentals.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if rental is found for the customerId/movieId but the return date is already set", async () => {
      rental.dateReturned = new Date();
      await rental.save();

      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 request is valid", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return a rental object with the return date set if input is valid", async () => {
      const res = await exec();

      const rentalInDb = await Rentals.findById(rental._id);
      const diff = new Date() - rentalInDb.dateReturned;
      expect(diff).toBeLessThan(10 * 1000);
    });

    it("should calculate a rental fee of 14 assuming the input is 7 days out and dailyRentalRate of 2 per day with valid input", async () => {
      rental.dateOut = moment().add(-7, "days").toDate();
      await rental.save();
      const res = await exec();

      const rentalInDb = await Rentals.findById(rental._id);
      expect(rentalInDb.rentalFee).toBe(14);
    });

    it("should increase the movie stock of the movie on the DB with valid input", async () => {
      const res = await exec();

      const movieInDB = await Movies.findById(movieId);
      expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it("should return the rental if valid input", async () => {
      const res = await exec();

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          "renter",
          "dateReturned",
          "dateOut",
          "rentalFee",
          "movie",
          "_id",
        ])
      );
    });
  });
});
