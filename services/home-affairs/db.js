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
    {
      idNumber: "8503221234086",
      firstName: "Mary",
      lastName: "Johnson",
      fullName: "Mary Johnson",
      dateOfBirth: "1985-03-22",
      gender: "Female",
      nationality: "South African",
      maritalStatus: "Married",
      spouseIdNumber: "8301015392087",
      deceasedStatus: "Alive",
      passportNumber: "B2345678",
      address: {
        residential: "45 Beach Road, Sea Point, Cape Town, 8005",
        postal: "PO Box 789, Sea Point, 8005"
      },
      placeOfBirth: "Cape Town",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/8503221234086",
      verificationStatus: "Verified"
    },
    {
      idNumber: "9511087890080",
      firstName: "David",
      lastName: "Williams",
      fullName: "David Williams",
      dateOfBirth: "1995-11-08",
      gender: "Male",
      nationality: "South African",
      maritalStatus: "Single",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "C3456789",
      address: {
        residential: "789 Long Street, Pretoria, 0002",
        postal: "Private Bag X1, Pretoria, 0002"
      },
      placeOfBirth: "Pretoria",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/9511087890080",
      verificationStatus: "Verified"
    },
    {
      idNumber: "8709253456089",
      firstName: "Emma",
      lastName: "Wilson",
      fullName: "Emma Wilson",
      dateOfBirth: "1987-09-25",
      gender: "Female",
      nationality: "South African",
      maritalStatus: "Divorced",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "D4567890",
      address: {
        residential: "56 Durban Road, Durban, 4001",
        postal: "PO Box 456, Durban, 4001"
      },
      placeOfBirth: "Durban",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/8709253456089",
      verificationStatus: "Verified"
    },
    {
      idNumber: "9301058901086",
      firstName: "James",
      lastName: "Taylor",
      fullName: "James Taylor",
      dateOfBirth: "1993-01-05",
      gender: "Male",
      nationality: "South African",
      maritalStatus: "Married",
      spouseIdNumber: "9405121234083",
      deceasedStatus: "Alive",
      passportNumber: "E5678901",
      address: {
        residential: "101 Commissioner Street, Johannesburg, 2001",
        postal: "PO Box 901, Johannesburg, 2001"
      },
      placeOfBirth: "Johannesburg",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/9301058901086",
      verificationStatus: "Verified"
    },
    {
      idNumber: "8612031111085",
      firstName: "Patricia",
      lastName: "White",
      fullName: "Patricia White",
      dateOfBirth: "1986-12-03",
      gender: "Female",
      nationality: "South African",
      maritalStatus: "Single",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "F6789012",
      address: {
        residential: "15 Church Street, Stellenbosch, 7600",
        postal: "PO Box 123, Stellenbosch, 7600"
      },
      placeOfBirth: "Stellenbosch",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/8612031111085",
      verificationStatus: "Verified"
    }
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
