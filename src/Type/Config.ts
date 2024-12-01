import SingleArray from "./SingleArray.ts"
import Response from "./Response.ts"

type Config = {
    Request: (
        option: {
            path: string,
            method: string,
            body: Buffer | undefined,
            headers: string[],
        },
        checkHeader: (
            header: string[]
        )=> boolean,
    ) => Promise<Response>;
    RandomIP: () => string;
    MetalCost: number;
    CrystalCost: number;
    DeuteriumCost: number;
    MetalValue: number;
    CrystalValue: number;
    DeuteriumValue: number;
    MaxGalaxy: number;
    MaxSystem: number;
    MaxPlanet: number;
    ElementThreshold: SingleArray<22, number>;
    ControlListLength: number;
}

export default Config
