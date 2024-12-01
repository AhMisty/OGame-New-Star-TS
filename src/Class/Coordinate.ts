import Config from "./Config.ts"
import StringToInteger from "../Hook/StringToInteger.ts"

class Coordinate extends Array<number> {
    public set (coordinateString: string, config: Config) : void {
        let coordinateStringArray: string[] | undefined = coordinateString.split(":");
        this[0] = Math.min(StringToInteger(coordinateStringArray[0]), config.MaxGalaxy);
        this[1] = Math.min(StringToInteger(coordinateStringArray[1]), config.MaxSystem);
        this[2] = Math.min(StringToInteger(coordinateStringArray[2]), config.MaxPlanet);
        coordinateStringArray = undefined;
    }

    public toString () : string {
        return `${this.join(":")}`;
    }

    constructor (coordinateString: string, config: Config) {
        super(3);
        this.set(coordinateString, config);
    }
}

export default Coordinate
