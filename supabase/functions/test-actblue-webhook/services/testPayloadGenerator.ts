
/**
 * Generates a test ActBlue webhook payload
 */
export function generateTestPayload(committeeName: string = "Test Committee") {
  return {
    donor: {
      firstname: "Test",
      lastname: "Donor",
      addr1: "123 Test St",
      city: "Test City",
      state: "CA",
      zip: "12345",
      country: "United States",
      email: "test@example.com",
      phone: "(555) 555-5555",
      isEligibleForExpressLane: false,
      employerData: {
        employer: "Test Employer",
        occupation: "Tester",
      }
    },
    contribution: {
      createdAt: new Date().toISOString(),
      orderNumber: `TEST-${Date.now()}`,
      contributionForm: "Test Form",
      refcodes: {},
      recurringPeriod: "weekly", // Set to weekly to test weekly recurring donations
      recurringDuration: 12,     // Set valid duration to ensure it's recognized as recurring
      isRecurring: true,         // Keep this for backward compatibility, but not used
      isPaypal: false,
      isMobile: false,
      isExpress: false,
      withExpressLane: false,
      expressSignup: false,
      status: "approved",
      amount: "10.00",
      paidAt: new Date().toISOString()
    },
    lineitems: [
      {
        sequence: 0,
        entityId: 12345,
        fecId: "TEST123",
        committeeName: committeeName,
        amount: "10.00",
        recurringAmount: null,
        paidAt: new Date().toISOString(),
        paymentId: Date.now(),
        lineitemId: Date.now() + 1
      }
    ]
  };
}
