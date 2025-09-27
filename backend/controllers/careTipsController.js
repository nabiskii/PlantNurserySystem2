const { careTipsService } = require('../services');

function asInt(value, defaultValue){ 
    const n = parseInt(value, 10); 
    return Number.isFinite(n) ? n : defaultValue; 
}

// POST /api/care-tips
const addCareTip = async (req, res, next) => {
  try {
    const out = await careTipsService.create(req.body, { user: req.user });
    res.status(201).json(out);
  } catch (err) { 
    next(err); 
}
};

// GET /api/care-tips
const getCareTips = async (req, res, next) => {
  try {
    const options = {
      query: {
        plantId: req.query.plantId,
        tag: req.query.tag,
        difficulty: req.query.difficulty,
        q: req.query.q,
      },
      sort: req.query.sort,
      limit: asInt(req.query.limit, undefined),
      select: req.query.select,
      populate: req.query.populate,
    };
    const rows = await careTipsService.findAll(options, { user: req.user });
    res.status(200).json(rows);
  } catch (err) { 
    next(err); 
    }
};

// GET /api/care-tips/:id
const getCareTipById = async (req, res, next) => {
  try {
    const item = await careTipsService.findById(req.params.id, {
      user: req.user,
      options: { select: req.query.select, populate: req.query.populate },
    });
    res.status(200).json(item);
  } catch (err) { 
    next(err); 
}
};

// PUT /api/care-tips/:id
const updateCareTip = async (req, res, next) => {
  try {
    const out = await careTipsService.update(req.params.id, req.body, { user: req.user });
    res.status(200).json(out);
  } catch (err) { 
    next(err); 
}
};

// DELETE /api/care-tips/:id
const deleteCareTip = async (req, res, next) => {
  try {
    const removed = await careTipsService.delete(req.params.id, { user: req.user });
    res.status(200).json({ message: 'Care tip deleted successfully', removed });
  } catch (err) { 
    next(err); 
}
};

module.exports = { addCareTip, getCareTips, getCareTipById, updateCareTip, deleteCareTip, };
