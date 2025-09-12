# CASH-DNR API Services Documentation

## Service Architecture Overview

The CASH-DNR API consists of three main services:

1. **Home Affairs Service** - Identity verification
2. **SARS Service** - Tax compliance verification
3. **Core API Service** - Main application logic

## Base URLs
- Home Affairs: `http://localhost:4000/home-affairs`
- SARS: `http://localhost:4000/sars`
- Core API: `http://localhost:4000/api`

---

# 1. Home Affairs Service

## Identity Endpoints

### 1.1 Verify Citizen Identity
**GET** `/home-affairs/citizens/{idNumber}`

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

### 1.2 Verify Marriage Status
**GET** `/home-affairs/citizens/{idNumber}/marriage-status`

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

### 1.3 List Home Affairs Verifications
**GET** `/home-affairs/verification-types`

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

# 2. SARS Service

## Tax Verification Endpoints

### 2.1 Tax Status Verification
**GET** `/sars/taxpayers/{idNumber}/verification`

Verifies citizen's tax registration and compliance status.

**Response (200) - Registered Taxpayer:**
```json
{
  "success": true,
  "idNumber": "9006155431081",
  "isTaxRegistered": true,
  "taxNumber": "1990601554",
  "verificationTimestamp": "2025-09-12T10:30:00Z",
  "validationSource": "Mock SARS DB",
  "complianceDetails": {
    "status": "Compliant",
    "lastVerified": "2025-09-12",
    "outstandingReturns": {
      "VAT": [],
      "PAYE": [],
      "ITR": [],
      "PIT": []
    },
    "lastSubmissions": {
      "VAT": "2025-08-25",
      "PAYE": "2025-09-01",
      "ITR": "2024-11-15",
      "PIT": "2024-11-15"
    },
    "complianceIssues": [],
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

### 2.2 List SARS Verification Types
**GET** `/sars/verification-types`

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

## Tax Compliance Statuses

- **Compliant**: All returns filed and up to date
- **Non-compliant**: Missing returns or outstanding payments
- **Pending**: Verification in progress or under review
- **Unknown**: Unable to determine status

## Return Types and Frequencies

| Return Type | Description | Frequency | Due Date |
|-------------|-------------|-----------|----------|
| VAT | Value Added Tax | Quarterly | 25th of month after quarter end |
| PAYE | Pay As You Earn | Monthly | 7th of following month |
| ITR | Income Tax Return | Annual | November 30th |
| PIT | Personal Income Tax | Annual | November 30th |

---

# Integration Examples

## Complete Citizen Verification

This example shows how to verify both identity and tax status:

```javascript
async function verifyCitizen(idNumber) {
  // 1. Verify identity with Home Affairs
  const identityResponse = await fetch(
    `http://localhost:4000/home-affairs/citizens/${idNumber}`
  );
  const identityData = await identityResponse.json();

  if (!identityData.success) {
    throw new Error("Identity verification failed");
  }

  // 2. Check tax status with SARS
  const taxResponse = await fetch(
    `http://localhost:4000/sars/taxpayers/${idNumber}/verification`
  );
  const taxData = await taxResponse.json();

  return {
    identity: identityData.citizen,
    taxStatus: taxData
  };
}
```

## Error Handling

All services use a consistent error format:

```json
{
  "success": false,
  "error": "Description of the error",
  "timestamp": "2025-09-12T10:30:00Z",
  "service": "home-affairs|sars"
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Invalid request
- `404`: Resource not found
- `500`: Internal server error

## Security Considerations

1. **Authentication**
   - JWT/OAuth2 planned for production
   - Service-specific API keys

2. **Rate Limiting**
   - 100 requests per minute per IP
   - Applies to each service independently

3. **Data Privacy**
   - Sensitive data masked in responses
   - POPIA compliance built-in
