import { EditedMessageEvent } from "telegram/events/EditedMessage.js";
import astaroth from "./astaroth/index.js";
import globalState from "../services/globalState.js";

async function editedMessageHandler(event: EditedMessageEvent) {
  const message = event.message;
  const peerId = message.peerId;
  const astarothId = globalState.astarothId;

  if (message.isPrivate && peerId.className === "PeerUser") {
    if (peerId.userId.toString() === astarothId) {
      astaroth.privateChatEditHandler(event);
    }
  }
}

export default editedMessageHandler;
