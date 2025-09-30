const IPlantSummaryAdapter = require('./IPlantSummaryAdapter');

class ExternalPlantAdapter extends IPlantSummaryAdapter {
  getSummary(apiPlant) {
    return {
      id: apiPlant.id,
      name: apiPlant.common_name,
      price: apiPlant.price || 0,
      category: apiPlant.category || 'external'
    };
  }
}

module.exports = ExternalPlantAdapter;
