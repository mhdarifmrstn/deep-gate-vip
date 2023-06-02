import "dotenv/config";

// @ts-ignore
import input from "input";

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/index.js";
import newMessageHandler from "./handlers/newMessageHandler.js";
import bot from "./botAccount.js";
import { CallbackQuery } from "telegram/events/CallbackQuery.js";
import callbackQueryHandler from "./handlers/callbackQueryHandler.js";
import globalState from "./services/globalState.js";
import editedMessageHandler from "./handlers/editedMessageHandler.js";
import { EditedMessage } from "telegram/events/EditedMessage.js";

const env = process.env;

if (!env.BOT_TOKEN) {
  throw Error("Provide BOT_TOKEN");
}

const botToken = env.BOT_TOKEN;

bot.addEventHandler(callbackQueryHandler, new CallbackQuery({}));

for (let i = 0; i < 2; i++) {
  const userIndex = i + 1;
  const apiId = Number(env[`USER_${userIndex}_API_ID`]);
  const apiHash = env[`USER_${userIndex}_API_HASH`]!;
  const stringSession = new StringSession(env[`USER_${userIndex}_STRING_SESSION`]);

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  client.addEventHandler(editedMessageHandler, new EditedMessage({}));
  client.addEventHandler(newMessageHandler, new NewMessage({}));

  (async () => {
    console.log("Loading interactive example...");

    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () => await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    globalState.selectedCards.initialize();
    globalState.keepCard.initialize();

    console.log("You should now be connected.");
  })();
}
(async () => {
  await bot.start({
    botAuthToken: botToken,
  });
  console.log(`Bot logged in successfully`);
})();
