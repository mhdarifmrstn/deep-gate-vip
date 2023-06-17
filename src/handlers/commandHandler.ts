import { NewMessageEvent } from "telegram/events/index.js";
import registeredCommands from "../commands/index.js";

async function commandHandler(event: NewMessageEvent) {
  const text = event.message.text;
  if (!text.startsWith("/")) return;
  const commandFromUser = text.substring(1);

  registeredCommands.forEach((cmd) => {
    const commands = cmd[0];

    commands.forEach((command) => {
      if (commandFromUser.includes(command)) {
        const handler = cmd[1];
        const extra = cmd[2];

        extra?.middlewares.forEach((middleware) => middleware(event));
        handler(event);
      }
    });
  });
}

export default commandHandler;
