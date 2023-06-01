import { NewMessageEvent } from "telegram/events/index.js";
import uptimeHandler from "./uptime.js";
import logMiddleware from "../middlewares/log.js";

type Handler = (event: NewMessageEvent) => void;
type Middleware = Handler;
type Extra = { middlewares: Middleware[] };
type RegisteredCommand = [string[], Handler, Extra?];

const registeredCommands: RegisteredCommand[] = [[["uptime"], uptimeHandler, { middlewares: [] }]];
registeredCommands.forEach((cmd) => {
  cmd[2]?.middlewares.push(logMiddleware);
});

export default registeredCommands;
