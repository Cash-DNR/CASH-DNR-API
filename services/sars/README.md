# SARS API Documentation

Base URL: `http://localhost:4000/sars`

## Endpoints

### 1. Tax Verification
**GET** `/taxpayers/{idNumber}/verification`

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
    "status": "Compliant",  // "Compliant", "Non-compliant", "Pending", "Unknown"
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

### 2. List Tax Verification Types
**GET** `/verification-types`

Lists all supported tax verification types.

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

## Return Types

- **VAT**: Value Added Tax returns (quarterly)
- **PAYE**: Pay As You Earn (monthly)
- **ITR**: Income Tax Return (annual)
- **PIT**: Personal Income Tax (annual)

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
- `404`: Taxpayer not found
- `400`: Invalid request
- `500`: Internal server error
