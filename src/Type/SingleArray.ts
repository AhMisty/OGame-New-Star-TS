type SingleArray<N extends number, T, R extends T[] = []> = R['length'] extends N ? [...R, ...T[]] : SingleArray<N, T, [T, ...R]>;

export default SingleArray
