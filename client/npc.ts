import {Delay, OxOnSelect} from "./util";
import lib, {triggerServerCallback} from "@overextended/ox_lib/client";
import {MashRecipe, RecipeToString} from "../server/recipe";

let NPC: number | null = null;
let BLIP: number | null = null;

const [npcX, npcY, npcZ, npcH] = [959.7, 3619.09, 31.68, 89.08];

const Cancel = () => {
    LocalPlayer.state.moonshineActive = false
    LocalPlayer.state.moonshineRecipe = null
}

const Setup = async () => {
    const hash = GetHashKey("S_M_M_CntryBar_01");

    while (!HasModelLoaded(hash)) {
        RequestModel(hash);
        await Delay(1000);
    }

    NPC = CreatePed(0, hash, npcX, npcY, npcZ, npcH, false, true);
    FreezeEntityPosition(NPC, true)
    SetEntityInvincible(NPC, true)
    SetBlockingOfNonTemporaryEvents(NPC, true)
    PlaceObjectOnGroundProperly(NPC);


    BLIP = AddBlipForCoord(npcX, npcY, npcZ);
    SetBlipSprite(BLIP, 827);
    SetBlipDisplay(BLIP, 2);
    SetBlipScale(BLIP, 0.75);
    SetBlipColour(BLIP, 27);
    BeginTextCommandSetBlipName('STRING');
    AddTextComponentSubstringPlayerName("Moonshine");
    EndTextCommandSetBlipName(BLIP);

    global.exports.ox_target.addLocalEntity(NPC, [
        {
            name: "request",
            label: "Request Job",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return !LocalPlayer.state.moonshineActive;
            },
            event: "moss:client:requestJob"
        },
        {
            name: "return",
            label: "Deliver Moonshine",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return LocalPlayer.state.moonshineActive;
            },
            event: "moss:client:deliver"
        },
        {
            name: "cancel",
            label: "Cancel Job",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return LocalPlayer.state.moonshineActive;
            },
            onSelect: (data: OxOnSelect) => {
                Cancel();
            }
        }
    ]);
}

on("moss:client:requestJob", async () => {
    const success = await lib.alertDialog({
        header: "Eric 'Digger' Manes",
        content: "I got a client waiting on a batch of shine, they have asked for a very specific recipe and will buy as many jars as your run produces. I have written the recipe down on this sticky note. It contains the ingredient ratio the client has requested.\n" +
            "\n" +
            "**Requirements**\n" +
            " 1. Plastic Barrel\n" +
            " 2. Still\n" +
            " 3. Mason jars\n" +
            " 4. Corn\n" +
            " 5. Sugar\n" +
            " 6. Yeast\n" +
            " 7. Water\n" +
            "\n" +
            "**HOW TO**\n" +
            "1. Take a plastic barrel and fill it with the ingredients on the sticky note.\n" +
            "2. Seal the barrel\n" +
            "3. Wait for the fermentation process to finish.\n" +
            "4. Once finished pickup the barrel and load it in the still with a box of mason jars.\n" +
            "5. Light the still and wait for the distillation process to finish\n" +
            "6. Deliver the shine back to me."
    });

    if (success === "cancel") {
        return
    }

    const response = await triggerServerCallback<MashRecipe>("moss:server:requestRecipe", 0);

    if (!response) {
       console.error("Something went wrong getting a recipe from the server");
       return
    }

    LocalPlayer.state.moonshineActive = true
    LocalPlayer.state.moonshineRecipe = response
});

on("moss:client:deliver", () => {
    const inventory = global.exports.ox_inventory.GetSlotsWithItem("moonshine");
    let slots: number[] = [];

    for (const k in inventory) {
        const shine = inventory[k];

        if (
            shine.metadata.recipe_data.corn === LocalPlayer.state.moonshineRecipe.corn &&
            shine.metadata.recipe_data.water === LocalPlayer.state.moonshineRecipe.water &&
            shine.metadata.recipe_data.yeast === LocalPlayer.state.moonshineRecipe.yeast &&
            shine.metadata.recipe_data.sugar === LocalPlayer.state.moonshineRecipe.sugar
        ) {
            slots.push(shine.slot)
        }
    }

    if (slots.length < 1) {
        lib.notify({
            title: "This isn't correct",
            type: "error"
        });

        return
    }

    emitNet("moss:server:deliverShine", slots);

    Cancel();
});

on("QBCore:Client:OnPlayerLoaded", async (res: string) => {
    await Setup();
});

on("onResourceStart", async (res: string) => {
    if (res !== GetCurrentResourceName())
        return

    await Setup();
});

on("onResourceStop", (res: string) => {
    if (res !== GetCurrentResourceName())
        return

    if (NPC) {
        DeleteEntity(NPC);
    }

    if (BLIP) {
        RemoveBlip(BLIP);
    }
});