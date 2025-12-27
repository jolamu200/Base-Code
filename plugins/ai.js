const { cmd } = require('../command');
const axios = require('axios');
const { sendButtons } = require('gifted-btns');

cmd({
    pattern: "gpt",
    alias: ["bot", "dj", "ai", "gpt4", "bing"],
    desc: "Chat with an GPT model",
    category: "menu",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for the GPT.\nExample: `.gpt Hello`");

        const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.message) {
            await react("❌");
            return reply("GPT failed to respond. Please try again later.");
        }

        const finalText = `🤖 *GPT Response:*\n\n${data.message}`;

        // ✅ Send with buttons
        await sendButtons(
            conn,
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
            { quoted: mek }
        );

        await react("✅");

    } catch (e) {
        console.error("Error in Gpt command:", e);
        await react("❌");
        reply("An error occurred while communicating with the GPT.");
    }
});
