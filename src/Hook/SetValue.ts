import Response from "../Type/Response.ts"
import StringToInteger from "./StringToInteger.ts"

const SetValue = (
    target: any,
    key: number | string,
    isNumberValue: boolean,
    response: Response,
    start: string,
    end: string,
    obj: {index: number} = {index: 0}
): boolean => {
    let startIndex: number | undefined = response.body.indexOf(start, obj.index);
    if (startIndex < 0) {
        startIndex = undefined;
        return false;
    }
    let endIndex: number | undefined = response.body.indexOf(end, startIndex + start.length);
    if (endIndex < 0) {
        startIndex = undefined;
        endIndex = undefined;
        return false;
    }
    obj.index = endIndex + end.length;
    if (isNumberValue) {
        target[key] = StringToInteger(response.body.slice(startIndex + start.length, endIndex));
    } else {
        target[key] = response.body.slice(startIndex + start.length, endIndex);
    }
    return true;
}

export default SetValue
