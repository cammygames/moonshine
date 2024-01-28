import {InventoryPayload} from "./util";

const STILL_INV_HOOK = global.exports.ox_inventory.registerHook("swapItems", (payload: InventoryPayload) => {
    const allowed_items = ["mash", "masonjars", "moonshine"]

    if (payload.toType != "stash") {
        return
    }

    if (allowed_items.indexOf(payload.fromSlot.name) == -1 || !payload.toSlot || typeof payload.toInventory !== "string") {
        return false;
    }

    const targetSlot = (typeof payload.toSlot === "number" ? payload.toSlot : payload.toSlot.slot)

    return targetSlot === allowed_items.indexOf(payload.fromSlot.name) + 1;
}, {
    inventoryFilter: [
        "^still_[%w]+",
    ]
});

console.info(`Registered Inventory Hook for Still ${STILL_INV_HOOK}`);

const BARREL_INV_HOOK = global.exports.ox_inventory.registerHook("swapItems", (payload: InventoryPayload) => {
    const allowed_items = ["sugar", "yeast", "corn", "water"];

    return allowed_items.indexOf(payload.fromSlot.name) != -1;
}, {
    inventoryFilter: [
        "^barrel_[%w]+",
    ]
});

console.info(`Registered Inventory Hook for Barrels ${BARREL_INV_HOOK}`);