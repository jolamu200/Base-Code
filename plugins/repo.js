const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');
const { sendButtons } = require("gifted-btns");

// Verified contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
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
  pattern: "repo",
  alias: ["sc", "script", "info"],
  desc: "Fetch GitHub repository information",
  react: "🎗️",
  category: "main",
  filename: __filename,
}, async (conn, mek, m, { from, reply }) => {

  const githubRepoURL = "https://github.com/novaxmd/NOVA-XMD";

  try {
    const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

    const repoData = await response.json();

    // TEXT BOX STYLE
    const textBox = `
╭━━━「 ${config.BOT_NAME || "NOVA XMD"} REPO 」━━━➤
│ 📦 Name   : ${repoData.name}
│ 👤 Owner : ${repoData.owner.login}
│ ⭐ Stars : ${repoData.stargazers_count}
│ 🍴 Forks : ${repoData.forks_count}
│ 🌐 URL   : ${repoData.html_url}
╰━━━━━━━━━━━━━━━━━━━━━━━➤
${config.DESCRIPTION || "Nova Xmd"}
`;

    // SEND TEXT + BUTTONS (ONE MESSAGE)
    await sendButtons(
      conn,
      from,
      {
        text: textBox.trim(),
        footer: "Nova-XMD Bot",
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
              display_text: "💻 Pair Code",
              url: "https://nova-pair-site.onrender.com/"
            })
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "🪀 Github Site",
              url: "https://github.com/novaxmd"
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
      { quoted: quotedContact }
    );

  } catch (error) {
    console.error("Repo command error:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
