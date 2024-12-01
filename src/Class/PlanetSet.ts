import Config from "./Config.ts"
import Tariff from "./Tariff.ts"
import Planet from "./Planet.ts"
import PlanetType from "../Type/Planet.ts"

export default class PlanetSet extends Map<number, Planet> {
    public update (
        id: number,
        type: PlanetType,
        name: string,
        coordinateString: string,
        size: number,
        used: number,
        ids: number[],
        counts: number[],
        config: Config,
        tariff: Tariff,
    ): void {
        let planet: Planet | undefined = this.get(id);
        if (planet) {
            planet.update(
                name,
                coordinateString,
                size,
                used,
                ids,
                counts,
                config,
                tariff,
            );
        } else {
            this.set(
                id,
                new Planet(
                    type,
                    name,
                    coordinateString,
                    size,
                    used,
                    ids,
                    counts,
                    config,
                    tariff,
                ),
            );
        }
        planet = undefined;
        return;
    }
    public clone () : PlanetSet {
        return new PlanetSet(this);
    }
    public sub (planetSet: PlanetSet) : PlanetSet {
        let planet: [number, Planet] | undefined;
        for (planet of planetSet) {
            this.delete(planet[0]);
        }
        planet = undefined;
        return this;
    }

    constructor (planetSet?: PlanetSet) {
        super(planetSet);
    }
}