import express from 'express';
import { homeAffairsDB } from './mock-home-affairs-db.js';

const router = express.Router();

// Simulate network delay and occasional errors for realistic testing
const simulateRealWorldConditions = (req, res, next) => {
  // Simulate random network delay (100-1000ms)
  const delay = Math.floor(Math.random() * 900) + 100;
  
  // Simulate occasional server errors (1% chance)
  const shouldError = Math.random() < 0.01;
  
  if (shouldError) {
    setTimeout(() => {
      res.status(500).json({
        error: "Home Affairs systems are currently experiencing technical difficulties",
        errorCode: "HA500",
        timestamp: new Date().toISOString()
      });
    }, delay);
    return;
  }
  
  setTimeout(next, delay);
};

// Add realistic headers to responses
const addHomeAffairsHeaders = (req, res, next) => {
  res.set({
    'X-DHA-API-Version': '1.0.0',
    'X-DHA-Request-ID': `DHA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    'X-DHA-Rate-Limit': '100',
    'X-DHA-Rate-Remaining': '99'
  });
  next();
};

// Middleware to check API key
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-dha-api-key'];
  
  if (!apiKey || apiKey !== 'test_dha_key') {
    return res.status(401).json({
      error: "Invalid or missing API key",
      errorCode: "HA401",
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

router.use(simulateRealWorldConditions);
router.use(addHomeAffairsHeaders);
router.use(checkApiKey);

// === HOME AFFAIRS API ENDPOINTS ===

// 1. Verify ID Number
router.get('/citizens/:idNumber/verify', (req, res) => {
  const citizen = homeAffairsDB.citizens.find(c => c.idNumber === req.params.idNumber);
  
  if (!citizen) {
    return res.status(404).json({
      error: "ID number not found",
      errorCode: "HA404",
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    verificationResult: {
      verified: true,
      idNumber: citizen.idNumber,
      firstName: citizen.firstName,
      lastName: citizen.lastName,
      dateOfBirth: citizen.dateOfBirth,
      gender: citizen.gender,
      citizenshipStatus: citizen.citizenshipStatus,
      deceasedStatus: citizen.deceasedStatus,
      verificationId: `VER${Date.now()}`,
      timestamp: new Date().toISOString()
    }
  });
});

// 2. Get Full Citizen Details
router.get('/citizens/:idNumber', (req, res) => {
  const citizen = homeAffairsDB.citizens.find(c => c.idNumber === req.params.idNumber);
  
  if (!citizen) {
    return res.status(404).json({
      error: "ID number not found",
      errorCode: "HA404",
      timestamp: new Date().toISOString()
    });
  }
  
  res.json(citizen);
});

// 3. Verify Marriage Status
router.get('/citizens/:idNumber/marriage-status', (req, res) => {
  const citizen = homeAffairsDB.citizens.find(c => c.idNumber === req.params.idNumber);
  
  if (!citizen) {
    return res.status(404).json({
      error: "ID number not found",
      errorCode: "HA404",
      timestamp: new Date().toISOString()
    });
  }
  
  let spouse = null;
  if (citizen.spouseIdNumber) {
    spouse = homeAffairsDB.citizens.find(c => c.idNumber === citizen.spouseIdNumber);
  }
  
  res.json({
    idNumber: citizen.idNumber,
    maritalStatus: citizen.maritalStatus,
    marriageDate: citizen.marriageDate,
    spouse: spouse ? {
      idNumber: spouse.idNumber,
      fullName: spouse.fullName,
      dateOfBirth: spouse.dateOfBirth
    } : null,
    verificationId: `MAR${Date.now()}`,
    timestamp: new Date().toISOString()
  });
});

// 4. Verify Address
router.get('/citizens/:idNumber/address', (req, res) => {
  const citizen = homeAffairsDB.citizens.find(c => c.idNumber === req.params.idNumber);
  
  if (!citizen) {
    return res.status(404).json({
      error: "ID number not found",
      errorCode: "HA404",
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    idNumber: citizen.idNumber,
    addresses: citizen.address,
    verificationId: `ADR${Date.now()}`,
    timestamp: new Date().toISOString()
  });
});

// 5. Get Citizen Photo
router.get('/citizens/:idNumber/photo', (req, res) => {
  const citizen = homeAffairsDB.citizens.find(c => c.idNumber === req.params.idNumber);
  
  if (!citizen) {
    return res.status(404).json({
      error: "ID number not found",
      errorCode: "HA404",
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    idNumber: citizen.idNumber,
    photoUrl: citizen.photoUrl,
    photoLastUpdated: "2025-01-01",
    verificationId: `PHO${Date.now()}`,
    timestamp: new Date().toISOString()
  });
});

// 6. Verify Tax Number
router.get('/citizens/:idNumber/tax-verification', (req, res) => {
  const citizen = homeAffairsDB.citizens.find(c => c.idNumber === req.params.idNumber);
  
  if (!citizen) {
    return res.status(404).json({
      error: "ID number not found",
      errorCode: "HA404",
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    verificationResult: {
      verified: true,
      idNumber: citizen.idNumber,
      taxNumber: citizen.taxNumber,
      fullName: citizen.fullName,
      taxStatus: "Active",
      verificationId: `TAX${Date.now()}`,
      timestamp: new Date().toISOString()
    }
  });
});

// 7. API Status Check
router.get('/status', (req, res) => {
  res.json({
    status: "operational",
    version: homeAffairsDB.meta.apiVersion,
    environment: homeAffairsDB.meta.environment,
    lastUpdated: homeAffairsDB.meta.lastUpdated,
    supportedVerificationTypes: homeAffairsDB.meta.supportedVerificationTypes,
    timestamp: new Date().toISOString()
  });
});

export default router;
