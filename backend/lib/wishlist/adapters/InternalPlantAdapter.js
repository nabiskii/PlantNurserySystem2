const IPlantSummaryAdapter = require('./IPlantSummaryAdapter');

class InternalPlantAdapter extends IPlantSummaryAdapter {
  getSummary(plant) {
    return {
      id: plant._id,
      name: plant.name,
      price: plant.price,
      category: plant.category
    };
  }
}

module.exports = InternalPlantAdapter;
