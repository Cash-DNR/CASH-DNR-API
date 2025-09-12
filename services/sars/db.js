// Mock SARS Database
export const sarsDB = {
  taxpayers: [
    {
      idNumber: "9006155431081",
      taxNumber: "1990601554",
      taxDetails: {
        complianceStatus: "Non-compliant",
        lastVerificationDate: "2025-09-12",
        outstandingReturns: {
          VAT: ["2025-Q2", "2025-Q3"],
          PAYE: [],
          ITR: ["2024"],
          PIT: ["2024"]
        },
        lastSubmissions: {
          VAT: "2025-03-25",
          PAYE: "2025-09-01",
          ITR: "2023-11-30",
          PIT: "2023-11-30"
        },
        complianceIssues: [
          "Outstanding VAT returns",
          "Late ITR submission",
          "Overdue tax payment"
        ]
      }
    }
  ],
  meta: {
    apiVersion: "1.0.0",
    lastUpdated: "2025-09-12T08:00:00Z",
    environment: "test",
    supportedVerificationTypes: [
      "tax_verification",
      "vat_status",
      "tax_compliance",
      "returns_status"
    ]
  }
};
