// Generate 10 valid South African ID numbers with strict validation

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
  // Ensure all inputs are properly padded to correct length
  const yearStr = year.toString().padStart(2, '0');
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  const genderStr = gender.toString().padStart(4, '0');
  const citizenshipStr = citizenship.toString();
  const raceStr = '8'; // Fixed digit for our examples
  
  const baseId = yearStr + monthStr + dayStr + genderStr + citizenshipStr + raceStr;
  const checkDigit = generateCheckDigit(baseId);
  
  const fullId = baseId + checkDigit.toString();
  
  // Verify the generated ID is exactly 13 digits
  if (fullId.length !== 13) {
    throw new Error(`Invalid ID length: ${fullId.length} digits`);
  }
  
  return fullId;
}

function validateSAID(id) {
  if (id.length !== 13) return false;
  
  const year = parseInt(id.substring(0, 2));
  const month = parseInt(id.substring(2, 4));
  const day = parseInt(id.substring(4, 6));
  const genderCode = parseInt(id.substring(6, 10));
  const citizenshipCode = parseInt(id.substring(10, 11));
  
  // Basic validations
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (genderCode < 0 || genderCode > 9999) return false;
  if (citizenshipCode !== 0 && citizenshipCode !== 1) return false;
  
  // Verify checksum
  const checkDigit = generateCheckDigit(id.substring(0, 12));
  return checkDigit === parseInt(id[12]);
}

// Generate 10 valid IDs with additional validation
const generatedIds = [];

try {
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
  
  console.log('Generating 10 valid South African ID numbers...\n');
  console.log('| # | ID Number | Name | Birth Date | Gender | Citizenship |');
  console.log('|---|-----------|------|------------|--------|-------------|');
  
  testData.forEach((person, index) => {
    const id = generateValidSAID(
      person.year,
      person.month,
      person.day,
      person.gender,
      person.citizenship
    );
    
    // Validate the generated ID
    if (!validateSAID(id)) {
      throw new Error(`Generated ID failed validation: ${id}`);
    }
    
    // Extract information from ID
    const fullYear = person.year < 30 ? 2000 + person.year : 1900 + person.year;
    const birthDate = `${fullYear}-${person.month.toString().padStart(2, '0')}-${person.day.toString().padStart(2, '0')}`;
    const gender = person.gender < 5000 ? 'Female' : 'Male';
    const citizenship = person.citizenship === 0 ? 'South African' : 'Permanent Resident';
    
    // Store and display the result
    generatedIds.push({
      id: id,
      name: person.name,
      birthDate: birthDate,
      gender: gender,
      citizenship: citizenship
    });
    
    console.log(`| ${(index + 1).toString().padStart(2, '0')} | ${id} | ${person.name} | ${birthDate} | ${gender} | ${citizenship} |`);
  });
  
  console.log('\nAll IDs have been validated and are exactly 13 digits long.');
  console.log('You can use these IDs for testing the registration endpoints.');
  
} catch (error) {
  console.error('Error generating IDs:', error.message);
}
