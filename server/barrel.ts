import {Delay, Notify, OxInventory, SlotType, SpawnProp} from "./util";
import {BarrelHasValidRecipe, MashRecipe} from "./recipe";

const BARREL_PROP = "prop_barrel_02a";
const BARREL_HASH = GetHashKey(BARREL_PROP);
const BARREL_PROCESSING_MINS = 1;

onNet("moss:server:spawnBarrel", async (propPos: number[]) => {
    const src = global.source
    const [propX, propY, propZ] = propPos;

    const success : boolean | [boolean, string] = global.exports.ox_inventory.RemoveItem(src, "plastic_barrel", 1);

    if (typeof success !== "boolean") {
        console.error("Failed removing item plastic_barrel from player.");
        return
    }

    const barrel = SpawnProp(BARREL_HASH, propX, propY, propZ);

    Entity(barrel).state.sealed = false;
    Entity(barrel).state.progress = 0;

    const netId = NetworkGetNetworkIdFromEntity(barrel);

    global.exports.ox_inventory.RegisterStash(`barrel_${netId}`, "Barrel", 4, 18000, false, null, null)

    emitNet("moss:client:setupBarrel", -1, netId);
});

onNet("moss:server:sealBarrel", (netId: number) => {
    const src = global.source;
    const barrel = NetworkGetEntityFromNetworkId(netId);

    Entity(barrel).state.sealed = true;

    const items = ["corn", "sugar", "yeast", "water"];
    let recipe: MashRecipe = {
        corn: 0,
        yeast: 0,
        sugar: 0,
        water: 0
    }

    items.forEach((value, index, array) => {
        recipe[value as keyof MashRecipe] = global.exports.ox_inventory.GetItemCount(`barrel_${netId}`, value)
    })

    Entity(barrel).state.recipe = recipe

    if (!BarrelHasValidRecipe(barrel)) {
        Notify(src, {
            title: "Something doesnt seem right",
            type: "error"
        });
        return
    }

    items.forEach((value, index, array) => {
        global.exports.ox_inventory.RemoveItem(`barrel_${netId}`, value, recipe[value as keyof MashRecipe]);
    });

    setTimeout(async () => {
        while(Entity(barrel).state.progress < 100) {
            await Delay((1000 * 60) * BARREL_PROCESSING_MINS);

            let progress = Entity(barrel).state.progress;

            Entity(barrel).state.progress = progress + 10
        }
    }, 0);
});

onNet("moss:server:dismantleBarrel", (netId: number) => {
    const src: number = global.source;
    const prop = NetworkGetEntityFromNetworkId(netId);
    let item = "plastic_barrel";
    let metadata = null;

    if (Entity(prop).state.progress >= 100) {
        item = "mash"
        metadata = {
            recipe_data: Entity(prop).state.recipe
        }
    }

    const inventory = global.exports.ox_inventory.GetInventory(`barrel_${netId}`);

    if (inventory.items.length > 0) {
        Notify(src, {
            title: "This Barrel isn't empty!",
            type: "error"
        })
        return
    }

    const [success, error]: [boolean, string] = global.exports.ox_inventory.AddItem(src, item, 1, metadata);

    if (!success) {
        return
    }

    //TODO: Remove stash from db, ox inv doesnt seem to have a method for this.

    DeleteEntity(prop);
    emitNet("ox_target:removeEntity", -1, netId);
});