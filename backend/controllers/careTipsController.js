const { careTipsService } = require('../services');

function asInt(v,d){ const n = parseInt(v,10); return Number.isFinite(n) ? n : d; }

const addCareTip = async (req, res, next) => {
  try {
    const out = await careTipsService.create(req.body, { user: req.user });
    res.status(201).json(out);
  } catch (err) { next(err); }
};

const getCareTips = async (req, res, next) => {
  try {
    const options = {
      query: {
        tag: req.query.tag,
        difficulty: req.query.difficulty,
        q: req.query.q,
      },
      sort: req.query.sort,
      page: asInt(req.query.page, undefined),
      limit: asInt(req.query.limit, undefined),
      select: req.query.select,
      populate: req.query.populate,
    };
    const rows = await careTipsService.findAll(options, { user: req.user });
    res.status(200).json(rows);
  } catch (err) { next(err); }
};

const getCareTipById = async (req, res, next) => {
  try {
    const item = await careTipsService.findById(req.params.id, {
      user: req.user,
      options: { select: req.query.select, populate: req.query.populate },
    });
    res.status(200).json(item);
  } catch (err) { next(err); }
};

const updateCareTip = async (req, res, next) => {
  try {
    const out = await careTipsService.update(req.params.id, req.body, { user: req.user });
    res.status(200).json(out);
  } catch (err) { next(err); }
};

const deleteCareTip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removed = await careTipsService.delete(id, { user: req.user });
    return res.status(200).json({ message: `Care tip ${id} deleted`, removed,});
  } catch (err) { return next(err);}
};

module.exports = { addCareTip, getCareTips, getCareTipById, updateCareTip, deleteCareTip };
