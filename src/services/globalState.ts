import SelectCard from "./selectCardService.js";
import KeepCard from "./keepCardService.js";

interface RegisteredChats {
  [id: string]:
    | {
        id: string;
        playerIds: string[];
      }
    | undefined;
}
interface GlobalState {
  startTime: number;
  astarothId: string;
  joinDelay: number;
  selectCardDelay: number;
  selectedCards: SelectCard;
  keepCard: KeepCard;
  totalClient: number;
  registeredChats: RegisteredChats;
}
class GlobalState {
  constructor() {
    this.startTime = Date.now();
    this.astarothId = "2075925757";
    this.joinDelay = 2;
    this.selectCardDelay = 0;
    this.totalClient = 2;
    this.selectedCards = new SelectCard();
    this.keepCard = new KeepCard();
    this.registeredChats = {
      "1859501411": {
        id: "1859501411",
        playerIds: ["6073366007", "5946461971"],
      },
    };
  }
}
const globalState = new GlobalState();

export default globalState;
