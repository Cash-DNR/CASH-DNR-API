# CASH-DNR API Documentation

## Overview
This API provides a comprehensive solution for South African fintech applications that need to:
- Verify user identities with Home Affairs and CIPC
- Register users with automatic tax ID generation
- Log and track transactions with tax classification
- Maintain audit trails for regulatory compliance
- Provide admin dashboard functionality

## Base URL
```
http://localhost:4000/api
```

## Authentication
Currently using mock data. In production, implement JWT or OAuth2 authentication.

## Rate Limiting
- 100 requests per minute per IP address
- Returns 429 status code when exceeded

---

## 1. USER REGISTRATION

### Register Individual Citizen
**POST** `/register/citizen`

Registers a South African citizen using their ID number.

**Request Body:**
```json
{
  "idNumber": "9001015009087",
  "contactInfo": {
    "phone": "+27 82 123 4567",
    "email": "user@example.com"
  }
}
```

**Response (201):**
```json
{
  "message": "Citizen registered successfully",
  "userId": "USR-uuid-here",
  "taxId": "TID-ABCD1234",
  "userInfo": {
    "fullName": "John Doe",
    "userType": "Individual",
    "status": "Active"
  }
}
```

**Error Responses:**
- `400`: ID number required
- `404`: ID number not found in Home Affairs
- `409`: User already registered

### Register Business Entity
**POST** `/register/business`

Registers a South African business using CIPC registration number.

**Request Body:**
```json
{
  "businessRegNumber": "2022/123456/07",
  "representativeIdNumber": "9001015009087",
  "contactInfo": {
    "phone": "+27 11 123 4567",
    "email": "business@example.com"
  }
}
```

**Response (201):**
```json
{
  "message": "Business registered successfully",
  "userId": "USR-uuid-here",
  "taxId": "TBD-EFGH5678",
  "businessInfo": {
    "registeredName": "ACME Pty Ltd",
    "tradingName": "ACME",
    "userType": "Business",
    "status": "Active"
  }
}
```

---

## 2. USER MANAGEMENT

### Get User Profile
**GET** `/users/{userId}`

Retrieves user profile information.

**Response (200):**
```json
{
  "userId": "USR-uuid-here",
  "userType": "Individual",
  "taxId": "TID-ABCD1234",
  "status": "Active",
  "kycStatus": "Verified",
  "registrationDate": "2025-08-16T10:30:00Z",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01",
    "gender": "Male",
    "nationality": "South African"
  }
}
```

### Update Contact Information
**PUT** `/users/{userId}/contact`

Updates user contact information.

**Request Body:**
```json
{
  "phone": "+27 82 987 6543",
  "email": "newemail@example.com"
}
```

---

## 3. TRANSACTION LOGGING

### Create Transaction
**POST** `/transactions`

Logs a new transaction with automatic tax classification.

**Request Body:**
```json
{
  "amount": 1500.00,
  "purpose": "Payment for services rendered",
  "userId": "USR-uuid-here",
  "transactionType": "manual",
  "cashNoteSerial": "ZAR123456789",
  "digitalReference": "EFT-REF-12345",
  "receiverInfo": {
    "name": "Jane Doe",
    "taxId": "TID-WXYZ9876"
  },
  "metadata": {
    "location": "Johannesburg",
    "device": "mobile_app"
  }
}
```

**Response (201):**
```json
{
  "message": "Transaction logged successfully",
  "transaction": {
    "reference": "TXN-1692179400000-1234",
    "amount": 1500.00,
    "purpose": "Payment for services rendered",
    "taxClassification": "Review-Required",
    "timestamp": "2025-08-16T10:30:00Z",
    "status": "Completed"
  }
}
```

**Tax Classifications:**
- `Non-Taxable`: Amount ≤ R1,000
- `Review-Required`: Amount > R1,000 but < R25,000
- `Taxable-Business`: Contains business keywords
- `Taxable-HighValue`: Amount ≥ R25,000

### Get User Transaction History
**GET** `/users/{userId}/transactions`

Retrieves transaction history with filtering and pagination.

**Query Parameters:**
- `limit`: Number of transactions (default: 50)
- `offset`: Pagination offset (default: 0)
- `taxClassification`: Filter by tax classification
- `fromDate`: Start date (ISO format)
- `toDate`: End date (ISO format)

**Response (200):**
```json
{
  "transactions": [
    {
      "reference": "TXN-1692179400000-1234",
      "amount": 1500.00,
      "purpose": "Payment for services",
      "taxClassification": "Review-Required",
      "timestamp": "2025-08-16T10:30:00Z",
      "transactionType": "manual",
      "status": "Completed"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "taxSummary": {
    "totalTransactions": 25,
    "taxableAmount": 15000.00,
    "nonTaxableAmount": 5000.00,
    "reviewRequired": 3
  }
}
```

