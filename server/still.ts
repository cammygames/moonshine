import {Delay, Notify, OxInventory, RandBetween, SlotType, SpawnProp} from "./util";
import {MashRecipe, RecipeToString} from "./recipe";

const STILL_PROP = "prop_still";
const STILL_HASH = GetHashKey(STILL_PROP);
const STILL_PROCESS_TIME = 1; //Change to RandBetween for non-testing?

onNet("moss:server:dismantleStill", (netId: number) => {
    const src: number = global.source;
    const prop = NetworkGetEntityFromNetworkId(netId);

    const inventory = global.exports.ox_inventory.GetInventory(`still_${netId}`);

    if (inventory.items.length > 0) {
        Notify(src, {
            title: "This Still isn't empty!",
            type: "error"
        })
        return
    }

    const [success, error]: [boolean, string] = global.exports.ox_inventory.AddItem(src, "still", 1);

    if (!success) {
        return
    }

    //TODO: Remove stash from db, ox inv lacks a method for this....

    DeleteEntity(prop);
    emitNet("ox_target:removeEntity", -1, netId);
});

onNet("moss:server:spawnStill", async (propPos: number[]) => {
    const src = global.source;
    const [propX, propY, propZ] = propPos;

    const success : boolean | [boolean, string] = global.exports.ox_inventory.RemoveItem(src, "still", 1);

    if (typeof success !== "boolean") {
        console.error("Failed removing item still from player.");

        return
    }

    const still = SpawnProp(STILL_HASH, propX, propY, propZ);

    Entity(still).state.running = false

    const netId = NetworkGetNetworkIdFromEntity(still);

    global.exports.ox_inventory.RegisterStash(`still_${netId}`, "Still", 3, 100000, false, null, null)

    emitNet("moss:client:setupStill", -1, netId);
});


const ProcessStill = async (netId: number) => {
    const invID = `still_${netId}`;
    const still = NetworkGetEntityFromNetworkId(netId);

    if (Entity(still).state.running) {
        return
    }

    const mash: SlotType | undefined = global.exports.ox_inventory.GetSlot(invID, 1);

    if (!mash) {
        return
    }

    const recipe: MashRecipe = mash.metadata.recipe_data

    const removedMash : boolean | [boolean, string] = global.exports.ox_inventory.RemoveItem(invID, "mash", 1);
    const removedJars : boolean | [boolean, string] = global.exports.ox_inventory.RemoveItem(invID, "masonjars", 1);

    if (typeof removedMash !== "boolean" || typeof removedJars !== "boolean") {
        console.error("Failed removing items from still.");
        return
    }

    Entity(still).state.running = true

    let progress = 100;

    while(progress > 0) {
        progress = progress - 10

        await Delay((1000 * 60) * STILL_PROCESS_TIME);

        global.exports.ox_inventory.AddItem(invID, "moonshine", RandBetween(1, 5), {
            recipe: RecipeToString(recipe),
            recipe_data: recipe
        }, 3);
    }

    Entity(still).state.running = false;
};

onNet("moss:server:lightStill", async (netId: number) => {
    setTimeout(() => {
        ProcessStill(netId)
    }, 0);
});