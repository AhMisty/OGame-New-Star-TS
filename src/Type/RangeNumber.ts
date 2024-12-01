type Enumerate<T extends number, R extends number[] = []> = R['length'] extends T ? R[number] : Enumerate<T, [R['length'], ...R]>
type RangeNumber<Min extends number, Max extends number> = Exclude<Enumerate<Max>, Enumerate<Min>>

export default RangeNumber