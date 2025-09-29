import express from "express";
import cors from "cors";
import crypto from "crypto";
import homeAffairsRouter from './services/home-affairs/routes.js';
import sarsRouter from './services/sars/routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mount service APIs
app.use('/home-affairs', homeAffairsRouter);
app.use('/sars', sarsRouter);

// Rate limiting for API security
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

const rateLimit = (req, res, next) => {
  const clientId = req.ip;
  const now = Date.now();
  
  if (!rateLimitMap.has(clientId)) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  } else {
    const clientData = rateLimitMap.get(clientId);
    if (now > clientData.resetTime) {
      clientData.count = 1;
      clientData.resetTime = now + RATE_LIMIT_WINDOW;
    } else {
      clientData.count++;
      if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }
    }
  }
  next();
};

app.use(rateLimit);

// Load data from JSON files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Home Affairs database
const homeAffairsPath = path.join(__dirname, '..', 'mock_databases', 'home_affairs_db.json');
const sarsPath = path.join(__dirname, '..', 'mock_databases', 'sars_db.json');

const homeAffairsData = JSON.parse(fs.readFileSync(homeAffairsPath, 'utf8'));
const sarsData = JSON.parse(fs.readFileSync(sarsPath, 'utf8'));

let citizens = homeAffairsData.citizens;
let businesses = sarsData.taxpayers.businesses;

// In-memory storage (replace with database in production)
let registeredUsers = [];
let transactions = [];
let auditLogs = [];

// Utility functions
const generateTaxId = (userType, idOrRegNumber) => {
  const prefix = userType === "Individual" ? "TID" : "TBD";
  const hash = crypto.createHash('md5').update(idOrRegNumber).digest('hex');
  return `${prefix}-${hash.substring(0, 8).toUpperCase()}`;
};

const generateUserId = () => {
  return `USR-${crypto.randomUUID()}`;
};

