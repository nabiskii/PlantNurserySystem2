class InternalPlantAdapter {
  getSummary(plant) {
    if (!plant) return {};
    return {
      id: plant._id?.toString?.() || plant.id || plant._id || plant,
      name: plant.name || plant.title, // tolerate alt field
      category: plant.category || plant.type,
      price: plant.price,
      stockQuantity: plant.stockQuantity ?? plant.stock ?? plant.quantity,
      description: plant.description || plant.desc,
    };
  }
}

module.exports = InternalPlantAdapter;
