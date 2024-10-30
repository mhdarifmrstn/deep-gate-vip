import { EditedMessageEvent } from "telegram/events/EditedMessage.js";
import astaroth from "./astaroth/index.js";
import globalState from "../services/globalState.js";

async function editedMessageHandler(event: EditedMessageEvent) {
  const message = event.message;
  const peerId = message.peerId;
  const fromId = message.fromId;
  const astarothId = globalState.astarothId;

  if (message.isPrivate && peerId.className === "PeerUser") {
    if (peerId.userId.toString() === astarothId) {
      astaroth.privateChatEditHandler(event);
    }
  } else if (fromId && fromId.className === "PeerUser") {
    if (fromId.userId.toString() === astarothId) {
      astaroth.groupChatEditHandler(event);
    }
  }
}

export default editedMessageHandler;
