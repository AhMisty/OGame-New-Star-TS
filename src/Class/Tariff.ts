import Config from "./Config.ts"
import Element from "./Element.ts"

export default class Tariff extends Map {
    public static readonly Default: Tariff = new Tariff(Config.Default);

    constructor (config: Config) {
        super();
        this.set(202, new Element(202, 2000, 2000, 0, config));
        this.set(203, new Element(203, 6000, 6000, 0, config));
        this.set(204, new Element(204, 3000, 1000, 0, config));
        this.set(205, new Element(205, 8000, 4000, 0, config));
        this.set(206, new Element(206, 15000, 9500, 2000, config));
        this.set(207, new Element(207, 41000, 17000, 0, config));
        this.set(208, new Element(208, 10000, 20000, 10000, config));
        this.set(209, new Element(209, 10000, 6000, 2000, config));
        this.set(210, new Element(210, 0, 1500, 0, config));
        this.set(211, new Element(211, 70000, 45000, 5000, config));
        this.set(212, new Element(212, 0, 2000, 500, config));
        this.set(217, new Element(217, 35000, 20000, 1500, config));
        this.set(242, new Element(242, 10000, 4000, 300, config));
        this.set(243, new Element(243, 3000, 2000, 150, config));
        this.set(244, new Element(244, 1100, 100, 0, config));

        this.set(401, new Element(401, 2000, 0, 0, config));
        this.set(402, new Element(402, 1500, 500, 0, config));
        this.set(403, new Element(403, 6000, 2000, 0, config));
        this.set(404, new Element(404, 20000, 15000, 2000, config));
        this.set(405, new Element(405, 2000, 6000, 0, config));
        this.set(406, new Element(406, 50000, 50000, 30000, config));
        this.set(434, new Element(434, 800, 100, 10, config));
        this.set(436, new Element(436, 3000, 1000, 0, config));

        this.set(901, new Element(901, 1, 0, 0, config));
        this.set(902, new Element(902, 0, 1, 0, config));
        this.set(903, new Element(903, 0, 0, 1, config));
    }
}
