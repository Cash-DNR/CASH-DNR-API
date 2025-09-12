import express from 'express';
import { homeAffairsDB } from './db.js';

const router = express.Router();

// Verify citizen identity
router.get('/citizens/:idNumber', (req, res) => {
  try {
    const { idNumber } = req.params;
    const citizen = homeAffairsDB.citizens.find(c => c.idNumber === idNumber);

    if (!citizen) {
      return res.status(404).json({
        success: false,
        error: "Citizen not found"
      });
    }

    // Remove sensitive information before sending response
    const {
      photoUrl,
      verificationStatus,
      ...safeData
    } = citizen;

    res.json({
      success: true,
      citizen: safeData
    });
  } catch (error) {
    console.error("Identity verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during identity verification"
    });
  }
});

// Get citizen's marriage status
router.get('/citizens/:idNumber/marriage-status', (req, res) => {
  try {
    const { idNumber } = req.params;
    const citizen = homeAffairsDB.citizens.find(c => c.idNumber === idNumber);

    if (!citizen) {
      return res.status(404).json({
        success: false,
        error: "Citizen not found"
      });
    }

    res.json({
      success: true,
      idNumber: citizen.idNumber,
      maritalStatus: citizen.maritalStatus,
      spouseIdNumber: citizen.spouseIdNumber,
      verificationTimestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Marriage status verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during marriage status verification"
    });
  }
});

// Get supported verification types
router.get('/verification-types', (req, res) => {
  res.json({
    success: true,
    verificationTypes: homeAffairsDB.meta.supportedVerificationTypes
  });
});

export default router;
