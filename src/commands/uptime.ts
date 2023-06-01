import { NewMessageEvent } from "telegram/events/index.js";
import globalState from "../services/globalState.js";

async function uptimeHandler(event: NewMessageEvent) {
  let uptimeTotal = Math.abs(+new Date() - globalState.startTime) / 1000;
  const uptimeHours = Math.floor(uptimeTotal / 3600);
  uptimeTotal -= uptimeHours * 3600;
  const uptimeMinutes = Math.floor(uptimeTotal / 60) % 60;
  uptimeTotal -= uptimeMinutes * 60;
  const uptimeSeconds = (uptimeTotal % 60).toFixed();

  let uptimeMessage = "";

  if (uptimeHours !== 0 && uptimeMinutes !== 0) {
    uptimeMessage = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;
  } else if (uptimeHours === 0 && uptimeMinutes !== 0) {
    uptimeMessage = `${uptimeMinutes}m ${uptimeSeconds}s`;
  } else {
    uptimeMessage = `${uptimeSeconds}s`;
  }

  await event.message.reply({ message: uptimeMessage });
}

export default uptimeHandler;
