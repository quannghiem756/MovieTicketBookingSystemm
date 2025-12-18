class DashboardController {
  constructor(dashboardService) {
    this.dashboardService = dashboardService;
  }

  async getStats(req, res) {
    try {
      const stats = await this.dashboardService.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error retrieving dashboard stats:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getRecentActivity(req, res) {
    try {
      const activities = await this.dashboardService.getRecentActivity();
      res.json(activities);
    } catch (error) {
      console.error('Error retrieving recent activities:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getPerformanceStats(req, res) {
    try {
      const performanceStats = await this.dashboardService.getPerformanceStats();
      res.json(performanceStats);
    } catch (error) {
      console.error('Error retrieving performance stats:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DashboardController;