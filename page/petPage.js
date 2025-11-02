const axios = require("axios");
const locator = require("../locator/petLocator");

const api = axios.create({
  baseURL: locator.BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// ========== REQUEST INTERCEPTOR ==========
api.interceptors.request.use((config) => {
  const fullUrl = config.baseURL + config.url;
  console.log("========================================");
  console.log("📤 [REQUEST]");
  console.log("➡️ URL:", fullUrl);
  console.log("➡️ METHOD:", config.method.toUpperCase());
  if (config.data) {
    console.log("➡️ BODY:", JSON.stringify(config.data, null, 2));
  }
  console.log("========================================");
  return config;
});

// ========== RESPONSE INTERCEPTOR ==========
api.interceptors.response.use(
  (response) => {
    console.log("📥 [RESPONSE]");
    console.log("⬅️ STATUS:", response.status);
    console.log("⬅️ DATA:", JSON.stringify(response.data, null, 2));
    console.log("========================================\n");
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("❌ [ERROR RESPONSE]");
      console.log("⬅️ STATUS:", error.response.status);
      console.log("⬅️ DATA:", JSON.stringify(error.response.data, null, 2));
      console.log("========================================\n");
    } else {
      console.log("🚨 [NETWORK ERROR]:", error.message);
    }
    throw error;
  }
);

// ========== API ACTIONS (Page Object) ==========
class PetPage {
  async createPet(petData) {
    return api.post(locator.PET, petData);
  }

  async getPetById(id) {
  return api.get(locator.PET_BY_ID(id));
  }

  async updatePet(petData) {
    return api.put(locator.PET, petData);
  }

  async findPetsByStatus(status) {
  return api.get(locator.FIND_BY_STATUS(status));
}

  async deletePet(id) {
  return api.delete(locator.PET_BY_ID(id));
}

}

module.exports = new PetPage();
