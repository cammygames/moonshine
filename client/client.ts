import "./still";
import "./barrel";
import "./npc";
import lib from '@overextended/ox_lib/client';


onNet("moss:client:notify", (data: any) => {
    lib.notify(data);
})

on("onResourceStart", (res: string) => {
    if (res !== GetCurrentResourceName())
        return

    global.exports.ox_inventory.displayMetadata({
        recipe: "Recipe"
    })
});

