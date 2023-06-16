import "dotenv/config";

// @ts-ignore
import input from "input";

import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import { NewMessage } from "telegram/events/index.js";
import newMessageHandler from "./handlers/newMessageHandler.js";
import bot from "./botAccount.js";
import { CallbackQuery } from "telegram/events/CallbackQuery.js";
import callbackQueryHandler from "./handlers/callbackQueryHandler.js";
import globalState from "./services/globalState.js";
import editedMessageHandler from "./handlers/editedMessageHandler.js";
import { EditedMessage } from "telegram/events/EditedMessage.js";
import debug from "./services/debug.js";

const env = process.env;

if (!env.BOT_TOKEN) {
  throw Error("Provide BOT_TOKEN");
}

const botToken = env.BOT_TOKEN;

bot.addEventHandler(callbackQueryHandler, new CallbackQuery({}));

(async () => {
  debug(`Global State getRegisteredChats()`);
  await globalState.getRegisteredChats();

  globalState.selectedCards.initialize();
  globalState.keepCard.initialize();

  const registeredChats = globalState.registeredChats;
  const registeredChatIds = Object.keys(registeredChats);
  const clientIds = registeredChatIds
    .map((chatId) => {
      return registeredChats[chatId]?.playerIds;
    })
    .flat();
  const totalClients = clientIds.length;
  debug(`Successfully got ${totalClients} total clients`);

  for (let i = 0; i < totalClients; i++) {
    const userIndex = i + 1;
    const apiId = Number(env[`USER_${userIndex}_API_ID`]);
    const apiHash = env[`USER_${userIndex}_API_HASH`]!;
    const stringSession = new StringSession(env[`USER_${userIndex}_STRING_SESSION`]);

    const client = new TelegramClient(stringSession, apiId, apiHash, {
      connectionRetries: 5,
    });
    client.addEventHandler(editedMessageHandler, new EditedMessage({}));
    client.addEventHandler(newMessageHandler, new NewMessage({}));

    console.log("Loading interactive example...");

    await client.start({
      phoneNumber: async () => await input.text("Please enter your number: "),
      password: async () => await input.text("Please enter your password: "),
      phoneCode: async () => await input.text("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
    const me = await client.getMe();
    console.log("You should now be connected.");
    console.log(`Logged in as ${(me as Api.User).firstName}`);
  }
  await bot.start({
    botAuthToken: botToken,
  });
  console.log(`Bot logged in successfully`);
})();
