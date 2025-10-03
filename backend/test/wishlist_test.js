const { expect } = require('chai');
const sinon = require('sinon');

const wishlistController = require('../controllers/wishlistController');
const services = require('../services');

function mockRes() {
  return {
    status: sinon.stub().returnsThis(),
    json: sinon.stub(),
  };
}

  // Mock req.user for protected routes
  const mockReqUser = (id = 'testUserId') => {
    return {
      id: id,
    };
  };

describe('Wishlist Controller (service-driven)', function () {
  afterEach(() => sinon.restore());

  describe('getWishlist', () => {
    it('should return 200 with wishlist items', async () => {
      const req = { user: mockReqUser() }; 
      const items = [{ _id: 'i1', name: 'Rose' }];
      const stub = sinon.stub(services.wishlistService, 'getWishlist').resolves({ items });

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.getWishlist(req, res, next);

      expect(stub.calledOnceWith(req.user.id)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ items })).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { user: mockReqUser() };
      const err = new Error('DB Error');
      sinon.stub(services.wishlistService, 'getWishlist').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.getWishlist(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('addWishlistItem', () => {
    it('should return 201 when item added', async () => {
      const req = { user: mockReqUser(), body: { plant: { name: 'Tulip', category: 'Flowering' } } };
      const created = { _id: 'i2', plantId: 'p2', name: 'Tulip' };
      const stub = sinon.stub(services.wishlistService, 'addItem').resolves(created);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.addWishlistItem(req, res, next);

      expect(stub.calledOnceWith(req.user.id, req.body.plant)).to.be.true; 
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(created)).to.be.true;
      expect(next.notCalled).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { user: mockReqUser(), body: { plant: { name: 'Tulip' } } };
      const err = new Error('Invalid Plant');
      sinon.stub(services.wishlistService, 'addItem').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.addWishlistItem(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('updateWishlistItem', () => {
    it('should return 200 when item updated', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'i1' }, body: { quantity: 3 } }; 
      const updated = { _id: 'i1', quantity: 3 };
      const stub = sinon.stub(services.wishlistService, 'updateItem').resolves(updated);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.updateWishlistItem(req, res, next);

      expect(stub.calledOnceWith(req.user.id, 'i1', req.body)).to.be.true; 
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(updated)).to.be.true;
    });

    it('should return 404 if item not found', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'x' }, body: {} }; 
      sinon.stub(services.wishlistService, 'updateItem').resolves(null);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.updateWishlistItem(req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'i1' }, body: {} }; 
      const err = new Error('DB Error');
      sinon.stub(services.wishlistService, 'updateItem').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.updateWishlistItem(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('deleteWishlistItem', () => {
    it('should return 200 when item deleted', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'i1' } }; 
      const removed = { _id: 'i1', userId: req.user.id }; 
      const stub = sinon.stub(services.wishlistService, 'deleteItem').resolves(removed);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.deleteWishlistItem(req, res, next);

      expect(stub.calledOnceWith(req.user.id, 'i1')).to.be.true; 
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(removed)).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'i1' } }; 
      const err = new Error('DB Error');
      sinon.stub(services.wishlistService, 'deleteItem').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.deleteWishlistItem(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });

  describe('cloneWishlistItem', () => {
    it('should return 200 when item cloned', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'i1' } }; 
      const clone = { _id: 'i2', clonedFrom: 'i1' };
      const stub = sinon.stub(services.wishlistService, 'cloneItem').resolves(clone);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.cloneWishlistItem(req, res, next);

      expect(stub.calledOnceWith(req.user.id, 'i1')).to.be.true; 
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith(clone)).to.be.true;
    });

    it('should return 404 if item not found for cloning', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'x' } }; 
      sinon.stub(services.wishlistService, 'cloneItem').resolves(null);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.cloneWishlistItem(req, res, next);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: 'Item not found' })).to.be.true;
    });

    it('should forward error via next(err)', async () => {
      const req = { user: mockReqUser(), params: { itemId: 'i1' } }; 
      const err = new Error('DB Error');
      sinon.stub(services.wishlistService, 'cloneItem').rejects(err);

      const res = mockRes();
      const next = sinon.spy();

      await wishlistController.cloneWishlistItem(req, res, next);

      expect(next.calledOnceWith(err)).to.be.true;
    });
  });
});
