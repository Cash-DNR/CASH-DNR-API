# Home Affairs API Documentation

Base URL: `http://localhost:4000/home-affairs`

## Endpoints

### 1. Verify Citizen Identity
**GET** `/citizens/{idNumber}`

Verifies and retrieves citizen's basic information.

**Response (200):**
```json
{
  "success": true,
  "citizen": {
    "idNumber": "9006155431081",
    "firstName": "John",
    "lastName": "Smith",
    "fullName": "John Smith",
    "dateOfBirth": "1990-06-15",
    "gender": "Male",
    "nationality": "South African",
    "maritalStatus": "Single",
    "deceasedStatus": "Alive",
    "address": {
      "residential": "123 Main Street, Sandton, 2196",
      "postal": "PO Box 123, Sandton, 2196"
    },
    "citizenshipStatus": "Citizen"
  }
}
```

### 2. Verify Marriage Status
**GET** `/citizens/{idNumber}/marriage-status`

Verifies citizen's marriage status.

**Response (200):**
```json
{
  "success": true,
  "idNumber": "9006155431081",
  "maritalStatus": "Married",
  "spouseIdNumber": "9202026009089",
  "verificationTimestamp": "2025-09-12T10:30:00Z"
}
```

### 3. List Supported Verifications
**GET** `/verification-types`

Lists all supported verification types.

**Response (200):**
```json
{
  "success": true,
  "verificationTypes": [
    "id_verification",
    "marriage_status",
    "deceased_status",
    "address_verification",
    "photo_verification"
  ]
}
```

## Error Responses

**Error Response Format:**
```json
{
  "success": false,
  "error": "Description of the error",
  "timestamp": "2025-09-12T10:30:00Z"
}
```

**Common Status Codes:**
- `404`: Citizen not found
- `400`: Invalid request
- `500`: Internal server error
