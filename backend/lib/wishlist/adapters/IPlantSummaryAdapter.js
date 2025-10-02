class IPlantSummaryAdapter {
  getSummary(plant) {
    throw new Error('getSummary() must be implemented');
  }
}

module.exports = IPlantSummaryAdapter;
