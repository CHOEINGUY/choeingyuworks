const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Manually fetching since we can't easily import TS function in JS script without compiling
async function runTest() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  console.log('🧪 Testing Discord Alert System');
  console.log('--------------------------------');
  console.log(`Webhook URL present: ${!!webhookUrl}`);

  if (!webhookUrl) {
    console.error('❌ Error: DISCORD_WEBHOOK_URL is missing in .env.local');
    process.exit(1);
  }

  const payload = {
    username: "Portfolio AI Monitor (TEST)",
    content: "This is a test alert from the Portfolio AI system. 🚨",
    embeds: [
      {
        title: "Test Alert",
        description: "If you see this, the alert system is working!",
        color: 5763719 // Green
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
        console.log('✅ Alert sent successfully!');
    } else {
        console.error(`❌ Failed to send alert: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.error(text);
    }

  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

runTest();
