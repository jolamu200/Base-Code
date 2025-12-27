const config = require('../config');
const { cmd } = require('../command');
const { sendButtons } = require('gifted-btns');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();

        // temp message
        await conn.sendMessage(from, {
            text: '*〘⏳ Checking bot speed... 〙*'
        }, { quoted: mek });

        const end = Date.now();
        const speed = end - start;

        let status = "Stable";
        if (speed > 1000) status = "Slow";
        else if (speed > 500) status = "Moderate";

        const statusEmojis = ['✅', '🟢', '✨', '📶', '🔋'];

        const stylishText = `
╭─❏ 『 𝘽𝙊𝙏 𝙎𝙏𝘼𝙏𝙐𝙎 』
│
├─⚡ Bot Name : ${config.BOT_NAME}
├─🚀 Speed    : ${speed} ms
├─📶 Status   : ${statusEmojis[Math.floor(Math.random() * statusEmojis.length)]} ${status}
├─🕐 Checked  : ${new Date().toLocaleTimeString()}
│
╰─❏ Powered by NOVA XMD 💻
        `.trim();

        // SEND TEXT + BUTTONS
        await sendButtons(
            conn,
            from,
            {
                text: stylishText,
                footer: "NOVA XMD BOT",
                buttons: [
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📦 View Repo",
                            url: "https://github.com/novaxmd/NOVA-XMD"
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

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`❌ Error:\n${e.message}`);
    }
});
