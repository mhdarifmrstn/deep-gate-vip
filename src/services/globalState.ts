import SelectCard from "./selectCardService.js";
import KeepCard from "./keepCardService.js";
import axios from "axios";
import { Redis } from "ioredis";
import { TelegramClient } from "telegram";

interface Player {
  name: string;
}
interface Chat {
  name: string;
  players: {
    [id: string]: Player | undefined;
  };
}
interface RegisteredChats {
  [id: string]: Chat | undefined;
}
interface PlayerLimit {
  [chatId: string]: number | undefined;
}
interface TotalJoinCurrentGame {
  [chatId: string]: number;
}
interface GlobalState {
  startTime: number;
  astarothId: string;
  joinDelay: number;
  selectCardDelay: number;
  selectedCards: SelectCard;
  keepCard: KeepCard;
  registeredChats: RegisteredChats;
  debug: boolean;
  redisClient: Redis;
  playerLimit: PlayerLimit;
  totalJoinCurrentGame: TotalJoinCurrentGame;
  lastJoinTask: Promise<any>;
  callbackQuerySeparator: string;
}
class GlobalState {
  constructor() {
    this.startTime = Date.now();
    this.astarothId = "2075925757";
    this.joinDelay = 0;
    this.selectCardDelay = 0;
    this.selectedCards = new SelectCard();
    this.keepCard = new KeepCard();
    this.registeredChats = {};
    this.debug = Boolean(process.env.DEEP_GATE_VIP_DEBUG);
    this.redisClient = new Redis(process.env.REDIS_URL || "");
    this.playerLimit = {};
    this.totalJoinCurrentGame = {};
    this.lastJoinTask = Promise.resolve();
    this.callbackQuerySeparator = "_";
  }

  async joinGame(client: TelegramClient, chatId: string, gameId: string) {
    const currentJoinTask = new Promise(async (resolve, reject) => {
      try {
        await this.lastJoinTask;
      } catch (_err) {
        reject();
      }
      if (this.totalJoinCurrentGame[chatId] === undefined) {
        this.totalJoinCurrentGame[chatId] = 0;
      }
      const playerLimit = await this.getPlayerLimit(chatId);

      if (this.totalJoinCurrentGame[chatId] < playerLimit) {
        this.totalJoinCurrentGame[chatId]++;
        await client.sendMessage("@astarothrobot", { message: `/start ${gameId}` });
      } else {
        reject();
      }
      resolve("");
    });
    this.lastJoinTask = currentJoinTask;
    return currentJoinTask;
  }

  clearTotalJoinGame(chatId: string) {
    this.totalJoinCurrentGame[chatId] = 0;
  }

  async getRegisteredChats() {
    const REGISTERED_CHATS_CONFIG_URL = process.env.REGISTERED_CHATS_CONFIG_URL;

    if (!REGISTERED_CHATS_CONFIG_URL) {
      throw Error("Provide REGISTERED_CHATS_CONFIG_URL");
    }
    this.registeredChats = (await axios.get<RegisteredChats>(REGISTERED_CHATS_CONFIG_URL)).data;
  }

  async getPlayerLimit(chatId: string) {
    let currentGroupLimit = this.playerLimit[chatId];

    if (!currentGroupLimit) {
      const defaultLimit = 2;
      currentGroupLimit = Number(await this.redisClient.get(`${chatId}-player-limit`)) || defaultLimit;
      this.playerLimit[chatId] = currentGroupLimit;
    }
    return currentGroupLimit;
  }

  async setPlayerLimit(chatId: string, limit: number) {
    this.playerLimit[chatId] = limit;
    await this.redisClient.set(`${chatId}-player-limit`, String(limit));
  }
}
const globalState = new GlobalState();

export default globalState;
