import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Home Affairs database from JSON file
let homeAffairsPath = path.join(__dirname, '..', '..', 'mock_databases', 'home_affairs_db.json');

// Fallback path for deployment
if (!fs.existsSync(homeAffairsPath)) {
  homeAffairsPath = path.join(__dirname, 'mock_databases', 'home_affairs_db.json');
}

let homeAffairsData;
try {
  homeAffairsData = JSON.parse(fs.readFileSync(homeAffairsPath, 'utf8'));
  console.log('✅ Home Affairs DB loaded from:', homeAffairsPath);
} catch (error) {
  console.error('❌ Error loading Home Affairs database:', error.message);
  // Fallback to empty data
  homeAffairsData = { citizens: [] };
}

export const homeAffairsDB = {
  citizens: homeAffairsData.citizens || [],
  meta: {
    apiVersion: "1.0.0",
    lastUpdated: new Date().toISOString(),
    environment: "test",
    supportedVerificationTypes: [
      "id_verification",
      "marriage_status", 
      "deceased_status",
      "address_verification",
      "photo_verification"
    ]
  }
};
