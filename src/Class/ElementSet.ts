import Element from "./Element.ts"
import Tariff from "./Tariff.ts"

export default class ElementSet extends Map<number, number> {
    private _cost: number;
    public get cost () : number {
        return this._cost;
    }

    private _value: number;
    public get value () : number {
        return this._value;
    }

    private _operate (id: number, count: number, tariff: Tariff) : void {
        let element: Element | undefined = tariff.get(id);
        if (element) {
            this._value += element.value * count;
            this._cost += element.cost * count;
        } else {
            this._value += count;
            this._cost += count;
        }
        element = undefined;
    }
    private _addExistence (id: number, oldCount: number, addCount: number, tariff: Tariff) : void {
        this.set(id, oldCount + addCount);
        this._operate(id, addCount, tariff);
    }
    private _subExistence (id: number, oldCount: number, subCount: number, tariff: Tariff) : void {
        let newCount: number | undefined = oldCount - subCount;
        if (newCount > 0) {
            this.set(id, newCount);
            this._operate(id, -subCount, tariff);
        } else {
            this.delete(id);
            this._operate(id, -oldCount, tariff);
        }
        newCount = undefined;
    }
    private _add (id: number, addCount: number, tariff: Tariff) : void {
        let oldCount: number | undefined = this.get(id);
        if (oldCount) {
            this._addExistence(id, oldCount, addCount, tariff);
            oldCount = undefined;
        } else {
            this.set(id, addCount);
            this._operate(id, addCount, tariff);
        }
    }
    private _sub (id: number, subCount: number, tariff: Tariff) : void {
        let oldCount: number | undefined = this.get(id);
        if (oldCount) {
            this._subExistence(id, oldCount, subCount, tariff);
            oldCount = undefined;
        }
    }
    private _set (id: number, count: number, tariff: Tariff) : void {
        this._operate(id, count - (this.get(id) || 0), tariff);
        this.set(id, count);
    }
    
    public toString (pre: string = "") : string {
        let arr: string[] = [];
        let item: [number, number] | undefined;
        for (item of this) {
            arr.push(`${encodeURIComponent(pre)}${item[0]}=${item[1]}`);
        }
        item = undefined;
        return arr.join("&");
    }
    public add (id: number, count: number, tariff: Tariff) : ElementSet {
        if (id > 0) {
            if (count > 0) {
                this._add(id, count, tariff);
            } else if (count < 0) {
                this._sub(id, -count, tariff);
            }
        }
        return this;
    }
    public sub (id: number, count: number, tariff: Tariff) : ElementSet {
        if (id > 0) {
            if (count > 0) {
                this._sub(id, count, tariff);
            } else if (count < 0) {
                this._add(id, -count, tariff);
            }
        }
        return this;
    }
    public update (ids: number[], counts: number[], tariff: Tariff,) : ElementSet {
        let index: number | undefined = ids.length - 1;
        for (; index >= 0; index--) {
            if (ids[index] > 0 && counts[index] > 0) {
                this._set(ids[index], counts[index], tariff);
            }
        }
        index = undefined;
        return this;
    }
    public clone (tariff: Tariff) : ElementSet {
        return new ElementSet(undefined, undefined, tariff, this);
    }
    public union (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let item: [number, number] | undefined;
        for (item of elementSet) {
            this._add(...item, tariff);
        }
        item = undefined;
        return this;
    }
    public cloneUnion (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let newElementSet = new ElementSet(undefined, undefined, tariff, this);
        let item: [number, number] | undefined;
        for (item of elementSet) {
            newElementSet._add(...item, tariff);
        }
        item = undefined;
        return newElementSet;
    }
    public intersection (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let item: [number, number] | undefined;
        let count: number | undefined;
        for (item of this) {
            count = elementSet.get(item[0]);
            if (count) {
                this._addExistence(...item, count, tariff);
            } else {
                this.delete(item[0]);
                this._operate(item[0], -item[1], tariff);
            }
        }
        count = undefined;
        item = undefined;
        return this;
    }
    public intersectionSub (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let item: [number, number] | undefined;
        let count: number | undefined;
        for (item of this) {
            count = elementSet.get(item[0]);
            if (count) {
                this._subExistence(...item, count, tariff);
            } else {
                this.delete(item[0]);
                this._operate(item[0], -item[1], tariff);
            }
        }
        count = undefined;
        item = undefined;
        return this;
    }
    public cloneIntersection (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let newElementSet = new ElementSet();
        let item: [number, number] | undefined;
        let count: number | undefined;
        for (item of this) {
            count = elementSet.get(item[0]);
            if (count) {
                newElementSet._addExistence(item[0], 0, item[1] + count, tariff);
            }
        }
        count = undefined;
        item = undefined;
        return newElementSet;
    }
    public cloneIntersectionSub (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let newElementSet = new ElementSet();
        let item: [number, number] | undefined;
        let count: number | undefined;
        let newCount: number | undefined;
        for (item of this) {
            count = elementSet.get(item[0]);
            if (count) {
                newCount = item[1] - count;
                if (newCount > 0) {
                    newElementSet._addExistence(item[0], 0, newCount, tariff);
                }
            }
        }
        newCount = undefined;
        count = undefined;
        item = undefined;
        return newElementSet;
    }
    public difference (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let item: [number, number] | undefined;
        for (item of elementSet) {
            this._sub(...item, tariff);
        }
        item = undefined;
        return this;
    }
    public cloneDifference (elementSet: ElementSet, tariff: Tariff) : ElementSet {
        let newElementSet = new ElementSet();
        let item: [number, number] | undefined;
        let count: number | undefined;
        let newCount: number | undefined;
        for (item of this) {
            count = elementSet.get(item[0]);
            if (count) {
                newCount = item[1] - count;
                if (newCount > 0) {
                    newElementSet._addExistence(item[0], 0, newCount, tariff);
                }
            } else {
                newElementSet._addExistence(item[0], 0, item[1], tariff);
            }
        }
        newCount = undefined;
        count = undefined;
        item = undefined;
        return newElementSet;
    }

    constructor (
        ids?: number[],
        counts?: number[],
        tariff?: Tariff,
        elementSet?: ElementSet,
    ) {
        if (elementSet) {
            super(elementSet);
            this._cost = elementSet._cost;
            this._value = elementSet._value;
        } else {
            super();
            this._cost = 0;
            this._value = 0;
            if (ids && counts && tariff) {
                let index: number | undefined = ids.length - 1;
                for (; index >= 0; index--) {
                    if (ids[index] > 0 && counts[index] > 0) {
                        this.set(ids[index], counts[index]);
                        this._operate(ids[index], counts[index], tariff);
                    }
                }
                index = undefined;
            }
        }
    }
}
