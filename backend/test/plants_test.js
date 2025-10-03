const { expect } = require('chai');
const sinon = require('sinon');

const plantController = require('../controllers/plantController');
const services = require('../services');

function mockRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
  };
}

describe('Plant Controller', function () {
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

  describe('addPlant', () => {
    it('should return 201 and the created plant', async () => {
      const req = { body: { name: 'Rose', category: 'Flower' }, user: mockReqUser() };
      const createdPlant = { _id: 'p1', name: 'Rose', category: 'Flower' };
      const stub = sinon.stub(services.plantService, 'create').resolves(createdPlant);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.addPlant(req, res, next);

      expect(stub.calledOnceWith(req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdPlant)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { body: { name: 'Rose' }, user: mockReqUser() };
      const err = new Error('Validation Error');
      sinon.stub(services.plantService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.addPlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should return 400 if validation fails', async () => {
      const req = { body: { name: '' }, user: mockReqUser() }; // Invalid data
      const err = new Error('Name is required');
      err.status = 400;
      sinon.stub(services.plantService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.addPlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true; // Controller forwards to error handler
    });
  });

  describe('getPlants', () => {
    it('should return 200 with all plants', async () => {
      const req = { query: {}, user: mockReqUser() };
      const plants = [{ _id: 'p1', name: 'Rose' }];
      const stub = sinon.stub(services.plantService, 'findAll').resolves(plants);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlants(req, res, next);

      expect(stub.calledOnce).to.be.true;
      expect(stub.firstCall.args[0]).to.be.an('object'); // options
      expect(stub.firstCall.args[1]).to.deep.equal({ user: req.user });
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(plants)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { query: {}, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.plantService, 'findAll').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlants(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('getPlantById', () => {
    it('should return 200 with a single plant', async () => {
      const req = { params: { id: 'p1' }, query: {}, user: mockReqUser() };
      const plant = { _id: 'p1', name: 'Rose' };
      const stub = sinon.stub(services.plantService, 'findById').resolves(plant);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlantById(req, res, next);

    
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(plant)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if plant not found', async () => {
      const req = { params: { id: 'p_nonexistent' }, query: {}, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.plantService, 'findById').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlantById(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true; 
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'p1' }, query: {}, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.plantService, 'findById').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlantById(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('updatePlant', () => {
    it('should return 200 with the updated plant', async () => {
      const req = { params: { id: 'p1' }, body: { name: 'Updated Rose' }, user: mockReqUser() };
      const updatedPlant = { _id: 'p1', name: 'Updated Rose' };
      const stub = sinon.stub(services.plantService, 'update').resolves(updatedPlant);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.updatePlant(req, res, next);

      expect(stub.calledOnceWith('p1', req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedPlant)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if plant to update not found', async () => {
      const req = { params: { id: 'p_nonexistent' }, body: { name: 'Updated Rose' }, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.plantService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.updatePlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'p1' }, body: { name: 'Updated Rose' }, user: mockReqUser() };
      const err = new Error('Validation Error');
      sinon.stub(services.plantService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.updatePlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('deletePlant', () => {
    it('should return 200 with a success message', async () => {
      const req = { params: { id: 'p1' }, user: mockReqUser() };
      const removedPlant = { _id: 'p1' };
      const stub = sinon.stub(services.plantService, 'delete').resolves(removedPlant);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.deletePlant(req, res, next);

      expect(stub.calledOnceWith('p1', sinon.match.has('user', sinon.match.has('id', req.user.id)))).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Plant deleted successfully!', removed: removedPlant })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if plant to delete not found', async () => {
      const req = { params: { id: 'p_nonexistent' }, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.plantService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.deletePlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'p1' }, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.plantService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.deletePlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });
});