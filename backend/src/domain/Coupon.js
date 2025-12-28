class Coupon {
    constructor(id, code, type, value, startDate, endDate, usageLimit, userUsageLimit, minOrderValue, applicableMovieIds, currentUsage) {
      this.id = id;
      this.code = code;
      this.type = type;
      this.value = value;
      this.startDate = startDate;
      this.endDate = endDate;
      this.usageLimit = usageLimit;
      this.userUsageLimit = userUsageLimit;
      this.minOrderValue = minOrderValue;
      this.applicableMovieIds = applicableMovieIds;
      this.currentUsage = currentUsage;
    }
  }
  
  module.exports = Coupon;
