import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import "dotenv/config";

const env = process.env;
const stringSession = env.BOT_STRING_SESSION;
const API_ID = Number(env.API_ID!);
const API_HASH = env.API_HASH!;

const bot = new TelegramClient(new StringSession(stringSession), API_ID, API_HASH, {
  connectionRetries: 5,
});

export default bot;
