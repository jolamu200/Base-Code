const { cmd } = require("../command");
const { igdl } = require("ruhend-scraper");
const config = require("../config");

// Set to prevent duplicate processing
const processedMessages = new Set();

// VERIFIED CONTACT (Popkids style)
const verifiedContact = {
    key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "Nova Xmd VERIFIED ✅",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Nova Xmd VERIFIED
ORG:Bmb tech bot;
TEL;type=CELL;type=VOICE;waid:${config.OWNER_NUMBER || "0000000000"}:+${config.OWNER_NUMBER || "0000000000"}
END:VCARD`
        }
    }
};

// Newsletter / forwarding context
const newsletterContext = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363382023564830@newsletter',
            newsletterName: 'Nova Xmd Updates',
            serverMessageId: 143
        }
    }
};

cmd({
    pattern: "instagram",
    alias: ["ig", "insta", "instalink"],
    desc: "Download Instagram video or image",
    category: "downloader",
    react: "📎",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (processedMessages.has(m.key.id)) return;
        processedMessages.add(m.key.id);
        setTimeout(() => processedMessages.delete(m.key.id), 5 * 60 * 1000);

        const text = q?.trim() || m.message?.conversation || m.message?.extendedTextMessage?.text;

        if (!text) {
            return await conn.sendMessage(from, {
                text: `📎 *Please provide a valid Instagram link to download video or image*`,
                ...newsletterContext
            }, { quoted: verifiedContact });
        }

        const instagramPatterns = [
            /https?:\/\/(?:www\.)?instagram\.com\//,
            /https?:\/\/(?:www\.)?instagr\.am\//,
            /https?:\/\/(?:www\.)?instagram\.com\/p\//,
            /https?:\/\/(?:www\.)?instagram\.com\/reel\//,
            /https?:\/\/(?:www\.)?instagram\.com\/tv\//
        ];

        const isValidUrl = instagramPatterns.some(pattern => pattern.test(text));

        if (!isValidUrl) {
            return await conn.sendMessage(from, {
                text: `❌ *Invalid link, this is not a valid Instagram post, reel, or TV link.*`,
                ...newsletterContext
            }, { quoted: verifiedContact });
        }

        // React while processing
        await conn.sendMessage(from, { react: { text: '🔄', key: m.key } });

        // Download media
        const downloadData = await igdl(text);

        if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
            return await conn.sendMessage(from, {
                text: `⚠️ *No media found for the provided link.*`,
                ...newsletterContext
            }, { quoted: verifiedContact });
        }

        const mediaData = downloadData.data;
        for (let i = 0; i < Math.min(20, mediaData.length); i++) {
            const media = mediaData[i];
            const mediaUrl = media.url;

            const isVideo = /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl) ||
                            media.type === 'video' ||
                            text.includes('/reel/') ||
                            text.includes('/tv/');

            const captionText = isVideo ? 
                `🎬 *Instagram Video Downloaded*  
Source: instagram.com  
Status: ✅ Completed` : 
                `🖼️ *Instagram Image Downloaded*  
Source: instagram.com  
Status: ✅ Completed`;

            if (isVideo) {
                await conn.sendMessage(from, {
                    video: { url: mediaUrl },
                    mimetype: "video/mp4",
                    caption: captionText,
                    ...newsletterContext
                }, { quoted: verifiedContact });
            } else {
                await conn.sendMessage(from, {
                    image: { url: mediaUrl },
                    caption: captionText,
                    ...newsletterContext
                }, { quoted: verifiedContact });
            }
        }

    } catch (error) {
        console.error('❌ Error in Instagram command:', error);
        await conn.sendMessage(from, {
            text: `⚠️ *An error occurred while processing the link.*`,
            ...newsletterContext
        }, { quoted: verifiedContact });
    }
});
