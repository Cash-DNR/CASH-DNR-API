# Cash DNR API Endpoints

## Citizen Registration and Verification

### 1. Register a Citizen
```http
POST /api/register/citizen

Request:
{
  "idNumber": "9006155431081",
  "contactInfo": {
    "email": "john.smith@example.com"
  }
}

Response (201):
{
  "message": "Citizen registered successfully",
  "userId": "USR-xxx",
  "taxId": "xxx",
  "userInfo": {
    "fullName": "John Smith",
    "userType": "Individual",
    "status": "Active"
  }
}
```

### 2. Verify Citizen ID
```http
GET /api/citizens/9006155431081

Response (200):
{
  "idNumber": "9006155431081",
  "firstName": "John",
  "lastName": "Smith",
  "dateOfBirth": "1990-06-15",
  "gender": "Male",
  "nationality": "South African",
  ...
}
```

## Business Registration and Verification

### 1. Register a Business
```http
POST /api/register/business

Request:
{
  "businessRegNumber": "2023/123456/07",
  "contactInfo": {
    "email": "business@example.com"
  },
  "representativeIdNumber": "9006155431081"
}

Response (201):
{
  "message": "Business registered successfully",
  "userId": "USR-xxx",
  "taxId": "xxx",
  "businessInfo": {
    "registeredName": "Tech Solutions",
    "tradingName": "Tech Solutions",
    "userType": "Business",
    "status": "Active"
  }
}
```

### 2. Verify Business Registration
```http
GET /api/businesses/2023/123456/07

Response (200):
{
  "businessRegNumber": "2023/123456/07",
  "registeredName": "Tech Solutions",
  "tradingName": "Tech Solutions",
  "status": "Active",
  ...
}
```

## User Management

### 1. Get User Profile
```http
GET /api/users/{userId}

Response (200):
{
  "userId": "USR-xxx",
  "userType": "Individual",
  "taxId": "xxx",
  "status": "Active",
  "kycStatus": "Verified",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Smith",
    ...
  }
}
```

### 2. Update Contact Information
```http
PUT /api/users/{userId}/contact

Request:
{
  "phone": "+27 82 123 4567",
  "email": "new.email@example.com"
}

Response (200):
{
  "message": "Contact information updated successfully"
}
```

## Transaction Logging

### 1. Create Transaction
```http
POST /api/transactions

Request:
{
  "amount": 1000.00,
  "purpose": "Service Payment",
  "userId": "USR-xxx",
  "transactionType": "digital",
  "digitalReference": "PAY123",
  "receiverInfo": {
    "name": "Tech Solutions",
    "reference": "INV001"
  }
}

Response (201):
{
  "message": "Transaction logged successfully",
  "transaction": {
    "reference": "TXN-xxx",
    "amount": 1000.00,
    "purpose": "Service Payment",
    "taxClassification": "Taxable-Business",
    "timestamp": "2025-09-12T08:40:17.308Z",
    "status": "Completed"
  }
}
```

### 2. Get User's Transaction History
```http
GET /api/users/{userId}/transactions?limit=50&offset=0

Response (200):
{
  "transactions": [
    {
      "reference": "TXN-xxx",
      "amount": 1000.00,
      "purpose": "Service Payment",
      "taxClassification": "Taxable-Business",
      "timestamp": "2025-09-12T08:40:17.308Z",
      "status": "Completed"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "taxSummary": {
    "totalTransactions": 1,
    "taxableAmount": 1000.00,
    "nonTaxableAmount": 0,
    "reviewRequired": 0
  }
}
```

### 3. Get Transaction Details
```http
GET /api/transactions/{reference}

Response (200):
{
  "reference": "TXN-xxx",
  "userId": "USR-xxx",
  "userTaxId": "xxx",
  "amount": 1000.00,
  "purpose": "Service Payment",
  "transactionType": "digital",
  "taxClassification": "Taxable-Business",
  "timestamp": "2025-09-12T08:40:17.308Z",
  "status": "Completed"
}
```

## Tax Management

### 1. Get Tax Summary
```http
GET /api/users/{userId}/tax-summary?year=2025

Response (200):
{
  "taxYear": 2025,
  "taxId": "xxx",
  "userType": "Individual",
  "totalTransactions": 10,
  "totalAmount": 50000.00,
  "taxableAmount": 45000.00,
  "nonTaxableAmount": 5000.00,
  "reviewRequiredAmount": 0
}
```

### 2. Export Tax Data
```http
GET /api/users/{userId}/tax-export?year=2025&format=json

Response (200):
{
  "exportInfo": {
    "taxId": "xxx",
    "exportDate": "2025-09-12T08:40:17.308Z",
    "taxYear": 2025,
    "userType": "Individual",
    "totalTaxableTransactions": 8,
    "totalTaxableAmount": 45000.00
  },
  "taxpayerInfo": {
    "idNumber": "9006155431081",
    "fullName": "John Smith",
    "taxId": "xxx"
  },
  "transactions": [...]
}
```

## Test IDs Quick Reference

### Individual Test IDs
Male:
- 9006155431081 (John Smith)
- 9511087890080 (David Williams)
- 9204126789089 (Michael Davis)
- 9301058901086 (James Taylor)
- 9105289012088 (Robert Martin)

Female:
- 8503221234086 (Mary Johnson)
- 8807302345087 (Sarah Brown)
- 8709253456089 (Emma Wilson)
- 8908174567087 (Linda Anderson)
- 8612031111085 (Patricia White)

### Business Registration Numbers
- 2023/123456/07 (Tech Solutions)
- 2023/789123/07 (Green Energy)
- 2023/456789/07 (Digital Services)
