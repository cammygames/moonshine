const SHINE_VALUE = 10;

onNet("moss:server:deliverShine", (slots: number[]) => {
    const src = global.source;

    let totalShine = 0;

    slots.forEach((value, index, array) => {
        const shine = global.exports.ox_inventory.GetSlot(src, value);

        const removed : boolean | [boolean, string] = global.exports.ox_inventory.RemoveItem(src, "moonshine", shine.count, null, value);

        if (typeof removed !== "boolean") {
            return
        }

        totalShine += shine.count;
    });

    if (totalShine < 1) {
        return
    }

    const reward = SHINE_VALUE * totalShine;

    const Player = global.exports.qbx_core.GetPlayer(src)
    Player.Functions.AddMoney('cash', reward);

    emitNet("moss:client:notify", src, {
        title: "Thanks",
        description: `Your cut for this run is $${reward}`
    });
});