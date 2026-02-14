const axios = require("axios");
const Tesseract = require("tesseract.js");
const { cmd } = require("../command");
const { sleep } = require('../lib/functions');

// Quoted contact for context
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
  }
};

cmd({
  pattern: "scan",
  react: "🔍",
  alias: ["ocr", "readtext"],
  desc: "Scan and extract text from any image (auto-detect language).",
  category: "utility",
  use: ".scan (reply to image)",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    // Check if user replied to a media
    const quoted = mek.quoted ? mek.quoted : null;
    if (!quoted || !quoted.message || !quoted.message.imageMessage) {
      return reply("❌ Reply to an image you want to scan then type *scan*");
    }

    await reply("🔄 Scanning image, please wait...", { quoted: quotedContact });

    // Download image buffer
    const buffer = await quoted.download();

    // OCR process with auto-detect
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      "osd", // osd = automatic script detection
      {
        logger: m => console.log(m),
        // Optional: can detect multiple languages automatically
        // Pass lang: "osd" to enable auto script detection
      }
    );

    if (!text.trim()) {
      return reply("⚠️ No text found in the image.");
    }

    const caption = `📝 *Text found in the image:*\n\n${text}`;

    await conn.sendMessage(from, {
      text: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        quotedMessage: quoted.message
      }
    });

  } catch (err) {
    console.error("Scan Error:", err);
    await reply("❌ An error occurred while scanning the image. Please try again later.", { quoted: quotedContact });
  }
});
