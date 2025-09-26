const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const {
  addEmployee,
  updateEmployee,
  getEmployees,
  deleteEmployee,
  getEmployeeById,
} = require("../controllers/employeeController");
const { expect } = chai;

describe("Employee Controller Tests with calledWithMatch", function () {
  this.timeout(5000);

  afterEach(() => sinon.restore());

  // AddEmployee
  describe("AddEmployee", () => {
    it("should create a new employee successfully", async () => {
      const req = { body: { name: "Alice", email: "alice@test.com", role: "Staff", phone: "1234567890" } };
      const createdEmployee = { _id: new mongoose.Types.ObjectId(), ...req.body };

      sinon.stub(Employee, "findOne").resolves(null);
      const createStub = sinon.stub(Employee, "create").resolves(createdEmployee);

      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
      await addEmployee(req, res);

      expect(createStub.calledWithMatch(req.body)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdEmployee)).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      sinon.stub(Employee, "findOne").resolves(null);
      sinon.stub(Employee, "create").rejects(new Error("DB Error"));

      const req = { body: { name: "Alice", email: "alice@test.com", role: "Staff" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await addEmployee(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // UpdateEmployee
  describe("UpdateEmployee", () => {
    it("should update an employee successfully", async () => {
      const empId = new mongoose.Types.ObjectId();
      const updatedEmployee = { _id: empId, name: "Alice Updated" };

      const stub = sinon.stub(Employee, "findByIdAndUpdate").resolves(updatedEmployee);

      const req = { params: { id: empId.toString() }, body: { name: "Alice Updated" } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateEmployee(req, res);

      expect(stub.calledWithMatch(sinon.match.string, req.body, sinon.match.any)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedEmployee)).to.be.true;
    });

    it("should return 404 if employee is not found", async () => {
      const stub = sinon.stub(Employee, "findByIdAndUpdate").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateEmployee(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Employee not found" })).to.be.true;
    });

    it("should return 500 on error", async () => {
      const stub = sinon.stub(Employee, "findByIdAndUpdate").rejects(new Error("DB Error"));

      const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await updateEmployee(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // GetEmployees
  describe("GetEmployees", () => {
    it("should return all employees", async () => {
      const employees = [{ _id: new mongoose.Types.ObjectId(), name: "Alice" }];
      const stub = sinon.stub(Employee, "find").resolves(employees);

      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getEmployees(req, res);

      expect(stub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(employees)).to.be.true;
    });

    it("should return 500 on error", async () => {
      const stub = sinon.stub(Employee, "find").rejects(new Error("DB Error"));

      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getEmployees(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // GetEmployeeById
  describe("GetEmployeeById", () => {
    it("should return employee by id successfully", async () => {
      const empId = new mongoose.Types.ObjectId();
      const employee = { _id: empId, name: "Alice" };
      const stub = sinon.stub(Employee, "findById").resolves(employee);

      const req = { params: { id: empId.toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getEmployeeById(req, res);

      expect(stub.calledWithMatch(sinon.match.string)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(employee)).to.be.true;
    });

    it("should return 404 if employee is not found", async () => {
      const stub = sinon.stub(Employee, "findById").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getEmployeeById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Employee not found" })).to.be.true;
    });

    it("should return 500 on error", async () => {
      const stub = sinon.stub(Employee, "findById").rejects(new Error("DB Error"));

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await getEmployeeById(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });

  // DeleteEmployee
  describe("DeleteEmployee", () => {
    it("should delete an employee successfully", async () => {
      const empId = new mongoose.Types.ObjectId();
      const stub = sinon.stub(Employee, "findByIdAndDelete").resolves({ _id: empId });

      const req = { params: { id: empId.toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteEmployee(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: "Employee deleted successfully" })).to.be.true;
    });

    it("should return 404 if employee is not found", async () => {
      const stub = sinon.stub(Employee, "findByIdAndDelete").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteEmployee(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "Employee not found" })).to.be.true;
    });

    it("should return 500 if an error occurs", async () => {
      const stub = sinon.stub(Employee, "findByIdAndDelete").rejects(new Error("DB Error"));

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

      await deleteEmployee(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ message: "DB Error" })).to.be.true;
    });
  });
});
