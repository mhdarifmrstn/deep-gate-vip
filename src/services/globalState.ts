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
  totalJoinCurrentGame: TotalJoinCurrentGame;
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
    this.totalJoinCurrentGame = {};
    this.lastJoinTask = Promise.resolve();
  }

  async joinGame(client: TelegramClient, chatId: string, gameId: string) {
    // new bug of this i don't know on which line
    // Bot logged in successfully
    // 2023-06-17T17:18:35.448Z Game start at Dark Fears Privat 3 with anetha as participant
    // 2023-06-17T17:18:35.448Z Player mahendra🇸🇲𝐕𝐇𝟑𝟏]ᴰ¹ can't join the game cause the slot is full
    // node:internal/process/promises:289
    //             triggerUncaughtException(err, true /* fromPromise */);
    //             ^

    // [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "".] {
    //   code: 'ERR_UNHANDLED_REJECTION'
    // }
    // STEP TO REPRODUCE
    // run this project and start the game
    // on current limit, the default is only 1 player can join
    // player two will throw error but can be catched
    // right after /forcestart, try to /startgame again without restarting the project
    // at this time, the error above will showed

    const currentJoinTask = new Promise(async (resolve, reject) => {
      await this.lastJoinTask;

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
      const defaultLimit = 1;
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
