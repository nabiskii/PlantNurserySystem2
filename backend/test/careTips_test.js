const { expect } = require('chai');
const sinon = require('sinon');

const ctrl = require('../controllers/careTipsController');
const services = require('../services');

function mockRes() {
  return { status: sinon.stub().returnsThis(), json: sinon.stub() };
}

describe('Care Tips Controller (service-driven)', function () {
  afterEach(() => sinon.restore());

  describe('addCareTip', () => {
    it('should return 201 on create', async () => {
      const req = {
        body: { plantId: 'p1', title: 'Watering', content: 'Water weekly', tags: ['watering'], difficulty: 'easy' },
        user: { _id: 'u1' }
      };
      const created = { _id: 't1', ...req.body, readTimeMin: 1 };
      const stub = sinon.stub(services.careTipsService, 'create').resolves(created);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.addCareTip(req, res, next);

      expect(stub.calledOnceWith(req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(created)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { body: { plantId: 'p1', title: '' }, user: { _id: 'u1' } };
      const err = new Error('title required'); err.status = 400;
      sinon.stub(services.careTipsService, 'create').rejects(err);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.addCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
      expect(res.status.called).to.be.false;
    });
  });

  describe('getCareTips', () => {
    it('should return 200 with tips', async () => {
      const req = {
        query: { plantId: 'p1', tag: 'watering', difficulty: 'easy', q: 'water', sort: '-createdAt', limit: '5' },
        user: { _id: 'u1' }
      };
      const rows = [{ _id: 't1', title: 'Watering', readTimeMin: 1 }];
      const stub = sinon.stub(services.careTipsService, 'findAll').resolves(rows);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.getCareTips(req, res, next);

      expect(stub.calledOnce).to.be.true;
      expect(stub.firstCall.args[0]).to.be.an('object');     // options
      expect(stub.firstCall.args[1]).to.deep.equal({ user: req.user });
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(rows)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { query: {}, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.careTipsService, 'findAll').rejects(err);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.getCareTips(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('getCareTipById', () => {
    it('should return 200 with a tip', async () => {
      const req = { params: { id: 't1' }, query: {}, user: { _id: 'u1' } };
      const item = { _id: 't1', title: 'Watering', readTimeMin: 1 };
      const stub = sinon.stub(services.careTipsService, 'findById').resolves(item);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.getCareTipById(req, res, next);

      expect(stub.calledOnce).to.be.true;
      expect(stub.firstCall.args[0]).to.equal('t1');
      expect(stub.firstCall.args[1]).to.have.property('user', req.user);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(item)).to.be.true;
      expect(next.notCalled).to.be.true;
    });
  });

  describe('updateCareTip', () => {
    it('should return 200 with updated tip', async () => {
      const req = { params: { id: 't1' }, body: { title: 'Water more' }, user: { _id: 'u1' } };
      const updated = { _id: 't1', title: 'Water more', readTimeMin: 1 };
      const stub = sinon.stub(services.careTipsService, 'update').resolves(updated);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.updateCareTip(req, res, next);

      expect(stub.calledOnceWith('t1', req.body, { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updated)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 't1' }, body: {}, user: { _id: 'u1' } };
      const err = new Error('content required'); err.status = 400;
      sinon.stub(services.careTipsService, 'update').rejects(err);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.updateCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('deleteCareTip', () => {
    it('should return 200 on delete', async () => {
      const req = { params: { id: 't1' }, user: { _id: 'u1' } };
      const removed = { _id: 't1' };
      const stub = sinon.stub(services.careTipsService, 'delete').resolves(removed);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.deleteCareTip(req, res, next);

      expect(stub.calledOnceWith('t1', { user: req.user })).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ message: sinon.match.string, removed })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { params: { id: 't1' }, user: { _id: 'u1' } };
      const err = new Error('DB Error'); err.status = 500;
      sinon.stub(services.careTipsService, 'delete').rejects(err);

      const res = mockRes(); const next = sinon.spy();
      await ctrl.deleteCareTip(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });
});
