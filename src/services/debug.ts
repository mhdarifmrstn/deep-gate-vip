import globalState from "./globalState.js";

const beAbleToDebug = globalState.debug;

function debug(text: string) {
  if (beAbleToDebug) {
    console.log(new Date(), text);
  }
}

export default debug;
