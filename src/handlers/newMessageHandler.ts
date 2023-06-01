import { NewMessageEvent } from "telegram/events/index.js";
import bigInt from "big-integer";
import globalState from "../services/globalState.js";
import astaroth from "./astaroth/index.js";

async function newMessageHandler(event: NewMessageEvent) {
  const message = event.message;
  const peerId = message.peerId;
  const fromId = message.fromId;
  const astarothId = globalState.astarothId;

  if (message.isPrivate && peerId.className === "PeerUser") {
    if (peerId.userId.toString() === astarothId) {
      astaroth.privateChatHandler(event);
    }
  } else if (fromId && fromId.className === "PeerUser") {
    if (fromId.userId.toString() === astarothId) {
      astaroth.groupChatHandler(event);
    }
  }
}

export default newMessageHandler;
