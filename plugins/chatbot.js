require("dotenv").config(); // in load API key from .env
const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");
const { sendButtons } = require("gifted-btns");

const API_KEY = process.env.OPENAI_API_KEY; // API key from .env
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * ===============================
 * ⚡ CHATBOT AUTO REPLY
 * ===============================
 */
cmd({ on: "body" }, async (client, message, chat, { from, body, isGroup, isCmd }) => {
  try {
    if (config.CHAT_BOT === "true" && !isCmd && !isGroup && !message.key.fromMe && body) {
      await client.sendPresenceUpdate("composing", from);

      let finalText = "";
      const lowerBody = body.toLowerCase();

      // Simple replies for basic questions
      if (
        lowerBody.includes("who are you") ||
        lowerBody.includes("what is your name") ||
        lowerBody.includes("unaitwa nani")
      ) {
        finalText = lowerBody.includes("unaitwa nani")
          ? "Naitwa Nova Xmd, muundaji wa Nova Xmd ni Bmb Tech 🇹🇿"
          : "My name is Nova Xmd, creator of Nova Xmd is Bmb Tech 🌍";
      } else {
        // AI response using API
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
            "HTTP-Referer": "https://whatsapp.com",
            "X-Title": "Nova Xmd Bot"
          },
          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: body }]
          })
        });

        const data = await response.json();
        finalText = data.choices?.[0]?.message?.content || "Sorry, I could not process your request.";
      }

      // Send buttons with response
      await sendButtons(client, from, {
        title: "",
        text: finalText,
        footer: "",
        buttons: [
          {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: "📋 Copy Reply",
              copy_code: finalText
            })
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "📢 View Channel",
              url: "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z"
            })
          }
        ]
      }, { quoted: message });
    }
  } catch (error) {
    console.error("❌ Chatbot Error:", error);
  }
});

/**
 * ===============================
 * ⚙️ CHATBOT TOGGLE COMMAND
 * ===============================
 */
cmd({
  pattern: "chatbot",
  alias: ["autoai", "aichat"],
  desc: "Toggle Auto AI Chatbot",
  category: "owner",
  react: "🤖",
  filename: __filename,
  fromMe: true
}, async (client, message, m, { isOwner, from, sender, args }) => {
  try {
    if (!isOwner) {
      return client.sendMessage(
        from,
        { text: "🚫 *Owner-only command!*", mentions: [sender] },
        { quoted: message }
      );
    }

    const action = args[0]?.toLowerCase() || "status";
    let statusText = "";
    let extra = "";
    let reaction = "🤖";

    if (action === "on") {
      config.CHAT_BOT = "true";
      statusText = "✅ AI Chatbot *ENABLED*";
      extra = "Bot will auto-reply in private chats 💬";
      reaction = "✅";
    } else if (action === "off") {
      config.CHAT_BOT = "false";
      statusText = "❌ AI Chatbot *DISABLED*";
      extra = "Auto replies are turned off 🔕";
      reaction = "❌";
    } else {
      statusText = "📌 Status: " + (config.CHAT_BOT === "true" ? "✅ ENABLED" : "❌ DISABLED");
      extra = "Use: chatbot on / chatbot off";
    }

    const caption = `${statusText}\n${extra}\n\n_Nova-Xmd_`;

    await sendButtons(client, from, {
      title: "",
      text: caption,
      footer: "Nova XMD 🤖",
      buttons: [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 Copy Status",
            copy_code: caption
          })
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "📢 View Channel",
            url: "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z"
          })
        }
      ]
    }, { quoted: message });

    await client.sendMessage(from, { react: { text: reaction, key: message.key } });
  } catch (error) {
    console.error("❌ Chatbot toggle error:", error);
  }
});
