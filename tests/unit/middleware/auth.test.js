const { Users } = require("../../../Models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate req.user with payload of a valid JWT", () => {
    //* Generate a valid JWT, Need to convert the ObjectID to a HexString because when I decode the JWT I'm dealing with a string
    //* Where the mongoose ObjectID is in a different format.
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new Users(user).generateAuthToken();

    //* Since I'm calling the auth middleware, to set up the function I need to generate mock req, res, and next values
    ///////////////////////////////////////
    //* in the function it calls req.header to get the token, so I need to mock that parameter for the req object
    let req = {
      header: jest.fn().mockReturnValue(token),
    };
    //* I'm not working with res, but I need to pass something as an argument for the function, so empty object.
    let res = {};

    //* At the end of the auth method I'm calling next() as all middleware should. I'll just mock a fake function for it.
    let next = jest.fn();

    //* TEST: run auth with the mocked values.
    auth(req, res, next);

    //* Check the result
    expect(req.user).toMatchObject(user);
  });
});
