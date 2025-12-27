const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");
const { sendButtons } = require("gifted-btns"); // ✅ Hii ndio button system

cmd({
  pattern: "url",
  alias: ["imgtourl", "imgurl", "urll", "geturl", "upload"],
  react: '🖇',
  desc: "Convert media to Catbox URL",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (client, message, args, { reply }) => {
  let tempFilePath;
  try {
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

    if (!mimeType) {
      throw "❌ Please reply to an image, video, or audio file.";
    }

    const mediaBuffer = await quotedMsg.download();
    tempFilePath = path.join(os.tmpdir(), `catbox_upload_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('image/webp')) extension = '.webp';
    else if (mimeType.includes('image/gif')) extension = '.gif';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio')) extension = '.mp3';
    if (!extension) extension = path.extname(tempFilePath) || '.bin';

    const fileName = `file${extension}`;
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), fileName);
    form.append('reqtype', 'fileupload');

    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!response.data || !response.data.includes("https://")) {
      throw "Upload failed. Catbox returned an unexpected response.";
    }

    const mediaUrl = response.data;
    let mediaType = 'File';
    if (mimeType.includes('image')) mediaType = 'Image';
    else if (mimeType.includes('video')) mediaType = 'Video';
    else if (mimeType.includes('audio')) mediaType = 'Audio';

    const textMessage =
      "```[ FILE UPLOAD SUCCESS ]```\n" +
      "```========================```" + "\n" +
      `📁 TYPE   : ${mediaType}\n` +
      `📦 SIZE   : ${formatBytes(mediaBuffer.length)}\n` +
      `🌐 LINK   :\n${mediaUrl}\n` +
      "```========================```";

    // ✅ Tuma message na buttons (Copy + View Channel)
    await sendButtons(client, message.chat, {
      title: "",
      text: textMessage,
      footer: "> Uploaded by: NOVA XMD SYSTEM",
      buttons: [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 Copy Link",
            copy_code: mediaUrl
          })
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "📢 View Channel",
            url: "https://chat.whatsapp.com/0029VawO6hgF6sn7k3SuVU3z" // ✅ Badilisha hapa kwa channel yako
          })
        }
      ]
    }, { quoted: message });

  } catch (error) {
    console.error(error);
    await reply(`❌ Error: ${error.message || error}`);
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
