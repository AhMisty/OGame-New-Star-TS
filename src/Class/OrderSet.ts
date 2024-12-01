import Order from './Order.ts'

export default class OrderSet extends Map<number, Order> {
    public clone () : OrderSet {
        return new OrderSet(this);
    }
    public sub (orderSet: OrderSet) : OrderSet {
        let order: [number, Order] | undefined;
        for (order of orderSet) {
            this.delete(order[0]);
        }
        order = undefined;
        return this;
    }

    constructor (orderSet?: OrderSet) {
        super(orderSet);
    }
}