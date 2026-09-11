/**
 * VCI Magic Browser - Memory & CPU Optimizer
 * Auto-balancing untuk performa optimal
 */

const { ipcMain } = require('electron');

class PerformanceOptimizer {
  constructor() {
    this.memoryThreshold = 500 * 1024 * 1024; // 500MB
    this.cpuThreshold = 80; // 80%
    this.checkInterval = 5000; // 5 seconds
  }

  start() {
    setInterval(() => {
      this.checkPerformance();
    }, this.checkInterval);
  }

  checkPerformance() {
    const usage = process.memoryUsage();
    const heapUsed = usage.heapUsed;

    // Log performance metrics
    console.log(`Memory: ${Math.round(heapUsed / 1024 / 1024)}MB`);

    // Trigger garbage collection if needed
    if (heapUsed > this.memoryThreshold && global.gc) {
      console.log('Triggering garbage collection...');
      global.gc();
    }
  }

  getStats() {
    const usage = process.memoryUsage();
    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
      external: Math.round(usage.external / 1024 / 1024),
      rss: Math.round(usage.rss / 1024 / 1024)
    };
  }
}

const optimizer = new PerformanceOptimizer();

ipcMain.handle('get-performance-stats', async () => {
  return optimizer.getStats();
});

module.exports = { PerformanceOptimizer, optimizer };
