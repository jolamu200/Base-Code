const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
    SESSION_ID: process.env.SESSION_ID || "",
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
    ANTI_CALL: process.env.ANTI_CALL || "false",
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY NOVA XMD 🔥*",
    ANTI_DELETE: process.env.ANTI_DELETE || "true",
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log",
    WELCOME: process.env.WELCOME || "true",
    ADMIN_EVENTS: process.env.ADMIN_EVENTS || "true",
    ANTI_LINK: process.env.ANTI_LINK || "true",
    MENTION_REPLY: process.env.MENTION_REPLY || "false",
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/mxb907.jpg",
    PREFIX: process.env.PREFIX || ".",
    BOT_NAME: process.env.BOT_NAME || "NOVA-XMD",
    STICKER_NAME: process.env.STICKER_NAME || "NOVA-XMD",
    CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
    CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "255767862457",
    OWNER_NAME: process.env.OWNER_NAME || "𝙽𝙾𝚅𝙰-𝚇𝙼𝙳",
    DESCRIPTION: process.env.DESCRIPTION || "*© POWERED NOVA TECH*",
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/mxb907.jpg",
    LIVE_MSG: process.env.LIVE_MSG || "> Powered by Nova Xmd",
    READ_MESSAGE: process.env.READ_MESSAGE || "false",
    AUTO_REACT: process.env.AUTO_REACT || "false",
    ANTI_BAD: process.env.ANTI_BAD || "true",
    MODE: process.env.MODE || "public",
    AUTO_STICKER: process.env.AUTO_STICKER || "false",
    AUTO_REPLY: process.env.AUTO_REPLY || "false",
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
    PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
    AUTO_TYPING: process.env.AUTO_TYPING || "true",
    READ_CMD: process.env.READ_CMD || "false",
    DEV: process.env.DEV || "255767862457",
    ANTI_VV: process.env.ANTI_VV || "true",
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
    AUTO_BIO: process.env.AUTO_BIO || "false",
    CHAT_BOT: process.env.CHAT_BOT || "false",
    CHAT_BOT_GROUPS: process.env.CHAT_BOT_GROUPS || "false",
    API_KEY: "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"
};
