'use strict';
/**
 * wa-bot-kit — the everyday WhatsApp bot toolkit for Baileys.
 * Menu builder, stylish unicode fonts, polls, reactions, presence and
 * JID helpers — the small code every bot rewrites, done once, tested.
 *
 * Specialist kits by the same author:
 *   wa-btn-kit       10 button types
 *   wa-carousel-kit  swipeable carousels / sliders + 10-slide menu
 *   wa-html-kit      HTML pages through WhatsApp
 *   wa-games-kit     playable HTML + chat games
 *   greeting-ninja   greet users in their own language (by phone number)
 */

// ─── menu builder ───
// buildMenu({ botName, prefix, owner, categories: [{ title, emoji, commands: [{ cmd, desc }] }] })
function buildMenu(opts = {}) {
  const { botName = 'My Bot', prefix = '-', owner = '', categories = [], footer = '' } = opts;
  const head = [
    `╭━━━〔 🤖 *${botName}* 〕━━━╮`,
    owner ? `┃ 👑 Owner: ${owner}` : null,
    `┃ ⚡ Prefix: ${prefix}`,
    '╰━━━━━━━━━━━━━━━━╯',
  ].filter(Boolean);
  const body = categories.map(cat => {
    const lines = (cat.commands || []).map(c =>
      `┃ ➤ ${prefix}${c.cmd}${c.desc ? ` — ${c.desc}` : ''}`);
    return [`╭━━〔 ${cat.emoji || '📁'} *${cat.title}* 〕`, ...lines, '╰━━━'].join('\n');
  });
  return [...head, '', ...body, footer].filter(s => s !== undefined && s !== null && s !== '').join('\n');
}

// Count every command in a categories array (for "N commands" menu lines).
const countCommands = (categories = []) =>
  categories.reduce((n, c) => n + (c.commands ? c.commands.length : 0), 0);

// ─── stylish unicode fonts ───
const FONT_MAPS = {
  bold: '𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗',
  italic: '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡',
  boldItalic: '𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁',
  mono: '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿',
  script: '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵',
  double: '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡',
  smallCaps: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ',
  bubble: 'ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨',
  square: '🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉',
};
const PLAIN = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function stylish(text, font = 'bold') {
  const map = FONT_MAPS[font];
  if (!map) throw new Error(`wa-bot-kit: unknown font "${font}" — try: ${Object.keys(FONT_MAPS).join(', ')}`);
  const chars = [...map];
  return String(text).split('').map(ch => {
    const i = PLAIN.indexOf(ch);
    if (i === -1 || i >= chars.length) return ch;
    return chars[i];
  }).join('');
}
const fontNames = () => Object.keys(FONT_MAPS);

// WhatsApp markdown shortcuts
const waBold = (t) => `*${t}*`;
const waItalic = (t) => `_${t}_`;
const waStrike = (t) => `~${t}~`;
const waMono = (t) => '```' + t + '```';
const waQuote = (t) => String(t).split('\n').map(l => `> ${l}`).join('\n');

// ─── polls ───
// buildPoll('Best language?', ['Urdu', 'English'], 1) → sendMessage payload
function buildPoll(name, values, selectableCount = 1) {
  if (!name || !String(name).trim()) throw new Error('wa-bot-kit: poll name is required');
  if (!Array.isArray(values) || values.length < 2) throw new Error('wa-bot-kit: a poll needs at least 2 options');
  if (values.length > 12) throw new Error('wa-bot-kit: WhatsApp polls hold at most 12 options');
  const count = Math.max(1, Math.min(selectableCount, values.length));
  return { poll: { name: String(name), values: values.map(String), selectableCount: count } };
}
const sendPoll = (sock, jid, name, values, selectableCount) =>
  sock.sendMessage(jid, buildPoll(name, values, selectableCount));

// ─── reactions + presence ───
const react = (sock, message, emoji) =>
  sock.sendMessage(message.key.remoteJid, { react: { text: emoji || '', key: message.key } });

async function withTyping(sock, jid, fn, presence = 'composing') {
  try { await sock.sendPresenceUpdate(presence, jid); } catch { /* presence is cosmetic */ }
  try { return await fn(); }
  finally { try { await sock.sendPresenceUpdate('paused', jid); } catch { /* ignore */ } }
}

// ─── JID helpers ───
const isGroup = (jid) => typeof jid === 'string' && jid.endsWith('@g.us');
const isUser = (jid) => typeof jid === 'string' && jid.endsWith('@s.whatsapp.net');
const numberOf = (jid) => String(jid || '').split('@')[0].split(':')[0].replace(/\D/g, '');
const jidOf = (number) => `${String(number).replace(/\D/g, '')}@s.whatsapp.net`;
const mention = (number) => `@${numberOf(number)}`;

// Parse a command message: '-play song' → { command: 'play', args: ['song'], text: 'song' }
function parseCommand(body, prefix = '-') {
  if (typeof body !== 'string' || !body.startsWith(prefix)) return null;
  const rest = body.slice(prefix.length).trim();
  if (!rest) return null;
  const [command, ...args] = rest.split(/\s+/);
  return { command: command.toLowerCase(), args, text: args.join(' ') };
}

// Extract plain text from any Baileys message shape.
function getText(m) {
  const msg = m?.message || m || {};
  return msg.conversation
    || msg.extendedTextMessage?.text
    || msg.imageMessage?.caption
    || msg.videoMessage?.caption
    || msg.documentMessage?.caption
    || '';
}

module.exports = {
  buildMenu,
  countCommands,
  stylish,
  fontNames,
  waBold, waItalic, waStrike, waMono, waQuote,
  buildPoll,
  sendPoll,
  react,
  withTyping,
  isGroup, isUser, numberOf, jidOf, mention,
  parseCommand,
  getText,
  KITS: {
    buttons: 'wa-btn-kit',
    carousel: 'wa-carousel-kit',
    html: 'wa-html-kit',
    games: 'wa-games-kit',
    greeting: 'greeting-ninja',
  },
};
