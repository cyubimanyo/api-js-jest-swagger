module.exports = {
  // POSITIVE
  createPet: {
    id: Date.now(),
    name: "Mochi",
    photoUrls: ["https://example.com/photo.jpg"],
    status: "available",
  },
  getPet: {
    id: Date.now(),
  },
  updatePet: {
    name: "Mochi Updated",
    status: "sold",
  },
  findPet: {
    status: "available",
  },
  deletePet: {
    message: "Pet deleted successfully",
  },

  // NEGATIVE
  createPetMissingField: {
    status: "available" 
  },
  getNonExistentPet: {
    id: 99999999
  },
  findPetsInvalidQuery: {
    status: "invalid_status_value983475235325"
  },
  deletePetInvalidId: {
    id: "invalid_id_string"
  },
  updatePetInvalidStatus: {
    name: "Mochi Invalid Status",
    status: "invalid_status_value1111111111",
  },
};
