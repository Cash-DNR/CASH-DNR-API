// Test data for Cash DNR API
const testData = {
  // Individual Users
  individuals: [
    {
      // Male test users
      male: [
        {
          idNumber: "9006155431081",
          name: "John Smith",
          birthDate: "1990-06-15",
          email: "john.smith@example.com"
        },
        {
          idNumber: "9511087890080",
          name: "David Williams",
          birthDate: "1995-11-08",
          email: "david.williams@example.com",
          phone: "+27 82 123 4567"
        },
        {
          idNumber: "9204126789089",
          name: "Michael Davis",
          birthDate: "1992-04-12",
          email: "michael.davis@example.com",
          phone: "+27 82 123 4567"
        },
        {
          idNumber: "9301058901086",
          name: "James Taylor",
          birthDate: "1993-01-05",
          email: "james.taylor@example.com",
          phone: "+27 82 123 4567"
        },
        {
          idNumber: "9105289012088",
          name: "Robert Martin",
          birthDate: "1991-05-28",
          email: "robert.martin@example.com",
          phone: "+27 82 123 4567"
        }
      ],
      // Female test users
      female: [
        {
          idNumber: "8503221234086",
          name: "Mary Johnson",
          birthDate: "1985-03-22",
          email: "mary.johnson@example.com",
          phone: "+27 82 123 4567"
        },
        {
          idNumber: "8807302345087",
          name: "Sarah Brown",
          birthDate: "1988-07-30",
          email: "sarah.brown@example.com",
          phone: "+27 82 123 4567"
        },
        {
          idNumber: "8709253456089",
          name: "Emma Wilson",
          birthDate: "1987-09-25",
          email: "emma.wilson@example.com",
          phone: "+27 82 123 4567"
        },
        {
          idNumber: "8908174567087",
          name: "Linda Anderson",
          birthDate: "1989-08-17",
          email: "linda.anderson@example.com",
          phone: "+27 82 123 4567"
        },
        {
          idNumber: "8612031111085",
          name: "Patricia White",
          birthDate: "1986-12-03",
          email: "patricia.white@example.com",
          phone: "+27 82 123 4567"
        }
      ]
    }
  ],
  // Business registration test data
  business: {
    // Valid business numbers for testing
    validBusinessNumbers: [
      "2023/123456/07",
      "2023/789123/07",
      "2023/456789/07",
      "2023/987654/07",
      "2023/654321/07"
    ],
    // Test business registrations (using male IDs as representatives)
    testCases: [
      {
        businessRegNumber: "2023/123456/07",
        tradingName: "Tech Solutions",
        representativeId: "9006155431081", // John Smith
        contactInfo: {
          phone: "+27 82 123 4567",
          email: "tech.solutions@example.com"
        }
      },
      {
        businessRegNumber: "2023/789123/07",
        tradingName: "Green Energy",
        representativeId: "9511087890080", // David Williams
        contactInfo: {
          phone: "+27 82 123 4567",
          email: "green.energy@example.com"
        }
      },
      {
        businessRegNumber: "2023/456789/07",
        tradingName: "Digital Services",
        representativeId: "9204126789089", // Michael Davis
        contactInfo: {
          phone: "+27 82 123 4567",
          email: "digital.services@example.com"
        }
      }
    ]
  }
};

// Example usage for individual registration:
/*
// Register an individual
fetch('http://localhost:4000/api/register/citizen', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idNumber: testData.individuals[0].male[0].idNumber,
    contactInfo: {
      phone: testData.individuals[0].male[0].phone,
      email: testData.individuals[0].male[0].email
    }
  })
});

// Register a business
fetch('http://localhost:4000/api/register/business', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    businessRegNumber: testData.business.testCases[0].businessRegNumber,
    representativeIdNumber: testData.business.testCases[0].representativeId,
    contactInfo: testData.business.testCases[0].contactInfo
  })
});
*/

// Quick test for specific scenarios
const quickTests = {
  // Test individual registration
  registerMale: {
    idNumber: "9006155431081", // John Smith
    contactInfo: {
      email: "john.smith@example.com"
    }
  },
  registerFemale: {
    idNumber: "8503221234086", // Mary Johnson
    contactInfo: {
      email: "mary.johnson@example.com"
    }
  },
  // Test business registration
  registerBusiness: {
    businessRegNumber: "2023/123456/07",
    representativeIdNumber: "9006155431081", // John Smith as representative
    contactInfo: {
      email: "business@example.com"
    }
  }
};

// Export the test data
export { testData, quickTests };
