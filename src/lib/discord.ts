
/**
 * Sends an error alert to Discord via Webhook.
 * Defined in .env.local as DISCORD_WEBHOOK_URL
 */
export async function sendErrorAlert(error: any, context: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('⚠️ DISCORD_WEBHOOK_URL is not set. Skipping crash report.');
    return;
  }

  try {
    const timestamp = new Date().toISOString();
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';

    // Discord Searchable/Highlightable Format
    const payload = {
      username: "Portfolio AI Monitor",
      avatar_url: "https://cdn-icons-png.flaticon.com/512/564/564619.png", // Generic Alert Icon
      embeds: [
        {
          title: `🚨 Service Error: ${context}`,
          color: 15548997, // Red
          fields: [
            {
              name: "Error Message",
              value: `\`\`\`${errorMessage.substring(0, 1000)}\`\`\``
            },
            {
              name: "Time",
              value: timestamp,
              inline: true
            },
            {
              name: "Environment",
              value: process.env.NODE_ENV || 'development',
              inline: true
            }
          ],
          footer: {
            text: "Timely GPT Bridge System"
          }
        }
      ]
    };

    // Fire and forget - don't await strictly if not needed, but here we await to ensure it sends
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

  } catch (discordError) {
    console.error('Failed to send Discord alert:', discordError);
  }
}
