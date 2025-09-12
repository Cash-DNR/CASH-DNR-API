import express from 'express';
import { sarsDB } from './db.js';

const router = express.Router();

// Tax verification endpoint
router.get('/taxpayers/:idNumber/verification', (req, res) => {
  try {
    const { idNumber } = req.params;
    const taxpayer = sarsDB.taxpayers.find(t => t.idNumber === idNumber);

    if (!taxpayer) {
      return res.json({
        success: true,
        idNumber,
        isTaxRegistered: false,
        taxNumber: null,
        status: "Not Registered",
        verificationTimestamp: new Date().toISOString(),
        validationSource: "Mock SARS DB"
      });
    }

    res.json({
      success: true,
      idNumber: taxpayer.idNumber,
      isTaxRegistered: true,
      taxNumber: taxpayer.taxNumber,
      verificationTimestamp: new Date().toISOString(),
      validationSource: "Mock SARS DB",
      complianceDetails: {
        status: taxpayer.taxDetails.complianceStatus,
        lastVerified: taxpayer.taxDetails.lastVerificationDate,
        outstandingReturns: taxpayer.taxDetails.outstandingReturns,
        lastSubmissions: taxpayer.taxDetails.lastSubmissions,
        complianceIssues: taxpayer.taxDetails.complianceIssues,
        nextFilingDue: calculateNextFilingDue(taxpayer.taxDetails.lastSubmissions)
      }
    });
  } catch (error) {
    console.error("Tax verification error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error during tax verification"
    });
  }
});

// Helper function to calculate next filing due dates
function calculateNextFilingDue(lastSubmissions) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return {
    VAT: lastSubmissions.VAT === "N/A" ? null : {
      period: `${currentYear}-Q${Math.floor((currentMonth - 1) / 3) + 1}`,
      dueDate: `${currentYear}-${String(Math.floor((currentMonth - 1) / 3) * 3 + 3).padStart(2, '0')}-25`
    },
    PAYE: lastSubmissions.PAYE === "N/A" ? null : {
      period: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
      dueDate: `${currentYear}-${String(currentMonth).padStart(2, '0')}-07`
    },
    ITR: {
      period: String(currentYear),
      dueDate: `${currentYear}-11-30`
    },
    PIT: {
      period: String(currentYear),
      dueDate: `${currentYear}-11-30`
    }
  };
}

export default router;
