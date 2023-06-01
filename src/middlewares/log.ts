import bigInt from "big-integer";
import { Api } from "telegram";
import { getEntity } from "telegram/client/users.js";
import { Entity } from "telegram/define";
import { NewMessageEvent } from "telegram/events/index.js";

interface EntityInfo {
  id?: bigInt.BigInteger;
  name?: string;
}
function getEntityInfo(entity?: Entity): EntityInfo {
  if (!entity) return {};

  if (entity.className === "User") {
    return {
      id: entity.id,
      name: entity.firstName,
    };
  } else if (entity.className === "Chat") {
    return {
      id: entity.id,
      name: entity.title,
    };
  } else {
    return {};
  }
}
async function logMiddleware(event: NewMessageEvent) {
  const sender = await event.message.getSender();
  const chat = await event.message.getChat();

  const senderInfo = getEntityInfo(sender);
  const chatInfo = getEntityInfo(chat);

  const text = event.message.text;
  const logText =
    `senderId: ${senderInfo.id}\n` +
    `senderName: ${senderInfo.name}\n` +
    `chatName: ${chatInfo.name}\n` +
    `text: ${text}`;

  console.log(logText);
}

export default logMiddleware;
