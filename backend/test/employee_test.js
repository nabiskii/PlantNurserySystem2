const { expect } = require('chai');
const sinon = require('sinon');

const employeeController = require('../controllers/employeeController');
const services = require('../services');

function mockRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
  };
}

describe('Employee Controller (service-driven)', function () {
  afterEach(() => sinon.restore());

  describe('addEmployee', () => {
    it('should return 201 on adding employee', async () => {
      const req = {
        body: { name: 'Alice', email: 'alice@test.com', role: 'Staff', phone: '123' },
        user: { _id: 'u1' },
      };
      const created = { _id: 'e1', ...req.body };
      const stub = sinon.stub(services.employeeService, 'create').resolves(created);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.addEmployee(req, res, next);

      expect(stub.calledOnceWith(req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(created)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { body: { name: 'Alice', email: 'bad', role: 'Staff' }, user: { _id: 'u1' } };
      const err = new Error('Invalid email'); err.status = 400;
      sinon.stub(services.employeeService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.addEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
      expect(res.status.called).to.be.false;
    });
  });

  describe('getEmployees', () => {
    it('should return 200 with all employees', async () => {
      const req = {
        query: { q: 'alice', role: 'Staff', department: 'Sales', sort: '-dateJoined', limit: '10' },
        user: { _id: 'u1' },
      };
      const rows = [{ _id: 'e1', name: 'Alice' }];
      const stub = sinon.stub(services.employeeService, 'findAll').resolves(rows);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployees(req, res, next);

      expect(stub.calledOnce).to.be.true;
      expect(stub.firstCall.args[0]).to.be.an('object'); // options
      expect(stub.firstCall.args[1]).to.deep.equal({ user: req.user });
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(rows)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { query: {}, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.employeeService, 'findAll').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployees(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('getEmployeeById', () => {
    it('should return 200 with employee', async () => {
      const req = { params: { id: 'e1' }, query: {}, user: { _id: 'u1' } };
      const item = { _id: 'e1', name: 'Alice' };
      const stub = sinon.stub(services.employeeService, 'findById').resolves(item);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployeeById(req, res, next);

      expect(stub.calledOnce).to.be.true;
      expect(stub.firstCall.args[0]).to.equal('e1');
      expect(stub.firstCall.args[1]).to.have.property('user', req.user);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(item)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    // If you later want a 404 test, mirror the plant pattern:
    // it('should forward 404 via next(err)', async () => { ... });
  });

  describe('updateEmployee', () => {
    it('should return 200 with updated employee', async () => {
      const req = { params: { id: 'e1' }, body: { name: 'Alice Updated' }, user: { _id: 'u1' } };
      const updated = { _id: 'e1', name: 'Alice Updated' };
      const stub = sinon.stub(services.employeeService, 'update').resolves(updated);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.updateEmployee(req, res, next);

      expect(stub.calledOnceWith('e1', req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updated)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'e1' }, body: {}, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.employeeService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.updateEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('deleteEmployee', () => {
    it('should return 200 on deleting employee', async () => {
      const req = { params: { id: 'e1' }, user: { _id: 'u1' } };
      const removed = { _id: 'e1' };
      const stub = sinon.stub(services.employeeService, 'delete').resolves(removed);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.deleteEmployee(req, res, next);

      expect(stub.calledOnceWith('e1', { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ message: sinon.match.string, removed })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'e1' }, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.employeeService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.deleteEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });
});
