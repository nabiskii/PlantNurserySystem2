const bus = require('../lib/eventBus');

bus.on('careTip.created', ({ tip, user }) => {
  console.log('[observer] created', tip._id, 'by', user?._id);
});

bus.on('careTip.updated', ({ tip, user }) => {
  console.log('[observer] updated', tip._id);
});

bus.on('careTip.deleted', ({ tipId, found, user }) => {
  console.log('[observer] deleted', tipId, 'found?', found);
});
