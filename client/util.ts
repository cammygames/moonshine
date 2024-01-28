export const Delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export type OxOnSelect = {
    label: string,
    resource: string,
    coords: any,
    distance: number,
    name: string,
    entity: number,
    hide: boolean
}

export const GetPropPos = (zModifier: number): number[] => {
    const offset = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0, 0.65, 0);
    const [propX, propY, propZ] = offset;

    const [success, groundZ]: [boolean, number] = GetGroundZFor_3dCoord(propX, propY, propZ, true);

    return [propX, propY, success ? groundZ+zModifier : propZ]
}