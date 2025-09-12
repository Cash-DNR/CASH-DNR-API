// Function to extract information from SA ID numbers
function extractIdInfo(idNumber) {
  const cleanId = idNumber.replace(/[\s-]/g, '');
  
  // Basic validation - just check length and that it's numeric
  if (!/^\d{13}$/.test(cleanId)) {
    return null;
  }

  const year = parseInt(cleanId.substring(0, 2));
  const month = parseInt(cleanId.substring(2, 4));
  const day = parseInt(cleanId.substring(4, 6));
  const genderCode = parseInt(cleanId.substring(6, 10));
  const citizenshipCode = parseInt(cleanId.substring(10, 11));

  // Basic date validation
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  // Determine century (assumes current year is 2025)
  const fullYear = year < 26 ? 2000 + year : 1900 + year;
  
  return {
    dateOfBirth: `${fullYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    gender: genderCode < 5000 ? 'Female' : 'Male',
    citizenship: citizenshipCode === 0 ? 'South African' : 'Foreign'
  };
}

// Test with some IDs from our dataset
const testIds = [
  {
    id: "6507093167086",
    expected: {
      name: "Thandiwe Thomas",
      birthDate: "1965-07-09",
      gender: "Female",
      citizenship: "South African"
    }
  },
  {
    id: "9401159384081",
    expected: {
      name: "Larry Ramirez",
      birthDate: "1994-01-15",
      gender: "Male",
      citizenship: "South African"
    }
  },
  {
    id: "8804269690183",
    expected: {
      name: "Mandla Mthembu",
      birthDate: "1988-04-26",
      gender: "Male",
      citizenship: "Foreign"
    }
  }
];

console.log("Testing ID information extraction:\n");

testIds.forEach(test => {
  const result = extractIdInfo(test.id);
  console.log(`Testing ID: ${test.id} (${test.expected.name})`);
  console.log("Expected:", {
    birthDate: test.expected.birthDate,
    gender: test.expected.gender,
    citizenship: test.expected.citizenship
  });
  console.log("Actual:", result);
  console.log("Match:", 
    result.dateOfBirth === test.expected.birthDate &&
    result.gender === test.expected.gender &&
    result.citizenship === (test.expected.citizenship === "South African" ? "South African" : "Foreign")
  );
  console.log("-------------------\n");
});
