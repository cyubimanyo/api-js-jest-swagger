module.exports = {
  BASE_URL: "https://petstore.swagger.io/v2",
  PET: "/pet",
  PET_BY_ID: (id) => `/pet/${id}`,
  FIND_BY_STATUS: (status) => `/pet/findByStatus?status=${status}`,
};
