const { Customers, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();

////////////////////
//! [C]-RUD
////////////////////
//* Expected input format: {"name": "string", "phone": "stringOfNumbers", "isGold": "bool"}

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = new Customers({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    });
    await customer.save();
    res.send(customer);
  } catch (ex) {
    res.status(500).send(ex.message);
  }
});

////////////////////
//! C-[R]-UD
////////////////////
//! *** Returns all customers ***
//* Also sorts customers by name
router.get("/", async (req, res) => {
  try {
    const customers = await Customers.find().sort("name");
    res.send(customers);
  } catch (err) {
    res.status(500).send("Error getting customer list");
  }
});

//! Returns a specific customer
router.get("/:_id", async (req, res) => {
  try {
    const customer = await Customers.findById(req.params._id);
    if (!customer) return res.status(404).send("Customer not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(customer);
  } catch (err) {
    res.status(404).send("Customer not found");
  }
});

////////////////////
//! CR-[U]-D
////////////////////
//! Updates a specific customer and returns the updated value
router.put("/:_id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const customer = await Customers.findByIdAndUpdate(
      req.params._id,
      { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
      { new: true }
    );
    if (!customer) return res.status(404).send("Customer not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(customer);
  } catch (err) {
    res.status(404).send("Customer not found");
  }
});

////////////////////
//! CRU-[D]
////////////////////
router.delete("/:_id", async (req, res) => {
  try {
    const response = await Customers.findByIdAndDelete(req.params._id);
    if (!response) return res.status(404).send("Customer not found"); //* If the response is null, return a 404, value has already been deleted.
    res.send(response);
  } catch (err) {
    res.status(404).send("Customer not found");
  }
});

////////////////////////
//! Exports
////////////////////////
module.exports = router;
