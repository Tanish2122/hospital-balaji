async function testWhatsAppAPI() {
  const testPayload = {
    to: "917276229049@c.us", // Test number from route.ts
    message: "Test message from Balaji Hospital Web App Verification System."
  };

  console.log("Testing WhatsApp API Gateway at http://localhost:3001...");
  
  try {
    const response = await fetch("http://localhost:3001/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();
    console.log("API Response:", result);
    
    if (result.success) {
      console.log("✓ WhatsApp API Gateway is working!");
    } else {
      console.log("✗ API returned failure:", result.error);
    }
  } catch (error) {
    console.error("✗ Failed to connect to WhatsApp API Gateway. Is the bot running?");
    console.error("Error details:", (error as Error).message);
  }
}

testWhatsAppAPI();
