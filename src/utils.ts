export function copyArrayElements<T>(src: T[], srcPos: number, dest: T[], destPos: number, length: number) {
    for (var i = 0; i < length; ++i) {
        dest[destPos + i] = src[srcPos + i];
    }
}

export function copyArray<T>(src: T[]) {
    return src.slice(0);
}

export function fromJSON(obj: any, state: any) {
    for (var i = 0; i < obj.JSON_PROPERTIES.length; i++) {
        obj[obj.JSON_PROPERTIES[i]] = state[obj.JSON_PROPERTIES[i]];
    }
}

export function toJSON(obj: any) {
    var state: any = {};
    for (var i = 0; i < obj.JSON_PROPERTIES.length; i++) {
        state[obj.JSON_PROPERTIES[i]] = obj[obj.JSON_PROPERTIES[i]];
    }
    return state;
}