const ActivityLog = require("../models/ActivityLog");

// Get all activity logs (Admin only)
exports.getActivityLogs = async (req, res) => {
  try {
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
    const limitRaw = parseInt(req.query.limit, 10);
    const limit = Number.isFinite(limitRaw) ? Math.max(limitRaw, 1) : 50;
    const action = req.query.action;
    const userId = req.query.userId;

    const filter = {};
    if (action) filter.action = action;
    if (userId) filter.user = userId;

    const total = await ActivityLog.countDocuments(filter);

    const logs = await ActivityLog.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    res.json({
      logs,
      total,
      offset,
      limit,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get activity stats
exports.getActivityStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalLogs, todayLogs, actionStats] = await Promise.all([
      ActivityLog.countDocuments(),
      ActivityLog.countDocuments({ createdAt: { $gte: today } }),
      ActivityLog.aggregate([
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      totalLogs,
      todayLogs,
      actionStats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create activity log (helper function)
exports.createLog = async (userId, action, description, metadata = {}, req = null) => {
  try {
    const log = new ActivityLog({
      user: userId,
      action,
      description,
      metadata,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.headers?.["user-agent"],
    });
    await log.save();
    return log;
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
};

// Delete old logs (cleanup - can be run via cron)
exports.cleanupOldLogs = async (req, res) => {
  try {
    const daysToKeep = parseInt(req.query.days) || 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    res.json({
      msg: `Deleted ${result.deletedCount} old activity logs`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
