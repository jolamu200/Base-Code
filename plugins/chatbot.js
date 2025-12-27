const { cmd } = require("../command");
const config = require("../config");
const fetch = require("node-fetch");
const { sendButtons } = require("gifted-btns");

/**
 * ===============================
 * 🤖 AUTO AI CHATBOT (PRIVATE)
 * ===============================
 */
cmd({ on: "body" }, async (client, message, chat, { from, body, isGroup, isCmd }) => {
  try {
    if (
      config.CHAT_BOT === "true" &&
      !isCmd &&
      !isGroup &&
      !message.key.fromMe &&
      body
    ) {
      await client.sendPresenceUpdate("composing", from);

      // 👇 Custom logic: Respond if user asks "Who are you?" or "Unaitwa nani?"
      let finalText = "";

      const lowerBody = body.toLowerCase();
      if (
        lowerBody.includes("who are you") ||
        lowerBody.includes("what is your name") ||
        lowerBody.includes("unaitwa nani")
      ) {
        if (lowerBody.includes("unaitwa nani")) {
          finalText = "Naitwa Nova Xmd, muundaji wa Nova Xmd ni Bmb Tech 🇹🇿";
        } else {
          finalText = "My name is Nova Xmd, creator of Nova Xmd is Bmb Tech 🌍";
        }
      } else {
        const apiKey = "";
        const apiUrl =
          "https://apis.davidcyriltech.my.id/ai/chatbot?query=" +
          encodeURIComponent(body) +
          "&apikey=" +
          apiKey;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === 200 || data.success) {
          finalText = data.result;
        } else {
          finalText = "Sorry, I could not process your request.";
        }
      }

      await sendButtons(
        client,
        from,
        {
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
        },
        { quoted: message }
      );
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
cmd(
  {
    pattern: "chatbot",
    alias: ["autoai", "aichat"],
    desc: "Toggle Auto AI Chatbot",
    category: "owner",
    react: "🤖",
    filename: __filename,
    fromMe: true
  },
  async (client, message, m, { isOwner, from, sender, args }) => {
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
        statusText =
          "📌 Status: " +
          (config.CHAT_BOT === "true" ? "✅ ENABLED" : "❌ DISABLED");
        extra = "Use: chatbot on / chatbot off";
      }

      const caption = `${statusText}\n${extra}\n\n_Nova-Xmd_`;

      await sendButtons(
        client,
        from,
        {
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
        },
        { quoted: message }
      );

      await client.sendMessage(from, {
        react: { text: reaction, key: message.key }
      });
    } catch (error) {
      console.error("❌ Chatbot toggle error:", error);
    }
  }
);
