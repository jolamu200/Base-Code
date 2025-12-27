const { cmd } = require("../command");

cmd({
  pattern: "save",
  alias: ["sendme", "send"],
  react: '📤',
  desc: "Sends the quoted message to your DM",
  category: "utility",
  filename: __filename
}, async (client, message, match, { from, owner }) => {
  try {
    // Angalia kama user ametuma reply
    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a message!*"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };

    let messageContent = {};
    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;
      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;
      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;
      default:
        return await client.sendMessage(from, {
          text: "❌ Only image, video, and audio messages are supported"
        }, { quoted: message });
    }

    // Tuma DM kwa owner (wewe) badala ya group
    const ownerJid = owner || from; // Default kwenda sender kama owner haipo
    await client.sendMessage(ownerJid, messageContent, options);

    // Optional: taarifa kwa user kwamba imefanikiwa
    await client.sendMessage(from, {
      text: "✅ Your quoted message has been saved to my DM."
    }, { quoted: message });

  } catch (error) {
    console.error("Forward Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error saving message:\n" + error.message
    }, { quoted: message });
  }
});
