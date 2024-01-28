import {Delay, GetPropPos, OxOnSelect} from "./util";

on("moss:client:useStill", async () => {
    emitNet("moss:server:spawnStill", GetPropPos(0.22));
});

onNet("moss:client:setupStill", async (netId: number) => {
    while (!NetworkDoesEntityExistWithNetworkId(netId)) {
        await Delay(100);
        console.debug(`Waiting for still with netid ${netId}`)
    }

    global.exports.ox_target.addEntity(netId, [
        {
            name: "dismantle",
            label: "Dismantle",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return !Entity(entity).state.running
            },
            onSelect: (data: OxOnSelect) => {
                emitNet("moss:server:dismantleStill", NetworkGetNetworkIdFromEntity(data.entity));
            }
        },
        {
            name: "open_still",
            label: "Open Still",
            distance: 2,
            onSelect: (data: OxOnSelect) => {
                global.exports.ox_inventory.openInventory("stash", `still_${netId}`);
            }
        },
        {
            name: "light_still",
            label: "Light Still",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return !Entity(entity).state.running;
            },
            onSelect: (data: OxOnSelect) => {
                emitNet("moss:server:lightStill", NetworkGetNetworkIdFromEntity(data.entity));
            }
        }
    ]);
})