export const Delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const RandBetween = (min:number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const SpawnProp = (hash: number, x: number, y: number, z:number): number => {
    const prop = CreateObjectNoOffset(hash, x, y, z, true, true, false);
    FreezeEntityPosition(prop, true);

    return prop
}

export type SlotType = {
    close: boolean,
    metadata: any,
    label: string,
    stack: boolean,
    slot: number,
    weight: number,
    name: string,
    description: string,
    count: number
}

export type InventoryPayload = {
    source: number,
    action: "move" | "stack" | "swap" | "give",
    fromInventory: number | string,
    toInventory: number | string,
    fromType: string,
    toType: string,
    fromSlot: SlotType,
    toSlot?: SlotType | number,
    count: number
}

export type OxInventory = {
    time: number,
    openedBy: any
    owner: any
    slots: number,
    dbId: string,
    label: string,
    id: string,
    changed: boolean,
    open: boolean,
    type: string,
    weight: number
    items: Record<string, SlotType>,
    maxWeight: number
}

export type Notification = {
    id?: string
    title?: string
    description?: string
    duration?: number
    position?: "top" | "top-right" | "top-left" | "bottom" | "bottom-right" | "bottom-left" | "center-right" | "center-left"
    type?: "inform" | "error" | "success" | "warning"
    style?: any
    icon?: string
    iconColor?: string
    iconAnimation?: "spin" | "spinPulse" | "spinReverse" | "pulse" | "beat" | "fade" | "beatFade" | "bounce" | "shake"
    alignIcon?: "top" | "center"
}

export const Notify = (target: number, cfg: Notification) => {
    emitNet("moss:client:notify", target, cfg);
}

