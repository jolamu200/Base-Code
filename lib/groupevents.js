const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => ({
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363382023564830@newsletter',
        newsletterName: 'nova xmd',
        serverMessageId: 143,
    },
});

const defaultPP = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';

const GroupEvents = async (conn, update) => {
    try {
        if (!isJidGroup(update.id)) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const groupMembersCount = metadata.participants.length;
        const desc = metadata.desc || 'No Description';
        const time = new Date().toLocaleString();

        for (const num of participants) {
            const user = num.split('@')[0];

            let userPP;
            try {
                userPP = await conn.profilePictureUrl(num, 'image');
            } catch {
                userPP = defaultPP;
            }

            /* ===================== WELCOME ===================== */
            if (update.action === 'add' && config.WELCOME === 'true') {
                const welcomeText = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👋 WELCOME
┣━━━━━━━━━━━━━━━━━━━━━
┃ 👤 User     : @${user}
┃ 👥 Group    : ${metadata.subject}
┃ 👨‍👩‍👧 Member  : ${groupMembersCount}
┃ 🕒 Joined   : ${time}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📝 Rules:
┃ ${desc}
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

                await conn.sendMessage(update.id, {
                    image: { url: userPP },
                    caption: welcomeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });
            }

            /* ===================== GOODBYE ===================== */
            if (update.action === 'remove' && config.WELCOME === 'true') {
                const goodbyeText = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 😔 GOODBYE
┣━━━━━━━━━━━━━━━━━━━━━
┃ 👤 User   : @${user}
┃ 👥 Group  : ${metadata.subject}
┃ 🕒 Left   : ${time}
┃ 👨‍👩‍👧 Now   : ${groupMembersCount} Members
┣━━━━━━━━━━━━━━━━━━━━━
┃ 💔 We will miss you
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

                await conn.sendMessage(update.id, {
                    image: { url: userPP },
                    caption: goodbyeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });
            }

            /* ===================== PROMOTE ===================== */
            if (update.action === 'promote' && config.ADMIN_EVENTS === 'true') {
                const promoter = update.author.split('@')[0];

                const promoteText = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 👑 ADMIN PROMOTION
┣━━━━━━━━━━━━━━━━━━━━━
┃ 👤 User     : @${user}
┃ 🚀 Promoted : @${promoter}
┃ 👥 Group    : ${metadata.subject}
┃ 🕒 Time     : ${time}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 🎉 Congratulations
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

                await conn.sendMessage(update.id, {
                    caption: promoteText,
                    mentions: [num, update.author],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }

            /* ===================== DEMOTE ===================== */
            if (update.action === 'demote' && config.ADMIN_EVENTS === 'true') {
                const demoter = update.author.split('@')[0];

                const demoteText = `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ ⚠️ ADMIN DEMOTION
┣━━━━━━━━━━━━━━━━━━━━━
┃ 👤 User    : @${user}
┃ 👑 By      : @${demoter}
┃ 👥 Group   : ${metadata.subject}
┃ 🕒 Time    : ${time}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📉 Admin removed
┗━━━━━━━━━━━━━━━━━━━━━━┛`;

                await conn.sendMessage(update.id, {
                    caption: demoteText,
                    mentions: [num, update.author],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
