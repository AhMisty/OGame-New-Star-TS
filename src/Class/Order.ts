import Tariff from './Tariff.ts';
import ElementSet from './ElementSet.ts'

export default class Order {
    public readonly elements: ElementSet;
    
    constructor(
        public readonly id: number,
        public readonly time: string,
        public readonly price: number,
        ids: number[],
        counts: number[],
        tariff: Tariff,
    ) {
        this.elements = new ElementSet(ids, counts, tariff);
    }
}