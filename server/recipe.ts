import {RandBetween} from "./util";
import {onClientCallback} from "@overextended/ox_lib/server";

export type MashRecipe = {
    corn: number,
    yeast: number,
    sugar: number,
    water: number
}

export const GenerateRecipe = (): MashRecipe => {
    const corn = RandBetween(2, 5);

    return {
        corn,
        sugar: RandBetween(0, Math.floor(corn/2)),
        yeast: RandBetween(1, 3),
        water: RandBetween(3, 8)
    }
}

export const BarrelHasValidRecipe = (barrel: number): boolean => {
    const recipe: MashRecipe = Entity(barrel).state.recipe

    return recipe.corn >= 2 && recipe.yeast >= 1 && recipe.water >= 3
};

export const RecipeToString = (recipe: MashRecipe): string => {
    return `${recipe.corn}x Corn,  ${recipe.sugar}x Sugar, ${recipe.yeast}x Yeast, ${recipe.water}x Water.`;
}

onClientCallback("moss:server:requestRecipe", (src: number): MashRecipe => {
    const recipe = GenerateRecipe();

    global.exports.ox_inventory.AddItem(src, "stickynote", 1, {
        recipe: `${RecipeToString(recipe)}`
    });

    return recipe
});