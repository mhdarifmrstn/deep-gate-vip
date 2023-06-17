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
interface JoinTimeout {
  [chatId: string]: NodeJS.Timeout | undefined;
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
  joinTimeout: JoinTimeout;
  totalJoinCurrentGame: TotalJoinCurrentGame;
  resetTotalJoinDelay: number;
  lastJoinTask: Promise<any>;
}
class GlobalState {
  constructor() {
    this.startTime = Date.now();
    this.astarothId = "2075925757";
    this.joinDelay = 2;
    this.selectCardDelay = 0;
    this.selectedCards = new SelectCard();
    this.keepCard = new KeepCard();
    this.registeredChats = {};
    this.debug = Boolean(process.env.DEEP_GATE_VIP_DEBUG);
    this.redisClient = new Redis(process.env.REDIS_URL || "");
    this.playerLimit = {};
    this.joinTimeout = {};
    this.totalJoinCurrentGame = {};
    this.resetTotalJoinDelay = 3;
    this.lastJoinTask = Promise.resolve();
  }

  async joinGame(client: TelegramClient, chatId: string, gameId: string) {
    console.log(this.totalJoinCurrentGame[chatId]);
    if (this.totalJoinCurrentGame[chatId] === undefined) {
      this.totalJoinCurrentGame[chatId] = 0;
    }
    if (this.totalJoinCurrentGame[chatId] < (await this.getPlayerLimit(chatId))) {
      this.totalJoinCurrentGame[chatId]++;
      await client.sendMessage("@astarothrobot", { message: `/start ${gameId}` });
      clearTimeout(this.joinTimeout[chatId]);

      this.joinTimeout[chatId] = setTimeout(() => {
        this.totalJoinCurrentGame[chatId] = 0;
      }, this.resetTotalJoinDelay * 1000);
    } else {
      console.log("total join:", this.totalJoinCurrentGame[chatId]);
      console.log(`Player can't join this game cause the slot is full`);
    }
  }

  async selializedJoinGame(client: TelegramClient, chatId: string, gameId: string) {
    const currentJoinTask: Promise<any> = new Promise(async (resolve) => {
      await this.lastJoinTask;
      const result = await this.joinGame(client, chatId, gameId);
      resolve(result);
    });
    this.lastJoinTask = currentJoinTask;
    return currentJoinTask;
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
      currentGroupLimit = Number(await this.redisClient.get(`${chatId}-player-limit`));
      this.playerLimit[chatId] = currentGroupLimit || defaultLimit;
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
