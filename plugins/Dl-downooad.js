const config = require('../config')
const { cmd, commands } = require('../command')
const axios = require('axios')
const fs = require('fs-extra')

// ============================================
// TikTok Downloader
// ============================================
cmd({
    pattern: "tiktok",
    react: "🎵",
    alias: ["tt", "tiktokdl", "tikdl"],
    desc: "Download TikTok videos without watermark",
    category: "downloader",
    use: '.tiktok <url>',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide a TikTok video URL*\n\nExample: .tiktok https://vm.tiktok.com/xxxxxx");
        
        await reply("⏳ *Downloading TikTok video...*");

        // API 1: TikTok downloader (fast & reliable)
        let api1 = `https://api-library-kohi.onrender.com/api/alldl?url=${encodeURIComponent(q)}`;
        let res1 = await axios.get(api1).catch(e => null);
        
        if (res1?.data?.data && res1.data.data.video) {
            let data = res1.data.data;
            let videoUrl = data.video;
            let audioUrl = data.music;
            let title = data.title || "TikTok Video";
            let author = data.author || "Unknown";
            
            // Send video
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption: `🎬 *TikTok Downloaded*\n\n📹 *Title:* ${title}\n👤 *Author:* ${author}\n🎵 *Audio available*\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH",
                        serverMessageId: 1
                    }
                }
            }, { quoted: mek });
            
            return;
        }
        
        // API 2: Backup API
        let api2 = `https://api-library-kohi.onrender.com/api/tiktokdl?url=${encodeURIComponent(q)}`;
        let res2 = await axios.get(api2).catch(e => null);
        
        if (res2?.data?.data?.play) {
            let videoUrl = res2.data.data.play;
            
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption: `🎬 *TikTok Downloaded*\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH"
                    }
                }
            }, { quoted: mek });
            
            return;
        }
        
        reply("❌ *Failed to download TikTok video. Please check the URL and try again.*");
        
    } catch (e) {
        console.log(e);
        reply("❌ *Error: " + e.message + "*");
    }
});

// ============================================
// Facebook Downloader
// ============================================
cmd({
    pattern: "facebook2",
    react: "📘",
    alias: ["fb", "fbdl", "facebookdl"],
    desc: "Download Facebook videos",
    category: "downloader",
    use: '.facebook <url>',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide a Facebook video URL*");
        
        await reply("⏳ *Downloading Facebook video...*");
        
        // API
        let api = `https://api-library-kohi.onrender.com/api/alldl?url=${encodeURIComponent(q)}`;
        let res = await axios.get(api).catch(e => null);
        
        if (res?.data?.data && res.data.data.length > 0) {
            // Get the highest quality video
            let videos = res.data.data.filter(v => v.url && v.quality);
            let hdVideo = videos.find(v => v.quality === "HD") || videos[0];
            
            if (hdVideo) {
                await conn.sendMessage(from, {
                    video: { url: hdVideo.url },
                    caption: `📘 *Facebook Video Downloaded*\n\n🎬 *Quality:* ${hdVideo.quality || "Normal"}\n\n> Nova Xmd DOWNLOADER`,
                    contextInfo: {
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363382023564830@newsletter",
                            newsletterName: "B.M.B TECH"
                        }
                    }
                }, { quoted: mek });
                return;
            }
        }
        
        // Backup API
        let api2 = `https://api-library-kohi.onrender.com/api/fbdl?url=${encodeURIComponent(q)}`;
        let res2 = await axios.get(api2).catch(e => null);
        
        if (res2?.data?.data?.hd || res2?.data?.data?.sd) {
            let videoUrl = res2.data.data.hd || res2.data.data.sd;
            
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption: `📘 *Facebook Video Downloaded*\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH"
                    }
                }
            }, { quoted: mek });
            return;
        }
        
        reply("❌ *Failed to download Facebook video*");
        
    } catch (e) {
        console.log(e);
        reply("❌ *Error: " + e.message + "*");
    }
});

// ============================================
// Twitter/X Downloader
// ============================================
cmd({
    pattern: "twitter",
    react: "🐦",
    alias: ["tw", "xdl", "twitterdl"],
    desc: "Download Twitter/X videos",
    category: "downloader",
    use: '.twitter <url>',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide a Twitter/X video URL*");
        
        await reply("⏳ *Downloading Twitter video...*");
        
        let api = `https://api-library-kohi.onrender.com/api/alldl?url=${encodeURIComponent(q)}`;
        let res = await axios.get(api).catch(e => null);
        
        if (res?.data?.data?.url) {
            await conn.sendMessage(from, {
                video: { url: res.data.data.url },
                caption: `🐦 *Twitter/X Video Downloaded*\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH"
                    }
                }
            }, { quoted: mek });
            return;
        }
        
        // Backup
        let api2 = `https://api-library-kohi.onrender.com/api/xdl?url=${encodeURIComponent(q)}`;
        let res2 = await axios.get(api2).catch(e => null);
        
        if (res2?.data?.data?.url) {
            await conn.sendMessage(from, {
                video: { url: res2.data.data.url },
                caption: `🐦 *Twitter/X Video Downloaded*\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH"
                    }
                }
            }, { quoted: mek });
            return;
        }
        
        reply("❌ *Failed to download Twitter video*");
        
    } catch (e) {
        console.log(e);
        reply("❌ *Error: " + e.message + "*");
    }
});

// ============================================
// Instagram Downloader
// ============================================
cmd({
    pattern: "instagram",
    react: "📸",
    alias: ["ig", "igdl", "instadl"],
    desc: "Download Instagram videos/reels",
    category: "downloader",
    use: '.instagram <url>',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide an Instagram video/reel URL*");
        
        await reply("⏳ *Downloading Instagram video...*");
        
        let api = `https://api-library-kohi.onrender.com/api/alldl?url=${encodeURIComponent(q)}`;
        let res = await axios.get(api).catch(e => null);
        
        if (res?.data?.data && res.data.data.length > 0) {
            // Get video URL
            let videoItem = res.data.data.find(item => item.url && item.type === "video");
            if (videoItem) {
                await conn.sendMessage(from, {
                    video: { url: videoItem.url },
                    caption: `📸 *Instagram Video Downloaded*\n\n> Nova Xmd DOWNLOADER`,
                    contextInfo: {
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363382023564830@newsletter",
                            newsletterName: "B.M.B TECH"
                        }
                    }
                }, { quoted: mek });
                return;
            }
        }
        
        // Backup
        let api2 = `https://api-library-kohi.onrender.com/api/instadl?url=${encodeURIComponent(q)}`;
        let res2 = await axios.get(api2).catch(e => null);
        
        if (res2?.data?.data?.url) {
            await conn.sendMessage(from, {
                video: { url: res2.data.data.url },
                caption: `📸 *Instagram Video Downloaded*\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH"
                    }
                }
            }, { quoted: mek });
            return;
        }
        
        reply("❌ *Failed to download Instagram video*");
        
    } catch (e) {
        console.log(e);
        reply("❌ *Error: " + e.message + "*");
    }
});

// ============================================
// YouTube Downloader (MP4 & MP3)
// ============================================
cmd({
    pattern: "youtube",
    react: "▶️",
    alias: ["yt", "ytdl", "ytmp4"],
    desc: "Download YouTube videos",
    category: "downloader",
    use: '.youtube <url>',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide a YouTube URL*");
        
        await reply("⏳ *Downloading YouTube video...*");
        
        let api = `https://api-library-kohi.onrender.com/api/alldl?url=${encodeURIComponent(q)}`;
        let res = await axios.get(api).catch(e => null);
        
        if (res?.data?.data?.video) {
            let data = res.data.data;
            let videoUrl = data.video;
            let audioUrl = data.audio;
            let title = data.title || "YouTube Video";
            
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                caption: `▶️ *YouTube Video Downloaded*\n\n📹 *Title:* ${title}\n\n📥 *Audio also available! Use .ytaudio <url>*\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH"
                    }
                }
            }, { quoted: mek });
            return;
        }
        
        reply("❌ *Failed to download YouTube video*");
        
    } catch (e) {
        console.log(e);
        reply("❌ *Error: " + e.message + "*");
    }
});

// ============================================
// YouTube Audio Downloader (MP3)
// ============================================
cmd({
    pattern: "ytaudio",
    react: "🎵",
    alias: ["ytmp3", "yta", "ytaud"],
    desc: "Download YouTube audio (MP3)",
    category: "downloader",
    use: '.ytaudio <url>',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide a YouTube URL*");
        
        await reply("⏳ *Downloading YouTube audio...*");
        
        let api = `https://api-library-kohi.onrender.com/api/ytdl${encodeURIComponent(q)}`;
        let res = await axios.get(api).catch(e => null);
        
        if (res?.data?.data?.audio) {
            let data = res.data.data;
            let audioUrl = data.audio;
            let title = data.title || "YouTube Audio";
            
            await conn.sendMessage(from, {
                audio: { url: audioUrl },
                mimetype: "audio/mp4",
                caption: `🎵 *YouTube Audio Downloaded*\n\n📹 *Title:* ${title}\n\n> Nova Xmd DOWNLOADER`,
                contextInfo: {
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363382023564830@newsletter",
                        newsletterName: "B.M.B TECH"
                    }
                }
            }, { quoted: mek });
            return;
        }
        
        reply("❌ *Failed to download YouTube audio*");
        
    } catch (e) {
        console.log(e);
        reply("❌ *Error: " + e.message + "*");
    }
});

// ============================================
// All-in-One Downloader
// ============================================
cmd({
    pattern: "alldl",
    react: "📥",
    alias: ["download", "dl"],
    desc: "Universal downloader (auto-detect platform)",
    category: "downloader",
    use: '.alldl <url>',
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("❌ *Please provide a URL from TikTok, Facebook, Twitter, Instagram, or YouTube*");
        
        await reply("⏳ *Detecting platform and downloading...*");
        
        // Detect platform from URL
        let url = q.toLowerCase();
        let platform = "unknown";
        
        if (url.includes("tiktok.com")) platform = "tiktok";
        else if (url.includes("facebook.com") || url.includes("fb.watch")) platform = "facebook";
        else if (url.includes("twitter.com") || url.includes("x.com")) platform = "twitter";
        else if (url.includes("instagram.com")) platform = "instagram";
        else if (url.includes("youtube.com") || url.includes("youtu.be")) platform = "youtube";
        
        if (platform === "unknown") {
            return reply("❌ *Unsupported platform. Please use specific commands:*\n\n.tiktok <url>\n.facebook <url>\n.twitter <url>\n.instagram <url>\n.youtube <url>");
        }
        
        // Route to appropriate command
        let api = `https://api-library-kohi.onrender.com/api/alldl?url=${encodeURIComponent(q)}`;
        let res = await axios.get(api).catch(e => null);
        
        if (res?.data?.data) {
            let data = res.data.data;
            let videoUrl = data.video || data.url || (data.length > 0 && data[0]?.url) || data.hd || data.sd;
            
            if (videoUrl) {
                await conn.sendMessage(from, {
                    video: { url: videoUrl },
                    caption: `📥 *${platform.toUpperCase()} Downloaded*\n\n> Nova Xmd DOWNLOADER`,
                    contextInfo: {
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363382023564830@newsletter",
                            newsletterName: "B.M.B TECH"
                        }
                    }
                }, { quoted: mek });
                return;
            }
        }
        
        reply("❌ *Failed to download. Try the specific command for this platform.*");
        
    } catch (e) {
        console.log(e);
        reply("❌ *Error: " + e.message + "*");
    }
});
