import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import "dotenv/config";

const env = process.env;
const stringSession = env.BOT_STRING_SESSION;
const BOT_API_ID = Number(env.BOT_API_ID!);
const BOT_API_HASH = env.BOT_API_HASH!;

const bot = new TelegramClient(new StringSession(stringSession), BOT_API_ID, BOT_API_HASH, {
  connectionRetries: 5,
});

export default bot;
