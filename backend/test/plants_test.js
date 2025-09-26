const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Plant = require("../models/Plant");
const {
  addPlant,
  updatePlant,
  getPlants,
  deletePlant,
  getPlantById,
} = require("../controllers/plantController");
const { expect } = chai;

describe("Plant Controller Tests with calledWithMatch", function () {
  this.timeout(5000); // Increase timeout for async tests

  afterEach(() => sinon.restore());

  // AddPlant
  describe("AddPlant", () => {
    it("should create a new plant successfully", async () => {
      const req = { body: { name: "Rose", category: "Flowering", price: 10, description: "Red rose" } };
      const createdPlant = { _id: new mongoose.Types.ObjectId(), ...req.body };

      sinon.stub(Plant, "findOne").resolves(null);
      const createStub = sinon.stub(Plant, "create").resolves(createdPlant);

      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await addPlant(req, res);

      expect(createStub.calledWithMatch(req.body)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdPlant)).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      sinon.stub(Plant, "findOne").resolves(null);
      sinon.stub(Plant, "create").rejects(new Error("DB Error"));

      const req = { body: { name: "Rose", category: "Flowering", price: 10 } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addPlant(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // UpdatePlant
  describe("UpdatePlant", () => {
    it("should update a plant successfully", async () => {
      const plantId = new mongoose.Types.ObjectId();
      const updatedPlant = { _id: plantId, name: "New Rose" };

      const stub = sinon.stub(Plant, "findByIdAndUpdate").resolves(updatedPlant);

      const req = { params: { id: plantId.toString() }, body: { name: "New Rose" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updatePlant(req, res);

      expect(stub.calledWithMatch(sinon.match.string, req.body, sinon.match.any)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedPlant)).to.be.true;
    });

    it("should return 404 if plant is not found", async () => {
      const stub = sinon.stub(Plant, "findByIdAndUpdate").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updatePlant(req, res);

      expect(stub.calledWithMatch(sinon.match.string, req.body, sinon.match.any)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Plant not found" })).to.be.true;
    });

    it("should return 500 on error", async () => {
      const stub = sinon.stub(Plant, "findByIdAndUpdate").rejects(new Error("DB Error"));

      const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updatePlant(req, res);

      expect(stub.calledWithMatch(sinon.match.string, req.body, sinon.match.any)).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // GetPlants
  describe("GetPlants", () => {
    it("should return all plants", async () => {
      const plants = [{ _id: new mongoose.Types.ObjectId(), name: "Rose" }];
      const stub = sinon.stub(Plant, "find").resolves(plants);

      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getPlants(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(plants)).to.be.true;
    });

    it("should return 500 on error", async () => {
      const stub = sinon.stub(Plant, "find").rejects(new Error("DB Error"));

      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getPlants(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // GetPlantById
  describe("GetPlantById", () => {
    it("should return plant by id successfully", async () => {
      const plantId = new mongoose.Types.ObjectId();
      const plant = { _id: plantId, name: "Rose" };
      const stub = sinon.stub(Plant, "findById").resolves(plant);

      const req = { params: { id: plantId.toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getPlantById(req, res);

      expect(stub.calledWithMatch(sinon.match.string)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(plant)).to.be.true;
    });

    it("should return 404 if plant is not found", async () => {
      const stub = sinon.stub(Plant, "findById").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getPlantById(req, res);

      expect(stub.calledWithMatch(sinon.match.string)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Plant not found" })).to.be.true;
    });

    it("should return 500 on error", async () => {
      const stub = sinon.stub(Plant, "findById").rejects(new Error("DB Error"));

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getPlantById(req, res);

      expect(stub.calledWithMatch(sinon.match.string)).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // DeletePlant
  describe("DeletePlant", () => {
    it("should delete a plant successfully", async () => {
      const plantId = new mongoose.Types.ObjectId();
      const stub = sinon.stub(Plant, "findByIdAndDelete").resolves({ _id: plantId });

      const req = { params: { id: plantId.toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deletePlant(req, res);

      expect(stub.calledWithMatch(sinon.match.string)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "Plant deleted successfully" })).to.be.true;
    });

    it("should return 404 if plant is not found", async () => {
      const stub = sinon.stub(Plant, "findByIdAndDelete").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deletePlant(req, res);

      expect(stub.calledWithMatch(sinon.match.string)).to.be.true;
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Plant not found" })).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      const stub = sinon.stub(Plant, "findByIdAndDelete").rejects(new Error("DB Error"));

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deletePlant(req, res);

      expect(stub.calledWithMatch(sinon.match.string)).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });
});
