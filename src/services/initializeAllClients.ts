import "dotenv/config";

// @ts-ignore
import input from "input";

import { Api, TelegramClient } from "telegram";
import { NewMessage } from "telegram/events/index.js";
import { EditedMessage } from "telegram/events/EditedMessage.js";
import { StringSession } from "telegram/sessions/index.js";
import editedMessageHandler from "../handlers/editedMessageHandler.js";
import newMessageHandler from "../handlers/newMessageHandler.js";

async function initializeAllClients(totalClients: number) {
  const env = process.env;
  const apiId = Number(env.API_ID);
  const apiHash = env.API_HASH!;

  for (let i = 0; i < totalClients; i++) {
    const userIndex = i + 1;
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
}

export default initializeAllClients;
