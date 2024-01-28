import lib from '@overextended/ox_lib/client';
import {Delay, GetPropPos, OxOnSelect} from "./util";

on("moss:client:useBarrel", () => {
    emitNet("moss:server:spawnBarrel", GetPropPos(0.5));
});

onNet("moss:client:setupBarrel", async (netID: number) => {
    while (!NetworkDoesEntityExistWithNetworkId(netID)) {
        await Delay(100);
        console.debug(`Waiting for barrel with netid: ${netID}`)
    }

    global.exports.ox_target.addEntity(netID, [
        {
            name: "dismantle",
            label: "Dismantle",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return !Entity(entity).state.sealed || Entity(entity).state.progress == 100;
            },
            onSelect: (data: OxOnSelect) => {
                emitNet("moss:server:dismantleBarrel", NetworkGetNetworkIdFromEntity(data.entity));
            }
        },
        {
            name: "check_barrel",
            label: "Check Progress",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return Entity(entity).state.sealed;
            },
            onSelect: (data: OxOnSelect) => {
                lib.notify({
                    title: 'Progress',
                    description: `${Entity(data.entity).state.progress}%`,
                    type: 'success',
                });
            }
        },
        {
            name: "open_barrel",
            label: "Open Barrel",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return !Entity(entity).state.sealed && Entity(entity).state.progress == 0;
            },
            onSelect: (data: OxOnSelect) => {
                global.exports.ox_inventory.openInventory("stash", `barrel_${netID}`);
            }
        },
        {
            name: "seal_barrel",
            label: "Seal Barrel",
            distance: 2,
            canInteract: (entity: number, distance: number, coords: number[], name: string, bone: string) => {
                return !Entity(entity).state.sealed;
            },
            onSelect: (data: OxOnSelect) => {
                emitNet("moss:server:sealBarrel", NetworkGetNetworkIdFromEntity(data.entity));
            }
        }
    ]);
} )