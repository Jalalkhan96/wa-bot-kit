export interface MenuCategory { title: string; emoji?: string; commands: { cmd: string; desc?: string }[] }
export interface MenuOptions { botName?: string; prefix?: string; owner?: string; categories: MenuCategory[]; footer?: string }
export function buildMenu(opts: MenuOptions): string;
export function countCommands(categories: MenuCategory[]): number;
export type FontName = 'bold' | 'italic' | 'boldItalic' | 'mono' | 'script' | 'double' | 'smallCaps' | 'bubble' | 'square';
export function stylish(text: string, font?: FontName): string;
export function fontNames(): string[];
export function waBold(t: string): string;
export function waItalic(t: string): string;
export function waStrike(t: string): string;
export function waMono(t: string): string;
export function waQuote(t: string): string;
export function buildPoll(name: string, values: string[], selectableCount?: number): { poll: { name: string; values: string[]; selectableCount: number } };
export function sendPoll(sock: any, jid: string, name: string, values: string[], selectableCount?: number): Promise<any>;
export function react(sock: any, message: any, emoji: string): Promise<any>;
export function withTyping<T>(sock: any, jid: string, fn: () => Promise<T>, presence?: string): Promise<T>;
export function isGroup(jid?: string): boolean;
export function isUser(jid?: string): boolean;
export function numberOf(jid?: string): string;
export function jidOf(number: string): string;
export function mention(number: string): string;
export function parseCommand(body: string, prefix?: string): { command: string; args: string[]; text: string } | null;
export function getText(m: any): string;
export const KITS: Record<string, string>;
