import { NewMessageEvent } from "telegram/events/index.js";

async function deleteMessageMiddleware(event: NewMessageEvent) {
  try {
    await event.message.delete();
  } catch {}
}

export default deleteMessageMiddleware;
