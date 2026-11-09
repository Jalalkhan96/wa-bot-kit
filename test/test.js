'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const K = require('../index');

test('buildMenu renders boxed categories with prefix + counts', () => {
  const cats = [
    { title: 'GROUP MENU', emoji: '👥', commands: [{ cmd: 'kick', desc: 'remove member' }, { cmd: 'promote' }] },
    { title: 'AI MENU', emoji: '🤖', commands: [{ cmd: 'ai', desc: 'ask AI' }] },
  ];
  const menu = K.buildMenu({ botName: 'ABIX Bot', prefix: '-', owner: 'Jalal', categories: cats });
  assert.match(menu, /ABIX Bot/);
  assert.match(menu, /-kick — remove member/);
  assert.match(menu, /-promote/);
  assert.strictEqual(K.countCommands(cats), 3);
});

test('stylish fonts convert letters and keep other characters', () => {
  assert.strictEqual(K.stylish('Ab', 'bold'), '𝐀𝐛');
  assert.strictEqual(K.stylish('Hi!', 'smallCaps'), 'ʜɪ!');
  assert.match(K.stylish('123', 'mono'), /𝟷/);
  assert.strictEqual(K.stylish('a b', 'bubble'), 'ⓐ ⓑ');
  assert.ok(K.fontNames().length >= 8);
  assert.throws(() => K.stylish('x', 'nope'), /unknown font/);
});

test('WhatsApp markdown helpers', () => {
  assert.strictEqual(K.waBold('x'), '*x*');
  assert.strictEqual(K.waItalic('x'), '_x_');
  assert.strictEqual(K.waStrike('x'), '~x~');
  assert.strictEqual(K.waMono('x'), '```x```');
  assert.strictEqual(K.waQuote('a\nb'), '> a\n> b');
});

test('buildPoll validates and builds payloads', () => {
  const p = K.buildPoll('Best?', ['A', 'B', 'C'], 1);
  assert.deepStrictEqual(p, { poll: { name: 'Best?', values: ['A', 'B', 'C'], selectableCount: 1 } });
  assert.throws(() => K.buildPoll('Q', ['only']), /at least 2/);
  assert.throws(() => K.buildPoll('Q', Array(13).fill('x')), /at most 12/);
  assert.throws(() => K.buildPoll('', ['a', 'b']), /name is required/);
  assert.strictEqual(K.buildPoll('Q', ['a', 'b'], 99).poll.selectableCount, 2);
});

test('react + sendPoll use sendMessage with the right shapes', async () => {
  const sent = [];
  const sock = { sendMessage: async (jid, content) => { sent.push([jid, content]); return {}; } };
  await K.react(sock, { key: { remoteJid: '1@s.whatsapp.net', id: 'm1' } }, '🔥');
  assert.deepStrictEqual(sent[0][1], { react: { text: '🔥', key: { remoteJid: '1@s.whatsapp.net', id: 'm1' } } });
  await K.sendPoll(sock, '1@s.whatsapp.net', 'Q?', ['a', 'b']);
  assert.strictEqual(sent[1][1].poll.name, 'Q?');
});

test('withTyping sets presence, runs, and pauses even on error', async () => {
  const presence = [];
  const sock = { sendPresenceUpdate: async (p) => { presence.push(p); } };
  const out = await K.withTyping(sock, 'j', async () => 42);
  assert.strictEqual(out, 42);
  assert.deepStrictEqual(presence, ['composing', 'paused']);
  await assert.rejects(() => K.withTyping(sock, 'j', async () => { throw new Error('boom'); }), /boom/);
  assert.deepStrictEqual(presence, ['composing', 'paused', 'composing', 'paused']);
});

test('JID helpers', () => {
  assert.strictEqual(K.isGroup('123@g.us'), true);
  assert.strictEqual(K.isUser('923001234567@s.whatsapp.net'), true);
  assert.strictEqual(K.numberOf('923001234567:5@s.whatsapp.net'), '923001234567');
  assert.strictEqual(K.jidOf('+92 300 1234567'), '923001234567@s.whatsapp.net');
  assert.strictEqual(K.mention('923001234567@s.whatsapp.net'), '@923001234567');
});

test('parseCommand + getText', () => {
  assert.deepStrictEqual(K.parseCommand('-play  Believer song'), { command: 'play', args: ['Believer', 'song'], text: 'Believer song' });
  assert.strictEqual(K.parseCommand('hello'), null);
  assert.strictEqual(K.parseCommand('-'), null);
  assert.deepStrictEqual(K.parseCommand('$menu', '$'), { command: 'menu', args: [], text: '' });
  assert.strictEqual(K.getText({ message: { conversation: 'hi' } }), 'hi');
  assert.strictEqual(K.getText({ message: { imageMessage: { caption: 'cap' } } }), 'cap');
  assert.strictEqual(K.getText({ message: {} }), '');
});
