const AuditLogModel = require('../AuditLogModel');

class MongoAuditLogRepository {
  async create(logData) {
    const log = new AuditLogModel(logData);
    return await log.save();
  }
}

module.exports = MongoAuditLogRepository;
