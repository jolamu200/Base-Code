const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");

// ================= VERIFIED CONTACT =================
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard:
        "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
  }
};

// ================= AUTO AI PRIVATE & GROUP CHAT =================
cmd({ on: "body" }, async (client, message, chat, { from, body, isGroup, isCmd }) => {
  try {

    if (
      config.CHAT_BOT === "true" &&
      !isCmd &&
      !message.key.fromMe &&
      body
    ) {

      const text = body.toLowerCase().trim();

      // ===== SELF IDENTITY LOGIC =====
      const swahiliNameQuestions = [
        "unaitwa nani",
        "jina lako nani",
        "jina lako ni nani",
        "wewe ni nani"
      ];

      const englishNameQuestions = [
        "what is your name",
        "who are you",
        "your name",
        "tell me your name"
      ];

      // Kiswahili detection
      if (swahiliNameQuestions.some(q => text.includes(q))) {

        const replyBox = `
╭━━━〔 🤖 B.M.B TECH AI 〕━━━╮
┃
┃ Mimi ni *Bmb Tech AI*
┃ 🤝 Msaidizi wako nikusaidie nini
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

        return await client.sendMessage(from, {
          text: replyBox,
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
        }, { quoted: message });
      }

      // English detection
      if (englishNameQuestions.some(q => text.includes(q))) {

        const replyBox = `
╭━━━〔 🤖 B.M.B TECH AI 〕━━━╮
┃
┃ My name is *BMB Tech AI*
┃ 🚀 Intelligent assistant
┃ powered by B.M.B Tech.
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

        return await client.sendMessage(from, {
          text: replyBox,
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
        }, { quoted: message });
      }

      // ===== NORMAL AI FLOW =====
      await client.sendPresenceUpdate("composing", from);

      const apiUrl = `https://api.yupra.my.id/api/ai/copilot?text=${encodeURIComponent(body)}`;
      const response = await fetch(apiUrl);

      if (!response.ok)
        throw new Error(`API Error: ${response.status}`);

      const data = await response.json();

      if (data.status && data.result) {

        await client.sendMessage(from, {
          text: data.result,
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
        }, { quoted: message });

      } else {
        await client.sendMessage(from, {
          text: "⚠️ AI did not return a valid response."
        }, { quoted: message });
      }
    }

  } catch (error) {
    console.error("Chatbot Error:", error);
    await client.sendMessage(from, {
      text: "⚠️ Chatbot system error."
    }, { quoted: message });
  }
});

// ================= CHATBOT TOGGLE =================
cmd({
  pattern: "chatbot",
  alias: ["autoai", "aichat"],
  desc: "Toggle AI Chatbot",
  category: "owner",
  react: "🤖",
  filename: __filename,
  fromMe: true
},
async (client, message, m, { isOwner, from, args }) => {

  if (!isOwner) {
    return client.sendMessage(from, {
      text: "🚫 Owner only command!"
    }, { quoted: message });
  }

  const action = args[0]?.toLowerCase();

  // ================= CHATBOT ON =================
  if (action === "on") {

    config.CHAT_BOT = "true";

    const onBox = `
╭━━━〔 🤖 B.M.B AI ACTIVATED 〕━━━╮
┃
┃ ✅ Status  : ENABLED
┃ 📡 Mode    : Private & Group Auto-Reply
┃ ⚡ Engine  : AI Copilot Active
┃
┃ 💬 Bot will now reply
┃    to private messages and group chats.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

    return await client.sendMessage(from, {
      text: onBox,
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
    }, { quoted: message });
  }

  // ================= CHATBOT OFF =================
  if (action === "off") {

    config.CHAT_BOT = "false";

    const offBox = `
╭━━━〔 🔕 B.M.B AI DEACTIVATED 〕━━━╮
┃
┃ ❌ Status  : DISABLED
┃ 💤 Mode    : Standby
┃ 🔒 Replies : OFF
┃
┃ 🚫 Bot will NOT reply
┃    to any messages.
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

    return await client.sendMessage(from, {
      text: offBox,
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
    }, { quoted: message });
  }

  // ================= STATUS =================
  const statusBox = `
╭━━━〔 ⚙️ B.M.B AI STATUS 〕━━━╮
┃
┃ 🤖 Chatbot :
┃ ${config.CHAT_BOT === "true" ? "✅ ENABLED" : "❌ DISABLED"}
┃
┃ Mode: ${config.CHAT_BOT === "true" ? "Private & Group" : "Off"}
┃
┃ Usage:
┃ .chatbot on
┃ .chatbot off
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━╯
`.trim();

  await client.sendMessage(from, {
    text: statusBox,
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
  }, { quoted: message });

});
