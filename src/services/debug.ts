import globalState from "./globalState.js";

const beAbleToDebug = globalState.debug;

function debug(text: string) {
  if (beAbleToDebug) {
    console.log(text);
  }
}

export default debug;
