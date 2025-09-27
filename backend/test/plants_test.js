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

describe('Plant Controller (service-driven)', function () {
  afterEach(() => sinon.restore());

  describe('addPlant', () => {
    it('should return 201 on adding plant', async () => {
      const req = { body: { name: 'Rose', category: 'Flowering', price: 10 }, user: { _id: 'u1' } };
      const created = { _id: 'p1', ...req.body, inStock: true };
      const createStub = sinon.stub(services.plantService, 'create').resolves(created);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.addPlant(req, res, next);

      expect(createStub.calledOnceWith(req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(created)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { body: { name: 'Rose' }, user: { _id: 'u1' } };
      const err = new Error('A plant with this name already exists'); err.status = 400;
      sinon.stub(services.plantService, 'create').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.addPlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
      expect(res.status.called).to.be.false; // controller does not send on error
    });
  });

  describe('getPlants', () => {
    it('should return 200 with all plants', async () => {
      const req = {
        query: { name: 'rose', category: 'Flowering', available: 'true', sort: '-price', limit: '10' },
        user: { _id: 'u1' },
      };
      const rows = [{ _id: 'p1', name: 'Rose', inStock: true }];
      const findAllStub = sinon.stub(services.plantService, 'findAll').resolves(rows);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlants(req, res, next);

      expect(findAllStub.calledOnce).to.be.true;
      expect(findAllStub.firstCall.args[0]).to.be.an('object'); // options
      expect(findAllStub.firstCall.args[1]).to.deep.equal({ user: req.user });
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(rows)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { query: {}, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.plantService, 'findAll').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlants(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('getPlantById', () => {
    it('should return 200 with getting a plant', async () => {
      const req = { params: { id: 'p1' }, query: {}, user: { _id: 'u1' } };
      const item = { _id: 'p1', name: 'Rose' };
      const stub = sinon.stub(services.plantService, 'findById').resolves(item);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.getPlantById(req, res, next);

      expect(stub.calledOnceWith('p1', sinon.match({ user: req.user }))).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(item)).to.be.true;
      expect(next.notCalled).to.be.true;
    });
  });

  describe('updatePlant', () => {
    it('should return 200 with updated plant', async () => {
      const req = { params: { id: 'p1' }, body: { name: 'New Rose' }, user: { _id: 'u1' } };
      const updated = { _id: 'p1', name: 'New Rose' };
      const stub = sinon.stub(services.plantService, 'update').resolves(updated);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.updatePlant(req, res, next);

      expect(stub.calledOnceWith('p1', req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updated)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'p1' }, body: {}, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.plantService, 'update').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.updatePlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('deletePlant', () => {
    it('should return 200 on deleting plant', async () => {
      const req = { params: { id: 'p1' }, user: { _id: 'u1' } };
      const removed = { _id: 'p1' };
      const stub = sinon.stub(services.plantService, 'delete').resolves(removed);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.deletePlant(req, res, next);

      expect(stub.calledOnceWith('p1', { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ message: sinon.match.string, removed })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 'p1' }, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.plantService, 'delete').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await plantController.deletePlant(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });
});
