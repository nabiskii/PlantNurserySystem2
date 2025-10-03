const express = require('express');
const bus = require('../lib/eventBus');
const router = express.Router();

const toPlain = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const out = Array.isArray(obj) ? [] : {};
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && typeof v.toString === 'function' && String(v).startsWith('new ObjectId(')) {
      out[k] = v.toString().replace(/^new ObjectId\("(.+)"\)$/, '$1');
    } else if (v && v._id && typeof v._id.toString === 'function') {
      out[k] = { ...v, _id: v._id.toString() };
    } else if (Array.isArray(v) || (v && typeof v === 'object')) {
      out[k] = toPlain(v);
    } else {
      out[k] = v;
    }
  }
  return out;
};

function sseHandler(req, res) {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.flushHeaders?.();

  const send = (event, data) => {
    const safe = toPlain(data);
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(safe)}\n\n`);
  };

  const onCreated = (p) => send('careTip.created', p);
  const onUpdated = (p) => send('careTip.updated', p);
  const onDeleted = (p) => send('careTip.deleted', p);

  bus.on('careTip.created', onCreated);
  bus.on('careTip.updated', onUpdated);
  bus.on('careTip.deleted', onDeleted);

  const hb = setInterval(() => res.write(':\n\n'), 25000);

  req.on('close', () => {
    clearInterval(hb);
    bus.off('careTip.created', onCreated);
    bus.off('careTip.updated', onUpdated);
    bus.off('careTip.deleted', onDeleted);
  });
}

router.get('/', sseHandler);

module.exports = router;
