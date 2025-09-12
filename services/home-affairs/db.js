// Mock Home Affairs Database
export const homeAffairsDB = {
  citizens: [
    {
      idNumber: "9006155431081",
      firstName: "John",
      lastName: "Smith",
      fullName: "John Smith",
      dateOfBirth: "1990-06-15",
      gender: "Male",
      nationality: "South African",
      maritalStatus: "Single",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "A1234567",
      address: {
        residential: "123 Main Street, Sandton, 2196",
        postal: "PO Box 123, Sandton, 2196"
      },
      placeOfBirth: "Johannesburg",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/9006155431081",
      verificationStatus: "Verified"
    },
    // ... more citizens
  ],
  meta: {
    apiVersion: "1.0.0",
    lastUpdated: "2025-09-12T08:00:00Z",
    environment: "test",
    supportedVerificationTypes: [
      "id_verification",
      "marriage_status",
      "deceased_status",
      "address_verification",
      "photo_verification"
    ]
  }
};
