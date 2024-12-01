import Config from "./Config.ts"
import ElementType from "../Type/Element.ts"

export default class Element {
    public readonly type: ElementType = 0;
    public readonly cost: number = 0;
    public readonly value: number = 0;

    constructor (
        id: number,
        metal: number,
        crystal: number,
        deuterium: number,
        config: Config,
    ) {
        let index: number | undefined= config.ElementThreshold.length - 1;
        for (; index > 0; index--) {
            if (config.ElementThreshold[index] < id) {
                this.type = index;
                break;
            }
        }
        index = undefined;
        this.cost = metal * config.MetalCost + crystal * config.CrystalCost + deuterium * config.DeuteriumCost;
        this.value = metal * config.MetalValue + crystal * config.CrystalValue + deuterium * config.DeuteriumValue;
    }
}
