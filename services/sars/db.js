import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load SARS database from JSON file
let sarsPath = path.join(__dirname, '..', '..', 'mock_databases', 'sars_db.json');

// Fallback path for deployment
if (!fs.existsSync(sarsPath)) {
  sarsPath = path.join(__dirname, 'mock_databases', 'sars_db.json');
}

let sarsData;
try {
  sarsData = JSON.parse(fs.readFileSync(sarsPath, 'utf8'));
  console.log('✅ SARS DB loaded from:', sarsPath);
} catch (error) {
  console.error('❌ Error loading SARS database:', error.message);
  // Fallback to empty data
  sarsData = { taxpayers: { individuals: [], businesses: [] } };
}

export const sarsDB = {
  taxpayers: sarsData.taxpayers.individuals || [],
  businesses: sarsData.taxpayers.businesses || [],
  meta: {
    apiVersion: "1.0.0",
    lastUpdated: new Date().toISOString(),
    environment: "test",
    supportedVerificationTypes: [
      "tax_verification",
      "vat_status", 
      "tax_compliance",
      "returns_status"
    ]
  }
};
