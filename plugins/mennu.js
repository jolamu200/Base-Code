const config = require('../config');
const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { getPrefix } = require('../lib/prefix');

// Quoted Contact Message
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "NOVA XMD VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:NOVA XMD VERIFIED ✅
ORG:NOVA XMD;
TEL;type=CELL;type=VOICE;waid=${config.OWNER_NUMBER || '255767862457'}:+${config.OWNER_NUMBER || '255767862457'}
END:VCARD`
    }
  }
};

// Stylize text
function fancy(str) {
  const map = {
    a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ғ', g:'ɢ', h:'ʜ',
    i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ', o:'ᴏ',
    p:'ᴘ', q:'ǫ', r:'ʀ', s:'s', t:'ᴛ', u:'ᴜ', v:'ᴠ',
    w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ'
  };
  return str.toLowerCase().split('').map(x => map[x] || x).join('');
}

const normalize = (str) =>
  str.toLowerCase().replace(/\s+menu$/, '').trim();

const emojiByCategory = {
  ai: '🤖',
  anime: '🍥',
  download: '📥',
  fun: '🎮',
  group: '👥',
  info: '🧠',
  main: '🏠',
  music: '🎵',
  owner: '👑',
  search: '🔎',
  settings: '⚙️',
  sticker: '🌟',
  tools: '🛠️',
};

cmd({
  pattern: 'menu',
  alias: ['command'],
  desc: 'Show bot menu',
  category: 'menu',
  react: '🪀',
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  try {
    const prefix = getPrefix();
    const uptime = () => {
      let s = process.uptime();
      return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m ${Math.floor(s%60)}s`;
    };

    // ===== HEADER =====
    let menu = `
╭━━━® 🔁 ${config.OWNER_NAME || 'NOVA'} 🔁 ®━━━┈⊷
┃®│▸ User:       : ${config.OWNER_NAME || 'BMB'}
┃®│▸ ʙᴀɪʟᴇʏs:    : 𝐌𝐮𝐥𝐭𝐢 𝐃𝐞𝐯𝐢𝐜𝐞
┃®│▸ Type:       : 𝐍𝐨𝐝𝐞𝐣𝐬
┃®│▸ Platform:   : VPS
┃®│▸ Mode:       : [${config.MODE || 'PUBLIC'}]
┃®│▸ Prefix:     : [${prefix}]
┃®│▸ Version:    : 1.0.0
┃®│▸ command: ${commands.length}
╰━━━━━━━━━━━━━━━━┈⊷`;

    // Group commands by category
    const categories = {};
    for (const c of commands) {
      if (c.category && !c.dontAdd && c.pattern) {
        const cat = normalize(c.category);
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(c.pattern.split('|')[0]);
      }
    }

    // ===== CATEGORY SECTIONING =====
    for (const cat of Object.keys(categories).sort()) {
      const emoji = emojiByCategory[cat] || '🔥';
      menu += `\n\n━━━━━━━━━━━━\n║ ${fancy(cat)} ${emoji}\n━━━━━━━━━━━━`;
      for (const cmdName of categories[cat].sort()) {
        menu += `\n┃❍┃• ${cmdName}`;
      }
    }

    menu += `\n\n> powered by ${config.BOT_NAME || 'BMB'}`;

    // ===== SEND MENU WITH NEWSLETTER =====
    await conn.sendMessage(
      from,
      {
        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kiy0hl.jpg' },
        caption: menu,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.NEWSLETTER_JID || '120363382023564830@newsletter',
            newsletterName: 'NOVA XMD NEWS',
            serverMessageId: 143
          }
        }
      },
      { quoted: quotedContact }
    );

  } catch (e) {
    console.error(e);
    reply(`❌ Menu error: ${e.message}`);
  }
});
