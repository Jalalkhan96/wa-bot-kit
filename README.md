<div align="center">

# 🤖 wa-bot-kit

**The everyday WhatsApp bot toolkit for Baileys — menus, stylish fonts, polls, reactions, presence, JID & command helpers.**

[![npm version](https://img.shields.io/npm/v/wa-bot-kit.svg)](https://www.npmjs.com/package/wa-bot-kit)
[![license](https://img.shields.io/npm/l/wa-bot-kit.svg)](./LICENSE)

Made by **[TEAM ABIX](https://github.com/Jalalkhan96)**

</div>

---

## 📥 Install

```bash
npm install wa-bot-kit
```

Zero dependencies. The code every WhatsApp bot rewrites — done once, tested.

## 🚀 What is inside

### 📋 Boxed menu builder

```javascript
const K = require('wa-bot-kit');

const menu = K.buildMenu({
  botName: 'ABIX Bot',
  prefix: '-',
  owner: 'Jalal Khan',
  categories: [
    { title: 'GROUP MENU', emoji: '👥', commands: [
      { cmd: 'kick', desc: 'remove member' }, { cmd: 'promote', desc: 'make admin' },
    ]},
    { title: 'AI MENU', emoji: '🤖', commands: [{ cmd: 'ai', desc: 'ask AI' }] },
  ],
});
await sock.sendMessage(jid, { text: menu });
K.countCommands(categories);   // 3
```

### ✨ Stylish unicode fonts (9 styles)

```javascript
K.stylish('Hello', 'bold');       // 𝐇𝐞𝐥𝐥𝐨
K.stylish('Hello', 'script');     // ℋ𝑒𝓁𝓁𝑜
K.stylish('Hello', 'smallCaps');  // ʜᴇʟʟᴏ
K.fontNames();                    // bold, italic, boldItalic, mono, script, double, smallCaps, bubble, square
K.waBold('x');  K.waQuote('a\nb');  // WhatsApp markdown helpers
```

### 📊 Polls

```javascript
await K.sendPoll(sock, jid, 'Best language?', ['Urdu', 'English', 'Arabic'], 1);
K.buildPoll('Q?', ['A', 'B']);    // payload only — validated (2–12 options)
```

### 💬 Reactions, presence, parsing

```javascript
await K.react(sock, m, '🔥');
await K.withTyping(sock, jid, async () => { /* slow work, shows "typing…" */ });

K.parseCommand('-play Believer');        // { command: 'play', args: ['Believer'], text: 'Believer' }
K.getText(m);                            // text/caption from any message shape
K.isGroup(jid); K.numberOf(jid); K.jidOf('+92 300…'); K.mention(jid);
```

## 🧩 The full TEAM ABIX WhatsApp family

| Package | For |
|---------|-----|
| **wa-bot-kit** | menus, fonts, polls, reactions, helpers |
| [wa-btn-kit](https://www.npmjs.com/package/wa-btn-kit) | **10 button types** — quick reply, URL, call, copy, list, Flow, remind, location, address, offer |
| [wa-carousel-kit](https://www.npmjs.com/package/wa-carousel-kit) | swipeable **carousels / sliders** + ready 10-slide menu |
| [wa-html-kit](https://www.npmjs.com/package/wa-html-kit) | **HTML pages** through WhatsApp, PFP injection |
| [wa-games-kit](https://www.npmjs.com/package/wa-games-kit) | playable **HTML games** + tic-tac-toe & quiz engines |
| [greeting-ninja](https://www.npmjs.com/package/greeting-ninja) | greet users **in their own language**, auto-detected from their phone number |

## License

MIT © TEAM ABIX
