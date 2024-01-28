import './barrel';
import './still';
import './inventory';
import './recipe';
import './npc';

on("onResourceStart", (res: string) => {
  if (res !== GetCurrentResourceName())
    return

  console.log("Starting Moonshine");
});

on("onResourceStop", (res: string) => {
  if (res !== GetCurrentResourceName())
    return

  console.log("Stopping Moonshine");
});