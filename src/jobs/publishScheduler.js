const cron = require('node-cron');
const Post = require('../models/Post');

const startScheduler = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const result = await Post.updateMany(
        { status: 'scheduled', scheduledAt: { $lte: new Date() } },
        { status: 'published', publishedAt: new Date() }
      );
      if (result.modifiedCount > 0)
        console.log(`📅 ${result.modifiedCount} post(s) publicados automáticamente`);
    } catch (err) {
      console.error('❌ Scheduler error:', err.message);
    }
  });
  console.log('⏰ Scheduler de publicación programada activo');
};

module.exports = { startScheduler };
