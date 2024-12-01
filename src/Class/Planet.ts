import Config from "./Config.ts"
import PlanetType from "../Type/Planet.ts"
import Coordinate from "./Coordinate.ts"
import Tariff from "./Tariff.ts"
import ElementSet from "./ElementSet.ts"

export default class Planet {
    public readonly coordinate: Coordinate;
    public readonly elements: ElementSet;

    public update (
        name: string,
        coordinateString: string,
        size: number,
        used: number,
        ids: number[],
        counts: number[],
        config: Config,
        tariff: Tariff,
    ) : void {
        this.name = name;
        this.coordinate.set(coordinateString, config);
        this.size = size;
        this.used = used;
        this.elements.update(ids, counts, tariff);
    }

    constructor (
        public readonly type: PlanetType,
        public name: string,
        coordinateString: string,
        public size: number,
        public used: number,
        ids: number[],
        counts: number[],
        config: Config,
        tariff: Tariff,
    ) {
        this.coordinate = new Coordinate(coordinateString, config);
        this.elements = new ElementSet(ids, counts, tariff);
    }
}