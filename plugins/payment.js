const { cmd } = require('../command');

// AIRTEL MONEY COMMAND
cmd({
  pattern: "tigopesa",
  react: '💰',
  alias: ["payment"],
  desc: "Displays payment details with your USD address.",
  category: "menu",
  use: ".tigopesa",
  filename: __filename
}, async (client, message, quotedMsg, { from }) => {
  try {
    const media = {
      url: "https://files.catbox.moe/lmqj3u.jpg"
    };

    await client.sendMessage(from, {
      image: media,
      caption: `╔✦『 *MIX BY YAS PAYMENT* 』✦╗
║💳 *tigo number:* \`0711782669\`
║💵 *screenshot needed*
║🔗 *Send your payments securely!*
╚═══════════════╝
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙾𝚅𝙰-𝚇𝙼𝙳`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "𝙱.𝙼.𝙱 𝙿𝙰𝚈𝙼𝙴𝙽𝚃 ✅"
        }
      }
    }, {
      quoted: quotedMsg
    });
  } catch (err) {
    console.error("Error in Airtel command:", err);
    await client.sendMessage(from, {
      text: "❌ An error occurred while fetching airtel details."
    }, {
      quoted: quotedMsg
    });
  }
});

// MPESA COMMAND
cmd({
  pattern: "mpesa",
  react: '🏦',
  alias: ["bank", "payment2"],
  desc: "Displays payment details.",
  category: "menu",
  use: ".mpesa",
  filename: __filename
}, async (client, message, quotedMsg, { from, reply }) => {
  try {
    const media = {
      url: 'https://files.catbox.moe/b2pgmz.jpg'
    };

    await client.sendMessage(from, {
      image: media,
      caption: `╔═✦『 *M-PESA PAYMENT* 』✦╗
║🏦 *Name:* \`mpesa\`
║👤 *Account Name:* \`sailas antimi\`
║💳 *M-pesa Number:* \`0767862457\`
║🔗 *Make payments securely!*
║🖼️ *screenshot needed*
╚═══════════════╝
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝙽𝙾𝚅𝙰-𝚇𝙼𝙳`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "𝙱.𝙼.𝙱 𝙿𝙰𝚈𝙼𝙴𝙽𝚃 ✅"
        }
      }
    }, {
      quoted: message
    });
  } catch (err) {
    console.error("Error in mpesa command:", err);
    reply("❌ An error occurred while fetching mpesa details.");
  }
});
