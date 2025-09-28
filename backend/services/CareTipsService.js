const Base = require('./BaseInventoryService');
const CareTip = require('../models/CareTip');

function withReadTime(x){
  const words = (x.content || '').trim().split(/\s+/).filter(Boolean).length;
  const readTimeMin = Math.max(1, Math.round(words / 200));
  return { ...x, readTimeMin };
}

class CareTipsService extends Base {
  async authorize({ op, user }) {
    const write = op === 'create' || op === 'update' || op === 'remove';
    if (!write) return true;           // reads public
    if (!user) { const e = new Error('Auth required'); e.status = 401; throw e; }
    return true;
  }

  async validate(p, { op }) {
    if (op === 'create' || op === 'update') {
      if (!p?.title)   { const e = new Error('title required');   e.status = 400; throw e; }
      if (!p?.content) { const e = new Error('content required'); e.status = 400; throw e; }
    }
    return p;
  }

  async updateMask(p) {
    const out = {};
    if (p.title != null) out.title = p.title;
    if (p.content != null) out.content = p.content;
    if (p.tags != null) out.tags = p.tags;
    if (p.difficulty != null) out.difficulty = p.difficulty;
    return out;
  }

  async filter(q) {
    const f = {};
    if (q?.tag)        f.tags = q.tag;
    if (q?.difficulty) f.difficulty = q.difficulty;
    if (q?.q) {
      f.$or = [
        { title:   { $regex: q.q, $options: 'i' } },
        { content: { $regex: q.q, $options: 'i' } },
      ];
    }
    return f;
  }

  async format(data) {
    return Array.isArray(data) ? data.map(withReadTime) : withReadTime(data);
  }
}

module.exports = new CareTipsService(CareTip);