const generateTransactionReference = () => {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

const logAudit = (action, userId, details) => {
  auditLogs.push({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    userId,
    details,
    ipAddress: "127.0.0.1" // In production, get from req.ip
  });
};

const classifyTransaction = (amount, purpose) => {
  // Basic tax classification rules
  const highValueThreshold = 25000; // R25,000
  const businessKeywords = ['invoice', 'payment', 'service', 'goods', 'contract', 'business'];
  
  if (amount > highValueThreshold) {
    return "Taxable-HighValue";
  }
  
  if (businessKeywords.some(keyword => purpose.toLowerCase().includes(keyword))) {
    return "Taxable-Business";
  }
  
  if (amount > 1000) {
    return "Review-Required";
  }
  
  return "Non-Taxable";
};

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

// === USER REGISTRATION API ===

// Register Individual Citizen
app.post("/api/register/citizen", (req, res) => {
  try {
    const { idNumber, contactInfo } = req.body;
    
    if (!idNumber) {
      return res.status(400).json({ error: "ID number is required" });
    }
    
    // Check if user already registered
    const existingUser = registeredUsers.find(u => u.idOrRegNumber === idNumber);
    if (existingUser) {
      return res.status(409).json({ 
        error: "User already registered", 
        userId: existingUser.userId 
      });
    }
    
    // Verify with Home Affairs
    const citizen = citizens.find(c => c.idNumber === idNumber);
    if (!citizen) {
      logAudit("REGISTRATION_FAILED", null, { idNumber, reason: "Not found in Home Affairs" });
      return res.status(404).json({ error: "ID number not found in Home Affairs database" });
    }
    
    if (citizen.deceasedStatus !== "Alive") {
      logAudit("REGISTRATION_FAILED", null, { idNumber, reason: "Deceased" });
      return res.status(400).json({ error: "Cannot register deceased individual" });
    }
    
    // Generate Tax ID if not exists
    const taxId = citizen.taxId || generateTaxId("Individual", idNumber);
    
    // Create user account
    const newUser = {
      userId: generateUserId(),
      userType: "Individual",
      idOrRegNumber: idNumber,
      taxId: taxId,
      personalInfo: {
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        fullName: citizen.fullName,
        dateOfBirth: citizen.dateOfBirth,
        gender: citizen.gender,
        nationality: citizen.nationality,
        maritalStatus: citizen.maritalStatus
      },
      contactInfo: contactInfo || citizen.contact,
      address: citizen.address,
      registrationDate: new Date().toISOString(),
      status: "Active",
      kycStatus: "Verified"
    };
    
    registeredUsers.push(newUser);
    
    logAudit("USER_REGISTERED", newUser.userId, { 
      userType: "Individual", 
      idNumber, 
      taxId 
    });
    
    res.status(201).json({
      message: "Citizen registered successfully",
      userId: newUser.userId,
      taxId: newUser.taxId,
      userInfo: {
        fullName: newUser.personalInfo.fullName,
        userType: newUser.userType,
        status: newUser.status
      }
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error during registration" });
  }
});

// Register Business Entity
app.post("/api/register/business", (req, res) => {
  try {
    const { businessRegNumber, contactInfo, representativeIdNumber } = req.body;
    
    if (!businessRegNumber || !representativeIdNumber) {
      return res.status(400).json({ 
        error: "Business registration number and representative ID number are required" 
      });
    }
    
    // Check if business already registered
    const existingUser = registeredUsers.find(u => u.idOrRegNumber === businessRegNumber);
    if (existingUser) {
      return res.status(409).json({ 
        error: "Business already registered", 
        userId: existingUser.userId 
      });
    }
    
    // Verify business with CIPC
    const business = businesses.find(b => b.businessRegNumber === businessRegNumber);
    if (!business) {
      logAudit("REGISTRATION_FAILED", null, { businessRegNumber, reason: "Not found in CIPC" });
      return res.status(404).json({ error: "Business registration number not found in CIPC database" });
    }
    
    if (business.status !== "Active") {
      logAudit("REGISTRATION_FAILED", null, { businessRegNumber, reason: "Inactive business" });
      return res.status(400).json({ error: "Cannot register inactive business entity" });
    }
    
    // Verify representative
    const representative = citizens.find(c => c.idNumber === representativeIdNumber);
    if (!representative) {
      return res.status(404).json({ error: "Representative ID number not found in Home Affairs database" });
    }
    
    // Check if representative is authorized (simplified - in production, check against business directors)
    const isAuthorized = business.directors.some(d => d.idNumber === representativeIdNumber);
    if (!isAuthorized) {
      return res.status(403).json({ error: "Representative not authorized for this business" });
    }
    
    // Generate Tax ID if not exists
    const taxId = business.taxId || generateTaxId("Business", businessRegNumber);
    
    // Create business user account
    const newUser = {
      userId: generateUserId(),
      userType: "Business",
      idOrRegNumber: businessRegNumber,
      taxId: taxId,
      businessInfo: {
        registeredName: business.registeredName,
        tradingName: business.tradingName,
        registrationDate: business.registrationDate,
        directors: business.directors
      },
      representative: {
        idNumber: representativeIdNumber,
        name: representative.fullName
      },
      contactInfo: contactInfo,
      address: business.address,
      registrationDate: new Date().toISOString(),
      status: "Active",
      kycStatus: "Verified"
    };
    
    registeredUsers.push(newUser);
    
    logAudit("BUSINESS_REGISTERED", newUser.userId, { 
      businessRegNumber, 
      representativeId: representativeIdNumber,
      taxId 
    });
    
    res.status(201).json({
      message: "Business registered successfully",
      userId: newUser.userId,
      taxId: newUser.taxId,
      businessInfo: {
        registeredName: newUser.businessInfo.registeredName,
        tradingName: newUser.businessInfo.tradingName,
        userType: newUser.userType,
        status: newUser.status
      }
    });
    
  } catch (error) {
    console.error("Business registration error:", error);
    res.status(500).json({ error: "Internal server error during business registration" });
  }
});
// === HOME AFFAIRS VERIFICATION API ===
app.get("/home-affairs/citizens/:idNumber", (req, res) => {
  const citizen = citizens.find(u => u.idNumber === req.params.idNumber);
  if (!citizen) {
    return res.status(404).json({ 
      success: false,
      error: "Citizen not found in Home Affairs database" 
    });
  }
  res.json({
    success: true,
    citizen: {
      ...citizen,
      deceasedStatus: citizen.isDeceased ? "Deceased" : "Alive"
    }
  });
});

// === CIPC BUSINESS VERIFICATION API ===
app.get("/api/businesses/:regNumber", (req, res) => {
  const biz = businesses.find(b => b.businessRegNumber === req.params.regNumber);
  if (!biz) {
    return res.status(404).json({ error: "Business not found in CIPC DB (mock)" });
  }
  res.json(biz);
});

// === USER MANAGEMENT API ===

// Get user profile
app.get("/api/users/:userId", (req, res) => {
  const user = registeredUsers.find(u => u.userId === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  res.json({
    userId: user.userId,
    userType: user.userType,
    taxId: user.taxId,
    status: user.status,
    kycStatus: user.kycStatus,
    registrationDate: user.registrationDate,
    ...(user.userType === "Individual" ? {
      personalInfo: user.personalInfo,
      contactInfo: user.contactInfo
    } : {
      businessInfo: user.businessInfo,
      representative: user.representative,
      contactInfo: user.contactInfo
    })
  });
});

// Update user contact information
app.put("/api/users/:userId/contact", (req, res) => {
  const user = registeredUsers.find(u => u.userId === req.params.userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  const { phone, email } = req.body;
  if (phone) user.contactInfo.phone = phone;
  if (email) user.contactInfo.email = email;
  
  logAudit("CONTACT_UPDATED", user.userId, { phone, email });
  
  res.json({ message: "Contact information updated successfully" });
});

// === TRANSACTION LOGGING API ===

// Create new transaction
app.post("/api/transactions", (req, res) => {
  try {
    const { 
      amount, 
      purpose, 
      userId, 
      transactionType = "manual", // manual, scan, digital
      cashNoteSerial, 
      digitalReference,
      receiverInfo,
      metadata = {}
    } = req.body;
    
    // Validate required fields
    if (!amount || !purpose || !userId) {
      return res.status(400).json({ 
        error: "Amount, purpose, and userId are required" 
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ error: "Amount must be positive" });
    }
    
    // Verify user exists
    const user = registeredUsers.find(u => u.userId === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check for duplicate references
    if (digitalReference) {
      const existingTxn = transactions.find(t => t.digitalReference === digitalReference);
      if (existingTxn) {
        return res.status(409).json({ 
          error: "Duplicate transaction reference", 
          existingTransaction: existingTxn.reference 
        });
      }
    }
    
    if (cashNoteSerial) {
      const existingTxn = transactions.find(t => t.cashNoteSerial === cashNoteSerial);
      if (existingTxn) {
        return res.status(409).json({ 
          error: "Cash note already logged", 
          existingTransaction: existingTxn.reference 
        });
      }
    }
    
    // Classify transaction for tax purposes
    const taxClassification = classifyTransaction(amount, purpose);
    
    // Create transaction record
    const transaction = {
      reference: generateTransactionReference(),
      userId: userId,
      userTaxId: user.taxId,
      amount: parseFloat(amount),
      purpose: purpose,
      transactionType: transactionType,
      taxClassification: taxClassification,
      timestamp: new Date().toISOString(),
      cashNoteSerial: cashNoteSerial || null,
      digitalReference: digitalReference || null,
      receiverInfo: receiverInfo || null,
      metadata: {
        ...metadata,
        userType: user.userType,
        ipAddress: "127.0.0.1" // In production, get from req.ip
      },
      status: "Completed",
      ownershipChain: [{
        userId: userId,
        timestamp: new Date().toISOString(),
        action: "transaction_logged"
      }]
    };
    
    transactions.push(transaction);
    
    logAudit("TRANSACTION_CREATED", userId, {
      reference: transaction.reference,
      amount: amount,
      taxClassification: taxClassification,
      transactionType: transactionType
    });
    
    res.status(201).json({
      message: "Transaction logged successfully",
      transaction: {
        reference: transaction.reference,
        amount: transaction.amount,
        purpose: transaction.purpose,
        taxClassification: transaction.taxClassification,
        timestamp: transaction.timestamp,
        status: transaction.status
      }
    });
    
  } catch (error) {
    console.error("Transaction creation error:", error);
    res.status(500).json({ error: "Internal server error during transaction creation" });
  }
});

// Get user's transaction history
app.get("/api/users/:userId/transactions", (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, taxClassification, fromDate, toDate } = req.query;
    
    // Verify user exists
    const user = registeredUsers.find(u => u.userId === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    let userTransactions = transactions.filter(t => t.userId === userId);
    
    // Apply filters
    if (taxClassification) {
      userTransactions = userTransactions.filter(t => t.taxClassification === taxClassification);
    }
    
    if (fromDate) {
      userTransactions = userTransactions.filter(t => new Date(t.timestamp) >= new Date(fromDate));
    }
    
    if (toDate) {
      userTransactions = userTransactions.filter(t => new Date(t.timestamp) <= new Date(toDate));
    }
    
    // Sort by timestamp (newest first)
    userTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Apply pagination
    const paginatedTransactions = userTransactions.slice(
      parseInt(offset), 
      parseInt(offset) + parseInt(limit)
    );
    
    // Calculate tax summary
    const taxSummary = {
      totalTransactions: userTransactions.length,
      taxableAmount: userTransactions
        .filter(t => t.taxClassification.includes("Taxable"))
        .reduce((sum, t) => sum + t.amount, 0),
      nonTaxableAmount: userTransactions
        .filter(t => t.taxClassification === "Non-Taxable")
        .reduce((sum, t) => sum + t.amount, 0),
      reviewRequired: userTransactions
        .filter(t => t.taxClassification === "Review-Required").length
    };
    
    res.json({
      transactions: paginatedTransactions.map(t => ({
        reference: t.reference,
        amount: t.amount,
        purpose: t.purpose,
        taxClassification: t.taxClassification,
        timestamp: t.timestamp,
        transactionType: t.transactionType,
        status: t.status
      })),
      pagination: {
        total: userTransactions.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < userTransactions.length
      },
      taxSummary: taxSummary
    });
    
  } catch (error) {
    console.error("Transaction history error:", error);
    res.status(500).json({ error: "Internal server error retrieving transactions" });
  }
});

// Get specific transaction details
app.get("/api/transactions/:reference", (req, res) => {
  const transaction = transactions.find(t => t.reference === req.params.reference);
  if (!transaction) {
    return res.status(404).json({ error: "Transaction not found" });
  }
  
  res.json(transaction);
});

// Update transaction ownership (for transfers)
app.post("/api/transactions/:reference/transfer", (req, res) => {
  try {
    const { reference } = req.params;
    const { newOwnerId, transferReason } = req.body;
    
    if (!newOwnerId || !transferReason) {
      return res.status(400).json({ error: "New owner ID and transfer reason are required" });
    }
    
    const transaction = transactions.find(t => t.reference === reference);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    const newOwner = registeredUsers.find(u => u.userId === newOwnerId);
    if (!newOwner) {
      return res.status(404).json({ error: "New owner not found" });
    }
    
    // Add to ownership chain
    transaction.ownershipChain.push({
      userId: newOwnerId,
      timestamp: new Date().toISOString(),
      action: "ownership_transfer",
      reason: transferReason,
      previousOwner: transaction.userId
    });
    
    // Update current owner
    transaction.userId = newOwnerId;
    transaction.userTaxId = newOwner.taxId;
    
    logAudit("OWNERSHIP_TRANSFERRED", newOwnerId, {
      transactionReference: reference,
      transferReason: transferReason
    });
    
    res.json({
      message: "Ownership transferred successfully",
      newOwner: newOwnerId,
      ownershipChain: transaction.ownershipChain
    });
    
  } catch (error) {
    console.error("Ownership transfer error:", error);
    res.status(500).json({ error: "Internal server error during ownership transfer" });
  }
});

// === TAX MANAGEMENT API ===

// Get tax summary for a user
app.get("/api/users/:userId/tax-summary", (req, res) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear() } = req.query;
    
    const user = registeredUsers.find(u => u.userId === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Filter transactions by year
    const yearTransactions = transactions.filter(t => {
      return t.userId === userId && 
             new Date(t.timestamp).getFullYear() === parseInt(year);
    });
    
    const taxSummary = {
      taxYear: parseInt(year),
      taxId: user.taxId,
      userType: user.userType,
      totalTransactions: yearTransactions.length,
      totalAmount: yearTransactions.reduce((sum, t) => sum + t.amount, 0),
      taxableTransactions: yearTransactions.filter(t => t.taxClassification.includes("Taxable")),
      nonTaxableTransactions: yearTransactions.filter(t => t.taxClassification === "Non-Taxable"),
      reviewRequiredTransactions: yearTransactions.filter(t => t.taxClassification === "Review-Required"),
      generatedAt: new Date().toISOString()
    };
    
    // Calculate totals by category
    taxSummary.taxableAmount = taxSummary.taxableTransactions.reduce((sum, t) => sum + t.amount, 0);
    taxSummary.nonTaxableAmount = taxSummary.nonTaxableTransactions.reduce((sum, t) => sum + t.amount, 0);
    taxSummary.reviewRequiredAmount = taxSummary.reviewRequiredTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    logAudit("TAX_SUMMARY_GENERATED", userId, { taxYear: year });
    
    res.json(taxSummary);
    
  } catch (error) {
    console.error("Tax summary error:", error);
    res.status(500).json({ error: "Internal server error generating tax summary" });
  }
});

// Export tax data for SARS submission
app.get("/api/users/:userId/tax-export", (req, res) => {
  try {
    const { userId } = req.params;
    const { year = new Date().getFullYear(), format = "json" } = req.query;
    
    const user = registeredUsers.find(u => u.userId === userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const yearTransactions = transactions.filter(t => {
      return t.userId === userId && 
             new Date(t.timestamp).getFullYear() === parseInt(year) &&
             t.taxClassification.includes("Taxable");
    });
    
    const taxExport = {
      exportInfo: {
        taxId: user.taxId,
        exportDate: new Date().toISOString(),
        taxYear: parseInt(year),
        userType: user.userType,
        totalTaxableTransactions: yearTransactions.length,
        totalTaxableAmount: yearTransactions.reduce((sum, t) => sum + t.amount, 0)
      },
      taxpayerInfo: user.userType === "Individual" ? {
        idNumber: user.idOrRegNumber,
        fullName: user.personalInfo.fullName,
        taxId: user.taxId
      } : {
        businessRegNumber: user.idOrRegNumber,
        registeredName: user.businessInfo.registeredName,
        taxId: user.taxId
      },
      transactions: yearTransactions.map(t => ({
        reference: t.reference,
        date: t.timestamp,
        amount: t.amount,
        description: t.purpose,
        classification: t.taxClassification,
        transactionType: t.transactionType
      }))
    };
    
    logAudit("TAX_DATA_EXPORTED", userId, { 
      taxYear: year, 
      transactionCount: yearTransactions.length 
    });
    
    if (format === "csv") {
      // Simple CSV format for SARS compatibility
      const csvHeader = "Reference,Date,Amount,Description,Classification,Type\n";
      const csvData = taxExport.transactions.map(t => 
        `${t.reference},${t.date},${t.amount},"${t.description}",${t.classification},${t.transactionType}`
      ).join("\n");
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="tax-export-${userId}-${year}.csv"`);
      res.send(csvHeader + csvData);
    } else {
      res.json(taxExport);
    }
    
  } catch (error) {
    console.error("Tax export error:", error);
    res.status(500).json({ error: "Internal server error during tax export" });
  }
});

// === ADMIN DASHBOARD API ===

// Get system statistics
app.get("/api/admin/statistics", (req, res) => {
  try {
    const stats = {
      users: {
        total: registeredUsers.length,
        individuals: registeredUsers.filter(u => u.userType === "Individual").length,
        businesses: registeredUsers.filter(u => u.userType === "Business").length,
        active: registeredUsers.filter(u => u.status === "Active").length
      },
      transactions: {
        total: transactions.length,
        totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
        taxable: transactions.filter(t => t.taxClassification.includes("Taxable")).length,
        reviewRequired: transactions.filter(t => t.taxClassification === "Review-Required").length,
        today: transactions.filter(t => {
          const today = new Date().toDateString();
          return new Date(t.timestamp).toDateString() === today;
        }).length
      },
      system: {
        auditLogs: auditLogs.length,
        lastActivity: auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].timestamp : null,
        uptime: process.uptime()
      }
    };
    
    res.json(stats);
    
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({ error: "Internal server error retrieving statistics" });
  }
});

// Get flagged transactions for review
app.get("/api/admin/flagged-transactions", (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const flaggedTransactions = transactions.filter(t => 
      t.taxClassification === "Review-Required" || 
      t.taxClassification === "Taxable-HighValue"
    );
    
    // Sort by amount (highest first)
    flaggedTransactions.sort((a, b) => b.amount - a.amount);
    
    const paginatedResults = flaggedTransactions.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      flaggedTransactions: paginatedResults.map(t => ({
        reference: t.reference,
        userId: t.userId,
        amount: t.amount,
        purpose: t.purpose,
        taxClassification: t.taxClassification,
        timestamp: t.timestamp,
        userType: t.metadata.userType
      })),
      pagination: {
        total: flaggedTransactions.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    console.error("Flagged transactions error:", error);
    res.status(500).json({ error: "Internal server error retrieving flagged transactions" });
  }
});

// Update transaction classification (admin only)
app.put("/api/admin/transactions/:reference/classification", (req, res) => {
  try {
    const { reference } = req.params;
    const { newClassification, adminNotes } = req.body;
    
    const validClassifications = [
      "Taxable-Business", "Taxable-HighValue", "Non-Taxable", "Review-Required"
    ];
    
    if (!validClassifications.includes(newClassification)) {
      return res.status(400).json({ error: "Invalid tax classification" });
    }
    
    const transaction = transactions.find(t => t.reference === reference);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    const oldClassification = transaction.taxClassification;
    transaction.taxClassification = newClassification;
    transaction.adminReview = {
      reviewedAt: new Date().toISOString(),
      adminNotes: adminNotes || "",
      previousClassification: oldClassification
    };
    
    logAudit("CLASSIFICATION_UPDATED", "ADMIN", {
      transactionReference: reference,
      oldClassification: oldClassification,
      newClassification: newClassification,
      adminNotes: adminNotes
    });
    
    res.json({
      message: "Transaction classification updated",
      reference: reference,
      newClassification: newClassification
    });
    
  } catch (error) {
    console.error("Classification update error:", error);
    res.status(500).json({ error: "Internal server error updating classification" });
  }
});

// === AUDIT LOG API ===

// Get audit logs
app.get("/api/admin/audit-logs", (req, res) => {
  try {
    const { limit = 100, offset = 0, userId, action, fromDate, toDate } = req.query;
    
    let filteredLogs = [...auditLogs];
    
    // Apply filters
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }
    
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }
    
    if (fromDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(fromDate));
    }
    
    if (toDate) {
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(toDate));
    }
    
    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const paginatedLogs = filteredLogs.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );
    
    res.json({
      auditLogs: paginatedLogs,
      pagination: {
        total: filteredLogs.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
    
  } catch (error) {
    console.error("Audit logs error:", error);
    res.status(500).json({ error: "Internal server error retrieving audit logs" });
  }
});

// === TAX VERIFICATION API ===
app.get("/api/citizens/:idNumber/tax-verification", (req, res) => {
  try {
    const { idNumber } = req.params;
    const taxpayer = sarsData.taxpayers.individuals.find(t => t.idNumber === idNumber);

    if (!taxpayer) {
      return res.status(404).json({
        success: false,
        error: "Taxpayer not found"
      });
    }

    const taxVerificationResult = {
      success: true,
      idNumber: taxpayer.idNumber,
      isTaxRegistered: true,
      taxNumber: taxpayer.taxNumber,
      verificationTimestamp: new Date().toISOString(),
      validationSource: "Mock SARS DB",
      complianceDetails: {
        status: taxpayer.complianceStatus,
        lastVerified: new Date().toISOString(),
        outstandingReturns: taxpayer.outstandingReturns,
        lastSubmissions: taxpayer.lastSubmissions,
        complianceIssues: [],
        nextFilingDue: calculateNextFilingDue(taxpayer.lastSubmissions)
      }
    };

    res.json(taxVerificationResult);
  } catch (error) {
    console.error("Tax verification error:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal server error during tax verification" 
    });
  }
});

// === HEALTH CHECK API ===
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      homeAffairs: "mock",
      cipc: "mock",
      database: "in-memory"
    }
  });
});

app.listen(4000, () => {
  console.log("✅ Mock Home Affairs API running at http://localhost:4000");
});