### Get Transaction Details
**GET** `/transactions/{reference}`

Retrieves detailed information about a specific transaction.

### Transfer Transaction Ownership
**POST** `/transactions/{reference}/transfer`

Transfers ownership of a transaction to another user.

**Request Body:**
```json
{
  "newOwnerId": "USR-new-owner-uuid",
  "transferReason": "Asset sale"
}
```

---

## 4. TAX MANAGEMENT

### Get Tax Summary
**GET** `/users/{userId}/tax-summary`

Generates annual tax summary for a user.

**Query Parameters:**
- `year`: Tax year (default: current year)

**Response (200):**
```json
{
  "taxYear": 2025,
  "taxId": "TID-ABCD1234",
  "userType": "Individual",
  "totalTransactions": 45,
  "totalAmount": 125000.00,
  "taxableAmount": 75000.00,
  "nonTaxableAmount": 45000.00,
  "reviewRequiredAmount": 5000.00,
  "taxableTransactions": [],
  "nonTaxableTransactions": [],
  "reviewRequiredTransactions": [],
  "generatedAt": "2025-08-16T10:30:00Z"
}
```

### Export Tax Data
**GET** `/users/{userId}/tax-export`

Exports tax data for SARS submission.

**Query Parameters:**
- `year`: Tax year (default: current year)
- `format`: Export format (`json` or `csv`)

**Response:** JSON object or CSV file download

---

## 5. VERIFICATION APIS

### Verify Citizen (Home Affairs)
**GET** `/citizens/{idNumber}`

Verifies citizen data against Home Affairs database.

### Verify Business (CIPC)
**GET** `/businesses/{regNumber}`

Verifies business data against CIPC database.

---

## 6. ADMIN DASHBOARD

### System Statistics
**GET** `/admin/statistics`

Returns system-wide statistics.

**Response (200):**
```json
{
  "users": {
    "total": 1250,
    "individuals": 1100,
    "businesses": 150,
    "active": 1200
  },
  "transactions": {
    "total": 15000,
    "totalAmount": 2500000.00,
    "taxable": 5000,
    "reviewRequired": 150,
    "today": 25
  },
  "system": {
    "auditLogs": 50000,
    "lastActivity": "2025-08-16T10:30:00Z",
    "uptime": 86400
  }
}
```

### Flagged Transactions
**GET** `/admin/flagged-transactions`

Returns transactions requiring admin review.

### Update Transaction Classification
**PUT** `/admin/transactions/{reference}/classification`

Updates tax classification of a transaction (admin only).

**Request Body:**
```json
{
  "newClassification": "Taxable-Business",
  "adminNotes": "Verified as business transaction"
}
```

---

## 7. AUDIT LOGS

### Get Audit Logs
**GET** `/admin/audit-logs`

Retrieves system audit logs with filtering.

**Query Parameters:**
- `limit`: Number of logs (default: 100)
- `offset`: Pagination offset
- `userId`: Filter by user ID
- `action`: Filter by action type
- `fromDate`: Start date
- `toDate`: End date

---

## 8. HEALTH CHECK

### Health Status
**GET** `/health`

Returns API health status.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-16T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "homeAffairs": "mock",
    "cipc": "mock",
    "database": "in-memory"
  }
}
```

---

## Error Handling

All endpoints return consistent error responses:

**Error Response Format:**
```json
{
  "error": "Description of the error",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-16T10:30:00Z"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Rate Limited
- `500`: Internal Server Error

---

## Security Considerations

### Current Implementation (MVP)
- Basic rate limiting
- Input validation
- Audit logging
- In-memory data storage

### Production Requirements
- JWT/OAuth2 authentication
- Database encryption
- HTTPS only
- IP whitelisting for admin endpoints
- Data anonymization for logs
- GDPR/POPIA compliance
- API key management

---

## Integration Examples

### Register and Create Transaction Flow

```javascript
// 1. Register user
const registerResponse = await fetch('/api/register/citizen', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idNumber: '9001015009087',
    contactInfo: {
      phone: '+27 82 123 4567',
      email: 'user@example.com'
    }
  })
});

const userData = await registerResponse.json();
const userId = userData.userId;

// 2. Create transaction
const transactionResponse = await fetch('/api/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1500.00,
    purpose: 'Service payment',
    userId: userId,
    transactionType: 'manual'
  })
});

const transactionData = await transactionResponse.json();
console.log('Transaction created:', transactionData.transaction.reference);
```

This API provides a solid foundation for your Phase 1 requirements. You can extend it by integrating with real Home Affairs and CIPC APIs, implementing proper authentication, and adding a database layer.
