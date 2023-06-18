import { NewMessageEvent } from "telegram/events/index.js";
import uptimeHandler from "./uptime.js";
import configHandler from "./config.js";

type Handler = (event: NewMessageEvent) => void;
type Middleware = Handler;
type Extra = { middlewares: Middleware[] };
type RegisteredCommand = [string[], Handler, Extra?];

const registeredCommands: RegisteredCommand[] = [
  [["uptime"], uptimeHandler, { middlewares: [] }],
  [["config"], configHandler, { middlewares: [] }],
];

export default registeredCommands;
