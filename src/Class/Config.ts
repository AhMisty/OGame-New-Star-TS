import ConfigType from "../Type/Config.ts"
import crypto from "crypto"

class Config implements ConfigType {
    public readonly Request: ConfigType["Request"];
    public readonly RandomIP: ConfigType["RandomIP"];
    public readonly MetalCost: number;
    public readonly CrystalCost: number;
    public readonly DeuteriumCost: number;
    public readonly MetalValue: number;
    public readonly CrystalValue: number;
    public readonly DeuteriumValue: number;
    public readonly MaxGalaxy: number;
    public readonly MaxSystem: number;
    public readonly MaxPlanet: number;
    public readonly ElementThreshold: ConfigType["ElementThreshold"];
    public readonly ControlListLength: ConfigType["ControlListLength"];

    public static readonly Default: ConfigType = {
        Request: () => Promise.resolve({ header: [], body: "" }),
        RandomIP: () => `${crypto.randomInt(0, 256)}.${crypto.randomInt(0, 256)}.${crypto.randomInt(0, 256)}.${crypto.randomInt(0, 256)}`,
        MetalCost: 1,
        CrystalCost: 2,
        DeuteriumCost: 4,
        MetalValue: 1,
        CrystalValue: 2,
        DeuteriumValue: 0,
        MaxGalaxy: 9,
        MaxSystem: 400,
        MaxPlanet: 16,
        ElementThreshold: [0, 100, 200, 400, 600, 700, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400],
        ControlListLength: 161,
    }

    constructor(config: Partial<ConfigType>) {
        this.Request = config.Request ?? Config.Default.Request;
        this.RandomIP = config.RandomIP ?? Config.Default.RandomIP;
        this.MetalCost = config.MetalCost ?? Config.Default.MetalCost;
        this.CrystalCost = config.CrystalCost ?? Config.Default.CrystalCost;
        this.DeuteriumCost = config.DeuteriumCost ?? Config.Default.DeuteriumCost;
        this.MetalValue = config.MetalValue ?? Config.Default.MetalValue;
        this.CrystalValue = config.CrystalValue ?? Config.Default.CrystalValue;
        this.DeuteriumValue = config.DeuteriumValue ?? Config.Default.DeuteriumValue;
        this.MaxGalaxy = config.MaxGalaxy ?? Config.Default.MaxGalaxy;
        this.MaxSystem = config.MaxSystem ?? Config.Default.MaxSystem;
        this.MaxPlanet = config.MaxPlanet ?? Config.Default.MaxPlanet;
        this.ElementThreshold = config.ElementThreshold ?? Config.Default.ElementThreshold;
        this.ControlListLength = config.ControlListLength ?? Config.Default.ControlListLength;
    }
}

export default Config

