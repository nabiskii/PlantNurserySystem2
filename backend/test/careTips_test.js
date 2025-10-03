const { expect } = require('chai');
const sinon = require('sinon');

const careTipsController = require('../controllers/careTipsController');
const services = require('../services');

function mockRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
  };
}

describe('CareTip Controller', function () {
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

  describe('addCareTip', () => {
    it('should return 201 and the created care tip', async () => {
      const req = { body: { title: 'Watering Guide', content: 'Water daily' }, user: mockReqUser() };
      const createdCareTip = { _id: 'ct1', title: 'Watering Guide' };
      const stub = sinon.stub(services.careTipsService, 'create').resolves(createdCareTip);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.addCareTip(req, res, next);

      expect(stub.calledOnceWith(req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdCareTip)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { body: { title: 'Watering Guide' }, user: mockReqUser() };
      const err = new Error('Validation Error');
      sinon.stub(services.careTipsService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.addCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should return 400 if validation fails', async () => {
      const req = { body: { title: '' }, user: mockReqUser() }; // Invalid data
      const err = new Error('Title is required');
      err.status = 400;
      sinon.stub(services.careTipsService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.addCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true; 
    });
  });

  describe('getCareTips', () => {
    it('should return 200 with all care tips', async () => {
      const req = { query: {}, user: mockReqUser() };
      const careTips = [{ _id: 'ct1', title: 'Watering Guide' }];
      const stub = sinon.stub(services.careTipsService, 'findAll').resolves(careTips);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.getCareTips(req, res, next);

      expect(stub.calledOnce).to.be.true;
      expect(stub.firstCall.args[0]).to.be.an('object'); // options
      expect(stub.firstCall.args[1]).to.deep.equal({ user: req.user });
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(careTips)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { query: {}, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.careTipsService, 'findAll').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.getCareTips(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('getCareTipById', () => {
    it('should return 200 with a single care tip', async () => {
      const req = { params: { id: 'ct1' }, query: {}, user: mockReqUser() };
      const careTip = { _id: 'ct1', title: 'Watering Guide' };
      const stub = sinon.stub(services.careTipsService, 'findById').resolves(careTip);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.getCareTipById(req, res, next);

      expect(stub.calledOnceWith('ct1', { user: req.user, options: { select: req.query.select, populate: req.query.populate } })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(careTip)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if care tip not found', async () => {
      const req = { params: { id: 'ct_nonexistent' }, query: {}, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.careTipsService, 'findById').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.getCareTipById(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true; 
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'ct1' }, query: {}, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.careTipsService, 'findById').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.getCareTipById(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('updateCareTip', () => {
    it('should return 200 with the updated care tip', async () => {
      const req = { params: { id: 'ct1' }, body: { title: 'Updated Guide' }, user: mockReqUser() };
      const updatedCareTip = { _id: 'ct1', title: 'Updated Guide' };
      const stub = sinon.stub(services.careTipsService, 'update').resolves(updatedCareTip);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.updateCareTip(req, res, next);

      expect(stub.calledOnceWith('ct1', req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updatedCareTip)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if care tip to update not found', async () => {
      const req = { params: { id: 'ct_nonexistent' }, body: { title: 'Updated Guide' }, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.careTipsService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.updateCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'ct1' }, body: { title: 'Updated Guide' }, user: mockReqUser() };
      const err = new Error('Validation Error');
      sinon.stub(services.careTipsService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.updateCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('deleteCareTip', () => {
    it('should return 200 with a success message', async () => {
      const req = { params: { id: 'ct1' }, user: mockReqUser() };
      const removedCareTip = { _id: 'ct1' };
      const stub = sinon.stub(services.careTipsService, 'delete').resolves(removedCareTip);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.deleteCareTip(req, res, next);

      expect(stub.calledOnceWith('ct1', sinon.match.has('user', sinon.match.has('id', req.user.id)))).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'Care tip ct1 deleted', removed: removedCareTip })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should return 404 if care tip to delete not found', async () => {
      const req = { params: { id: 'ct_nonexistent' }, user: mockReqUser() };
      const err = new Error('Not Found');
      err.status = 404;
      sinon.stub(services.careTipsService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.deleteCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'ct1' }, user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.careTipsService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await careTipsController.deleteCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });
});