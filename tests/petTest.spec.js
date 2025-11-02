const petPage = require("../page/petPage");
const petData = require("../data/petData");

describe("🐾 Petstore API Automation – BDD Style 🐾", () => {
  let createdPetId;

  // #1 [POSITIVE] Create Pet
  describe("01_GIVEN a valid pet payload", () => {
    describe("WHEN user sends POST /pet", () => {
      let response;

      beforeAll(async () => {
        console.log("📤 REQUEST BODY:");
        console.log(JSON.stringify(petData.createPet, null, 2));

        response = await petPage.createPet(petData.createPet);

        console.log("📥 RESPONSE DATA:");
        console.log(JSON.stringify(response.data, null, 2));
        console.log("📊 RESPONSE STATUS:", response.status);

        createdPetId = response.data.id;
        console.log("### GET createdPetId ### : ", createdPetId);
      });

      it("THEN API should return status 200", () => {
        expect(response.status).toBe(200);
      });

      it("AND response body should match the sent data", () => {
        expect(response.data.name).toBe(petData.createPet.name);
      });
    });
  });

  // #2 [POSITIVE] Get Pet by ID
  describe("02_GIVEN an existing pet ID", () => {
    describe("WHEN user sends GET /pet/{petId}", () => {
      let response;

      beforeAll(async () => {
        console.log("🔍 FETCHING PET with ID :", createdPetId);

        await new Promise((r) => setTimeout(r, 1000));

        try {
          response = await petPage.getPetById(createdPetId);
          console.log("📥 RESPONSE DATA:");
          console.log(JSON.stringify(response.data, null, 2));
          console.log("📊 RESPONSE STATUS:", response.status);
        } catch (error) {
          console.error("❌ GET /pet FAILED:");
          console.error("Status:", error.response?.status);
          console.error("Data:", error.response?.data);
          throw error;
        }
      });

      it("THEN API should return status 200", () => {
        expect(response.status).toBe(200);
      });

      it("AND returned pet should match created pet ID", () => {
        expect(response.data.id).toBe(createdPetId);
      });
    });
  });

  // #3 [POSITIVE] Update Pet
  describe("03_GIVEN an existing pet with updated data", () => {
    describe("WHEN user sends PUT /pet", () => {
      let response;
      const updatedPetData = {
        ...petData.createPet,
        ...petData.updatePet,
        id: createdPetId,
      };

      beforeAll(async () => {
        console.log("🛠️ UPDATE PET PAYLOAD:");
        console.log(JSON.stringify(updatedPetData, null, 2));

        response = await petPage.updatePet(updatedPetData);

        console.log("📥 RESPONSE DATA:");
        console.log(JSON.stringify(response.data, null, 2));
        console.log("📊 RESPONSE STATUS:", response.status);
      });

      it("THEN API should return status 200", () => {
        expect(response.status).toBe(200);
      });

      it("AND response should reflect updated data", () => {
        expect(response.data.name).toBe(petData.updatePet.name);
        expect(response.data.status).toBe(petData.updatePet.status);
      });
    });
  });

  // #4 [POSITIVE] Find Pet by Status
  describe("04_GIVEN a valid status value", () => {
    describe("WHEN user sends GET /pet/findByStatus?status={status}", () => {
      let response;

      beforeAll(async () => {
        console.log("🔍 FIND PETS with STATUS:", petData.findPet.status);

        try {
          response = await petPage.findPetsByStatus(petData.findPet.status);

          console.log("📥 RESPONSE STATUS:", response.status);
          console.log("📊 NUMBER OF PETS FOUND:", response.data.length);
          console.log("📦 SAMPLE PET RESULT:");
          console.log(JSON.stringify(response.data[0], null, 2));
        } catch (error) {
          console.error("❌ FIND PETS FAILED:", error.response?.status);
          console.error("Data:", error.response?.data);
          throw error;
        }
      });

      it("THEN API should return status 200", () => {
        expect(response.status).toBe(200);
      });

      it("AND response should contain pets with matching status", () => {
        const allMatch = response.data.every(
          (pet) => pet.status === petData.findPet.status
        );
        expect(allMatch).toBe(true);
      });

      it("AND at least one pet should be returned", () => {
        expect(response.data.length).toBeGreaterThan(0);
      });
    });
  });

  // #5 [POSITIVE] Delete Pet
  describe("05_GIVEN an existing pet ID", () => {
    describe("WHEN user sends DELETE /pet/{petId}", () => {
      let response;

      beforeAll(async () => {
        console.log("🗑️ DELETING PET with ID:", createdPetId);

        try {
          response = await petPage.deletePet(createdPetId);

          console.log("📥 RESPONSE STATUS:", response.status);
          console.log("📦 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        } catch (error) {
          console.error("❌ DELETE PET FAILED:", error.response?.status);
          console.error("Data:", error.response?.data);
          throw error;
        }
      });

      it("THEN API should return status 200", () => {
        expect(response.status).toBe(200);
      });

      it("AND response message should match deleted pet ID", () => {
        expect(response.data.message).toBe(String(createdPetId));
      });
    });

    describe("WHEN user tries to GET the deleted pet", () => {
      let response;

      beforeAll(async () => {
        console.log("🔍 VERIFYING DELETION for PET ID:", createdPetId);
        try {
          response = await petPage.getPetById(createdPetId);
        } catch (error) {
          response = error.response;
          console.log("📥 RESPONSE STATUS:", response.status);
          console.log("📦 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        }
      });

      it("THEN API should return 404 (not found)", () => {
        expect(response.status).toBe(404);
        expect(response.data.message).toContain("Pet not found");
      });
    });
  });

  // #6 [NEGATIVE] Create Pet Missing Field
  describe("06_GIVEN a pet payload with missing required field", () => {
    describe("WHEN user sends POST /pet", () => {
      let response;

      beforeAll(async () => {
        console.log("📤 REQUEST BODY (MISSING FIELD):");
        console.log(JSON.stringify(petData.createPetMissingField, null, 2));

        try {
          response = await petPage.createPet(petData.createPetMissingField);
          console.log("📥 RESPONSE DATA:");
          console.log(JSON.stringify(response.data, null, 2));
          console.log("📊 RESPONSE STATUS:", response.status);
        } catch (error) {
          response = error.response; // tangkap error untuk assertion
          console.log("❌ RESPONSE STATUS:", response.status);
          console.log("📥 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        }
      });

      it("THEN response should be 200 OK (mock API behavior)", () => {
        expect(response.status).toBe(200);
      });

      it("AND response should indicate missing name field", () => {
        expect(response.data.name).toBeUndefined();
      });
    });
  });

  // #7 [NEGATIVE] Get Non-existent Pet
  describe("07_GIVEN a non-existent pet ID", () => {
    describe("WHEN user sends GET /pet/{petId}", () => {
      let response;

      beforeAll(async () => {
        const petId = petData.getNonExistentPet.id;
        console.log("🔍 FETCHING NON-EXISTENT PET with ID:", petId);

        try {
          response = await petPage.getPetById(petId);
          console.log("📥 RESPONSE DATA:");
          console.log(JSON.stringify(response.data, null, 2));
          console.log("📊 RESPONSE STATUS:", response.status);
        } catch (error) {
          response = error.response; // simpan response error untuk assert
          console.log("❌ RESPONSE STATUS:", response.status);
          console.log("📥 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        }
      });

      it("THEN API should return 404 (not found)", () => {
        expect(response.status).toBe(404);
      });

      it("AND response message should indicate pet not found", () => {
        expect(response.data.message.toLowerCase()).toContain("pet not found");
      });
    });
  });

  // #8 [NEGATIVE] Find Pets Invalid Query
  describe("08_GIVEN an invalid status query", () => {
    describe("WHEN user sends GET /pet/findByStatus?status={status}", () => {
      let response;

      beforeAll(async () => {
        const invalidStatus = petData.findPetsInvalidQuery.status;
        console.log("🔍 FIND PETS with INVALID STATUS:", invalidStatus);

        try {
          response = await petPage.findPetsByStatus(invalidStatus);
          console.log("📥 RESPONSE DATA:");
          console.log(JSON.stringify(response.data, null, 2));
          console.log("📊 RESPONSE STATUS:", response.status);
        } catch (error) {
          response = error.response;
          console.log("❌ RESPONSE STATUS:", response.status);
          console.log("📥 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        }
      });

      it("THEN API should return 200 (empty array)", () => {
        expect(response.status).toBe(200);
      });

      it("AND response should return an empty array", () => {
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBe(0);
      });
    });
  });

  // #9 [NEGATIVE] Delete Pet Invalid ID Format
  describe("09_GIVEN an invalid pet ID format", () => {
    describe("WHEN user sends DELETE /pet/{petId}", () => {
      let response;

      beforeAll(async () => {
        const invalidId = petData.deletePetInvalidId.id;
        console.log("🗑️ DELETING PET with INVALID ID:", invalidId);

        try {
          response = await petPage.deletePet(invalidId);
          console.log("📥 RESPONSE DATA:");
          console.log(JSON.stringify(response.data, null, 2));
          console.log("📊 RESPONSE STATUS:", response.status);
        } catch (error) {
          response = error.response;
          console.log("❌ RESPONSE STATUS:", response.status);
          console.log("📥 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        }
      });

      it("THEN API should return 404 for invalid ID format", () => {
        expect(response.status).toBe(404);
      });

      it("AND response should indicate NumberFormatException", () => {
        expect(response.data.message).toContain("NumberFormatException");
      });
    });
  });

  // #10 [NEGATIVE] Update Pet with Invalid Status
  describe("10_GIVEN an existing pet with invalid status", () => {
    describe("WHEN user sends PUT /pet", () => {
      let response;
      const invalidUpdatePetData = {
        ...petData.createPet,
        ...petData.updatePetInvalidStatus,
      };

      beforeAll(async () => {
        console.log("🛠️ UPDATE PET WITH INVALID STATUS PAYLOAD:");
        console.log(JSON.stringify(invalidUpdatePetData, null, 2));

        try {
          response = await petPage.updatePet(invalidUpdatePetData);
          console.log("📥 RESPONSE DATA:");
          console.log(JSON.stringify(response.data, null, 2));
          console.log("📊 RESPONSE STATUS:", response.status);
        } catch (error) {
          response = error.response;
          console.log("❌ RESPONSE STATUS:", response.status);
          console.log("📥 RESPONSE DATA:", JSON.stringify(response.data, null, 2));
        }
      });

      it("THEN API should return 200 (mock server behavior)", () => {
        expect(response.status).toBe(200);
      });

      it("AND response should reflect updated invalid status", () => {
        expect(response.data.status).toBe(invalidUpdatePetData.status);
      });
    });
  });
});
