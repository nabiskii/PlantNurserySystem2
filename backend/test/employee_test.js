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

describe('Employee Controller', function () {
  afterEach(() => sinon.restore());

  // Mock req.user for protected routes
  const mockReqUser = (role = 'admin', id = 'someUserId') => {
    const userDoc = {
      _id: id,
      name: 'Test User',
      email: 'test@example.com',
      role: role,
      university: 'Test Uni',
      address: '123 Test St'
    };

    // Simulate the UserFactory output
    return {
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      userDoc: userDoc, // Keep a reference to the raw doc if needed
      isAdmin: () => userDoc.role === 'admin',
      isMember: () => userDoc.role === 'member',
      canEditDb: () => userDoc.role === 'admin', // Simulate method from AdminUser/MemberUser
    };
  };

  describe('addEmployee', () => {
    it('should return 201 and the created employee', async () => {
      const req = { body: { name: 'John Doe', email: 'john@example.com' }, user: mockReqUser() };
      const createdEmployee = { _id: 'e1', name: 'John Doe' };
      const stub = sinon.stub(services.employeeService, 'create').resolves(createdEmployee);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.addEmployee(req, res, next);

      expect(stub.calledOnceWith(req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdEmployee)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { body: { name: 'John Doe' }, user: mockReqUser() };
      const err = new Error('Validation Error');
      sinon.stub(services.employeeService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.addEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should return 400 if validation fails', async () => {
      const req = { body: { name: '' }, user: mockReqUser() }; // Invalid data
      const err = new Error('Name is required');
      err.status = 400;
      sinon.stub(services.employeeService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.addEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true; 
    });
  });

  describe('getEmployees', () => {
    it('should return 200 with all employees', async () => {
      const req = { query: {}, user: mockReqUser() };
      const employees = [{ _id: 'e1', name: 'John Doe' }];
      const stub = sinon.stub(services.employeeService, 'findAll').resolves(employees);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployees(req, res, next);

      expect(stub.calledOnce).to.be.true;
      expect(stub.firstCall.args[0]).to.be.an('object'); // options
      expect(stub.firstCall.args[1]).to.deep.equal({ user: req.user });
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(employees)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { query: {}, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.employeeService, 'findAll').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployees(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('getEmployeeById', () => {
    it('should return 200 with a single employee', async () => {
      const req = { params: { id: 'e1' }, query: {}, user: mockReqUser() };
      const employee = { _id: 'e1', name: 'John Doe' };
      const stub = sinon.stub(services.employeeService, 'findById').resolves(employee);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployeeById(req, res, next);

      expect(stub.calledOnceWith('e1', { user: req.user, options: { select: req.query.select, populate: req.query.populate } })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(employee)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if employee not found', async () => {
      const req = { params: { id: 'e_nonexistent' }, query: {}, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.employeeService, 'findById').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployeeById(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true; 
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'e1' }, query: {}, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.employeeService, 'findById').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.getEmployeeById(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('updateEmployee', () => {
    it('should return 200 with the updated employee', async () => {
      const req = { params: { id: 'e1' }, body: { name: 'Updated John' }, user: mockReqUser() };
      const updatedEmployee = { _id: 'e1', name: 'Updated John' };
      const stub = sinon.stub(services.employeeService, 'update').resolves(updatedEmployee);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.updateEmployee(req, res, next);

      expect(stub.calledOnceWith('e1', req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedEmployee)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if employee to update not found', async () => {
      const req = { params: { id: 'e_nonexistent' }, body: { name: 'Updated John' }, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.employeeService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.updateEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'e1' }, body: { name: 'Updated John' }, user: mockReqUser() };
      const err = new Error('Validation Error');
      sinon.stub(services.employeeService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.updateEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('deleteEmployee', () => {
    it('should return 200 with a success message', async () => {
      const req = { params: { id: 'e1' }, user: mockReqUser() };
      const removedEmployee = { _id: 'e1' };
      const stub = sinon.stub(services.employeeService, 'delete').resolves(removedEmployee);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.deleteEmployee(req, res, next);

      expect(stub.calledOnceWith('e1', sinon.match.has('user', sinon.match.has('id', req.user.id)))).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Employee deleted successfully', removed: removedEmployee })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if employee to delete not found', async () => {
      const req = { params: { id: 'e_nonexistent' }, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.employeeService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.deleteEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'e1' }, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.employeeService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await employeeController.deleteEmployee(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });
});