# CASH-DNR API Documentation V2

## Overview
This API provides a comprehensive solution for South African fintech applications that need to:
- Verify user identities with Home Affairs
- Verify tax compliance with SARS
- Register users with automatic tax ID generation
- Log and track transactions with tax classification
- Maintain audit trails for regulatory compliance

## Base URLs
```
http://localhost:4000/home-affairs  # Home Affairs API endpoints
http://localhost:4000/sars         # SARS API endpoints
http://localhost:4000/api          # Core application endpoints
```

## Authentication
Currently using mock data. In production, implement JWT or OAuth2 authentication.

## Rate Limiting
- 100 requests per minute per IP address
- Returns 429 status code when exceeded

---

## 1. HOME AFFAIRS API

### Verify Citizen Identity
**GET** `/home-affairs/citizens/{idNumber}`

Verifies a citizen's identity against Home Affairs records.

**Response (200):**
```json
{
  "success": true,
  "citizen": {
    "idNumber": "9001015009087",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "nationality": "South African",
    "maritalStatus": "Single",
    "spouseIdNumber": null,
    "deceasedStatus": "Alive",
    "address": {
      "residential": "123 Main Street, Sandton, 2196",
      "postal": "PO Box 123, Sandton, 2196"
    },
    "placeOfBirth": "Johannesburg",
    "citizenshipStatus": "Citizen"
  }
}
```

### Get Marriage Status
**GET** `/home-affairs/citizens/{idNumber}/marriage-status`

Verifies a citizen's marriage status.

**Response (200):**
```json
{
  "success": true,
  "idNumber": "9001015009087",
  "maritalStatus": "Single",
  "spouseIdNumber": null,
  "verificationTimestamp": "2025-09-12T10:30:00Z"
}
```

### Get Supported Verification Types
**GET** `/home-affairs/verification-types`

Lists all supported verification types for Home Affairs.

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

---

## 2. SARS API

### Verify Tax Status
**GET** `/sars/taxpayers/{idNumber}/verification`

Verifies a citizen's tax registration and compliance status.

**Response (200) - Registered Taxpayer:**
```json
{
  "success": true,
  "idNumber": "9001015009087",
  "isTaxRegistered": true,
  "taxNumber": "1990601554",
  "verificationTimestamp": "2025-09-12T10:30:00Z",
  "validationSource": "Mock SARS DB",
  "complianceDetails": {
    "status": "Non-compliant",
    "lastVerified": "2025-09-12",
    "outstandingReturns": {
      "VAT": ["2025-Q2", "2025-Q3"],
      "PAYE": [],
      "ITR": ["2024"],
      "PIT": ["2024"]
    },
    "lastSubmissions": {
      "VAT": "2025-03-25",
      "PAYE": "2025-09-01",
      "ITR": "2023-11-30",
      "PIT": "2023-11-30"
    },
    "complianceIssues": [
      "Outstanding VAT returns",
      "Late ITR submission",
      "Overdue tax payment"
    ],
    "nextFilingDue": {
      "VAT": {
        "period": "2025-Q3",
        "dueDate": "2025-09-25"
      },
      "PAYE": {
        "period": "2025-09",
        "dueDate": "2025-09-07"
      },
      "ITR": {
        "period": "2025",
        "dueDate": "2025-11-30"
      },
      "PIT": {
        "period": "2025",
        "dueDate": "2025-11-30"
      }
    }
  }
}
```

**Response (200) - Non-Registered Person:**
```json
{
  "success": true,
  "idNumber": "0201014567083",
  "isTaxRegistered": false,
  "taxNumber": null,
  "status": "Not Registered",
  "verificationTimestamp": "2025-09-12T10:30:00Z",
  "validationSource": "Mock SARS DB"
}
```

### Get Supported Tax Verification Types
**GET** `/sars/verification-types`

Lists all supported verification types for SARS.

**Response (200):**
```json
{
  "success": true,
  "verificationTypes": [
    "tax_verification",
    "vat_status",
    "tax_compliance",
    "returns_status"
  ]
}
```

---

## 3. CORE APPLICATION API

[Previous core application endpoints remain unchanged]

---

## Integration Example

### Complete User Verification Flow
```javascript
// 1. Verify identity with Home Affairs
const haResponse = await fetch('/home-affairs/citizens/9001015009087');
const haData = await haResponse.json();

if (haData.success) {
  // 2. Check tax status with SARS
  const sarsResponse = await fetch('/sars/taxpayers/9001015009087/verification');
  const sarsData = await sarsResponse.json();

  if (sarsData.isTaxRegistered) {
    console.log('Tax Status:', sarsData.complianceDetails.status);
    console.log('Outstanding Returns:', sarsData.complianceDetails.outstandingReturns);
  }
}
```

## Error Handling

All services return consistent error responses:

**Error Response Format:**
```json
{
  "success": false,
  "error": "Description of the error",
  "code": "ERROR_CODE",
  "timestamp": "2025-09-12T10:30:00Z",
  "service": "home-affairs|sars|core"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `429`: Rate Limited
- `500`: Internal Server Error

## Security Considerations

### Current Implementation (MVP)
- Basic rate limiting per service
- Input validation
- Audit logging
- In-memory data storage

### Production Requirements
- JWT/OAuth2 authentication
- Service-specific API keys
- HTTPS only
- IP whitelisting
- Audit trail for all service calls
- GDPR/POPIA compliance
