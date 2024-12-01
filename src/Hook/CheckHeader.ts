const CheckHeader = (header: string[]): boolean => {
    let index: number | undefined = 0;
    let length: number | undefined = header.length;
    for (; index < length; index++) {
        if (header[index].toUpperCase() == "LOCATION" && header[++index].includes("index.php?code=")) {
            length = undefined;
            index = undefined;
            return false;
        }
    }
    length = undefined;
    index = undefined;
    return true;
}

export default CheckHeader
