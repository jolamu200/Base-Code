const { cmd } = require('../command');
const config = require('../config');

// ✅ VERIFIED CONTACT
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
  pattern: "setprefix",
  desc: "Update the bot's command prefix",
  category: "owner",
  react: "⚙️",
  filename: __filename
}, async (conn, m, mek, { from, reply, text, isOwner }) => {

  if (!isOwner) return reply("*❌ OWNER ONLY COMMAND*");

  if (!text) return reply("*⚠️ Please provide a new prefix*\nExample: .setprefix !");

  try {

    config.PREFIX = text;

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    const caption = `
╭━━━〔 🔧 B.M.B TECH PREFIX🔧 〕━━━╮
┃
┃ 🔁 Status     : Updated Successfully
┃ 🎯 New Prefix : [ ${text} ]
┃
┃ ⚡ All commands will now respond
┃    using: ${text}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

    await conn.sendMessage(from, {
      text: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        quotedMessage: quotedContact.message,
        participant: quotedContact.key.participant,
        remoteJid: quotedContact.key.remoteJid,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛",
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply("*❗ SYSTEM ERROR: Unable to modify prefix*");
  }
});
