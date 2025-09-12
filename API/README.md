# Core API Documentation

Base URL: `http://localhost:4000/api`

## Authentication
Currently using mock data. JWT/OAuth2 authentication planned for production.

## Rate Limiting
- 100 requests per minute per IP address
- Returns 429 status code when exceeded

## 1. User Registration

### Register Individual Citizen
**POST** `/register/citizen`

**Request:**
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

### Register Business Entity
**POST** `/register/business`

**Request:**
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

## 2. Transaction Management

### Create Transaction
**POST** `/transactions`

**Request:**
```json
{
  "amount": 1500.00,
  "purpose": "Payment for services",
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
    "purpose": "Payment for services",
    "taxClassification": "Review-Required",
    "timestamp": "2025-09-12T10:30:00Z",
    "status": "Completed"
  }
}
```

### Get User Transactions
**GET** `/users/{userId}/transactions`

**Query Parameters:**
- `limit`: Number of transactions (default: 50)
- `offset`: Pagination offset (default: 0)
- `taxClassification`: Filter by classification
- `fromDate`: Start date (ISO format)
- `toDate`: End date (ISO format)

## 3. Tax Management

### Get Tax Summary
**GET** `/users/{userId}/tax-summary`

**Query Parameters:**
- `year`: Tax year (default: current year)

### Export Tax Data
**GET** `/users/{userId}/tax-export`

**Query Parameters:**
- `year`: Tax year (default: current year)
- `format`: Export format (`json` or `csv`)

## 4. Admin Dashboard

### System Statistics
**GET** `/admin/statistics`

### Flagged Transactions
**GET** `/admin/flagged-transactions`

### Update Transaction Classification
**PUT** `/admin/transactions/{reference}/classification`

**Request:**
```json
{
  "newClassification": "Taxable-Business",
  "adminNotes": "Verified as business transaction"
}
```

## 5. Audit Logs

### Get Audit Logs
**GET** `/admin/audit-logs`

**Query Parameters:**
- `limit`: Number of logs (default: 100)
- `offset`: Pagination offset
- `userId`: Filter by user ID
- `action`: Filter by action type
- `fromDate`: Start date
- `toDate`: End date

## Error Handling

**Error Response Format:**
```json
{
  "error": "Description of the error",
  "code": "ERROR_CODE",
  "timestamp": "2025-09-12T10:30:00Z"
}
```

**Common Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `429`: Rate Limited
- `500`: Internal Server Error
