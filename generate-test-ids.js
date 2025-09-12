// Generate 10 valid South African ID numbers and store in JSON

function generateCheckDigit(idWithoutCheck) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(idWithoutCheck[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return (10 - (sum % 10)) % 10;
}

function generateValidSAID(year, month, day, gender, citizenship) {
  const yearStr = year.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const genderStr = gender.toString().padStart(4, '0');
  const citizenshipStr = citizenship.toString();
  const raceStr = '8'; // Fixed digit for our examples
  
  const baseId = yearStr + monthStr + dayStr + genderStr + citizenshipStr + raceStr;
  const checkDigit = generateCheckDigit(baseId);
  
  return baseId + checkDigit.toString();
}

// Test data for 10 people
const testData = [
  { year: 90, month: 6, day: 15, gender: 5431, citizenship: 0, name: "John Smith" },
  { year: 85, month: 3, day: 22, gender: 1234, citizenship: 0, name: "Mary Johnson" },
  { year: 95, month: 11, day: 8, gender: 7890, citizenship: 0, name: "David Williams" },
  { year: 88, month: 7, day: 30, gender: 2345, citizenship: 0, name: "Sarah Brown" },
  { year: 92, month: 4, day: 12, gender: 6789, citizenship: 0, name: "Michael Davis" },
  { year: 87, month: 9, day: 25, gender: 3456, citizenship: 0, name: "Emma Wilson" },
  { year: 93, month: 1, day: 5, gender: 8901, citizenship: 0, name: "James Taylor" },
  { year: 89, month: 8, day: 17, gender: 4567, citizenship: 0, name: "Linda Anderson" },
  { year: 91, month: 5, day: 28, gender: 9012, citizenship: 0, name: "Robert Martin" },
  { year: 86, month: 12, day: 3, gender: 1111, citizenship: 0, name: "Patricia White" }
];

// Generate the test data
const testIds = {
  metadata: {
    generated: new Date().toISOString(),
    total: testData.length,
    format: "YYMMDDGGGGCR",
    formatDescription: {
      YY: "Year of birth (00-99)",
      MM: "Month of birth (01-12)",
      DD: "Day of birth (01-31)",
      GGGG: "Gender (0000-4999 = Female, 5000-9999 = Male)",
      C: "Citizenship (0 = SA Citizen, 1 = Permanent Resident)",
      R: "Race (8 for this dataset)",
      "": "Check digit"
    }
  },
  testCases: {
    individuals: [],
    business: {
      registrationTests: [],
      representativeTests: []
    }
  }
};

console.log('Generating test data...\n');

// Generate IDs and create test cases
testData.forEach((person) => {
  const id = generateValidSAID(
    person.year,
    person.month,
    person.day,
    person.gender,
    person.citizenship
  );
  
  const fullYear = person.year < 30 ? 2000 + person.year : 1900 + person.year;
  const birthDate = `${fullYear}-${person.month.toString().padStart(2, '0')}-${person.day.toString().padStart(2, '0')}`;
  const gender = person.gender < 5000 ? 'Female' : 'Male';
  const citizenship = person.citizenship === 0 ? 'South African' : 'Permanent Resident';
  
  // Create individual registration test case
  const individualTest = {
    description: `Register ${person.name} as an individual user`,
    testCase: {
      endpoint: "/api/register/citizen",
      method: "POST",
      requestBody: {
        idNumber: id,
        contactInfo: {
          phone: "+27 82 123 4567",
          email: `${person.name.toLowerCase().replace(' ', '.')}@example.com`
        }
      },
      expectedResponse: {
        status: 201,
        contains: {
          message: "Citizen registered successfully"
        }
      }
    },
    metadata: {
      name: person.name,
      gender: gender,
      birthDate: birthDate,
      citizenship: citizenship
    }
  };
  
  testIds.testCases.individuals.push(individualTest);
  
  // If male, add to business representatives test cases
  if (gender === 'Male') {
    testIds.testCases.business.representativeTests.push({
      description: `Use ${person.name} as business representative`,
      testCase: {
        endpoint: "/api/register/business",
        method: "POST",
        requestBody: {
          businessRegNumber: "2023/123456/07",
          contactInfo: {
            phone: "+27 82 123 4567",
            email: "business@example.com"
          },
          representativeIdNumber: id
        },
        expectedResponse: {
          status: 201,
          contains: {
            message: "Business registered successfully"
          }
        }
      },
      metadata: {
        representativeName: person.name,
        representativeId: id
      }
    });
  }
});

// Write to JSON file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputPath = path.join(__dirname, 'test-ids.json');
fs.writeFileSync(outputPath, JSON.stringify(testIds, null, 2), 'utf8');

console.log('✅ Generated test IDs and saved to test-ids.json');
console.log('\nTest cases included:');
console.log(`- ${testIds.testCases.individuals.length} individual registration tests`);
console.log(`- ${testIds.testCases.business.representativeTests.length} business representative tests`);
console.log('\nSample IDs:');
testIds.testCases.individuals.forEach(test => {
  console.log(`- ${test.testCase.requestBody.idNumber} (${test.metadata.name}, ${test.metadata.gender})`);
});
