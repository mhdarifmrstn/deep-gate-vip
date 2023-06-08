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
  debug: boolean;
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
      "1684256389": {
        id: "1684256389",
        playerIds: ["6267363552", "5946461971"],
      },
      "1828992416": {
        id: "1828992416",
        playerIds: ["6212345891", "5634983921"],
      },
    };
    this.debug = Boolean(process.env.DEEP_GATE_VIP_DEBUG);
  }
}
const globalState = new GlobalState();

export default globalState;
