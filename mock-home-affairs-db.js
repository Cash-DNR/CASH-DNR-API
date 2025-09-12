// Mock Home Affairs Database
export const homeAffairsDB = {
  citizens: [
    {
      idNumber: "9006155431081",
      firstName: "John",
      lastName: "Smith",
      fullName: "John Smith",
      dateOfBirth: "1990-06-15",
      taxNumber: "1990601554",  // Tax number derived from ID
      taxDetails: {
        complianceStatus: "Non-compliant",
        lastVerificationDate: "2025-08-15",
        outstandingReturns: {
          VAT: ["2025-Q2", "2025-Q3"],
          PAYE: [],
          ITR: ["2024"],
          PIT: ["2024"]
        },
        lastSubmissions: {
          VAT: "2025-03-25",
          PAYE: "2025-09-01",
          ITR: "2023-11-30",
          PIT: "2023-11-30"
        },
        complianceIssues: [
          "Outstanding VAT returns",
          "Late ITR submission",
          "Overdue tax payment"
        ]
      },
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
      taxNumber: "1985322123",  // Tax number derived from ID
      taxDetails: {
        complianceStatus: "Compliant",
        lastVerificationDate: "2025-09-10",
        outstandingReturns: {
          VAT: [],
          PAYE: [],
          ITR: [],
          PIT: []
        },
        lastSubmissions: {
          VAT: "2025-08-25",
          PAYE: "2025-09-01",
          ITR: "2024-11-15",
          PIT: "2024-11-15"
        },
        complianceIssues: []
      },
      gender: "Female",
      nationality: "South African",
      maritalStatus: "Married",
      spouseIdNumber: "8404215687083",
      deceasedStatus: "Alive",
      passportNumber: "B9876543",
      address: {
        residential: "45 Oak Avenue, Cape Town, 8001",
        postal: "PO Box 456, Cape Town, 8001"
      },
      placeOfBirth: "Cape Town",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/8503221234086",
      verificationStatus: "Verified"
    },
    {
      idNumber: "9511087890080",
      firstName: "David",
      lastName: "Brown",
      fullName: "David Brown",
      dateOfBirth: "1995-11-08",
      taxNumber: null,  // No tax registration
      gender: "Male",
      nationality: "South African",
      maritalStatus: "Single",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "C7654321",
      address: {
        residential: "78 Pine Road, Durban, 4001",
        postal: "PO Box 789, Durban, 4001"
      },
      placeOfBirth: "Durban",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/9511087890080",
      verificationStatus: "Verified"
    },
    {
      idNumber: "0201014567083",
      firstName: "Sarah",
      lastName: "Thompson",
      fullName: "Sarah Thompson",
      dateOfBirth: "2002-01-01",
      taxNumber: null,  // No tax registration - young citizen
      gender: "Female",
      nationality: "South African",
      maritalStatus: "Single",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "D2468135",
      address: {
        residential: "92 Beach Drive, Port Elizabeth, 6001",
        postal: "PO Box 321, Port Elizabeth, 6001"
      },
      placeOfBirth: "Port Elizabeth",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/0201014567083",
      verificationStatus: "Verified"
    },
    {
      idNumber: "7012159876081",
      firstName: "Robert",
      lastName: "Williams",
      fullName: "David Williams",
      dateOfBirth: "1995-11-08",
      taxNumber: "1995108789",  // Tax number derived from ID
      taxDetails: {
        complianceStatus: "Pending",
        lastVerificationDate: "2025-09-01",
        outstandingReturns: {
          VAT: [],
          PAYE: ["2025-08"],
          ITR: [],
          PIT: []
        },
        lastSubmissions: {
          VAT: "N/A",
          PAYE: "2025-07-31",
          ITR: "2024-11-20",
          PIT: "2024-11-20"
        },
        complianceIssues: [
          "PAYE submission under review"
        ]
      },
      gender: "Male",
      nationality: "South African",
      maritalStatus: "Single",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "C2345678",
      address: {
        residential: "78 Beach Road, Durban, 4001",
        postal: "PO Box 789, Durban, 4001"
      },
      placeOfBirth: "Durban",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/9511087890080",
      verificationStatus: "Verified"
    },
    {
      idNumber: "8807302345087",
      firstName: "Sarah",
      lastName: "Brown",
      fullName: "Sarah Brown",
      dateOfBirth: "1988-07-30",
      taxNumber: "1988730234",  // Tax number derived from ID
      gender: "Female",
      nationality: "South African",
      maritalStatus: "Divorced",
      spouseIdNumber: null,
      deceasedStatus: "Alive",
      passportNumber: "D3456789",
      address: {
        residential: "15 Church Street, Pretoria, 0002",
        postal: "PO Box 101, Pretoria, 0002"
      },
      placeOfBirth: "Pretoria",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/8807302345087",
      verificationStatus: "Verified"
    },
    {
      idNumber: "9204126789089",
      firstName: "Michael",
      lastName: "Davis",
      fullName: "Michael Davis",
      dateOfBirth: "1992-04-12",
      taxNumber: "1992412678",  // Tax number derived from ID
      gender: "Male",
      nationality: "South African",
      maritalStatus: "Married",
      spouseIdNumber: "9303125432081",
      deceasedStatus: "Alive",
      passportNumber: "E4567890",
      address: {
        residential: "234 Long Street, Bloemfontein, 9301",
        postal: "PO Box 234, Bloemfontein, 9301"
      },
      placeOfBirth: "Bloemfontein",
      citizenshipStatus: "Citizen",
      photoUrl: "https://example.com/photos/9204126789089",
      verificationStatus: "Verified"
    }
  ],
  // Meta information for the Home Affairs API
  meta: {
    apiVersion: "1.0.0",
    lastUpdated: "2025-09-12T08:00:00Z",
    environment: "test",
    supportedVerificationTypes: [
      "id_verification",
      "marriage_status",
      "deceased_status",
      "address_verification",
      "photo_verification",
      "tax_verification"
    ]
  }
};
