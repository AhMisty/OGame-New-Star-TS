const CheckHeaderLogin = (header: string[]): boolean => {
    let index: number | undefined = 0;
    let length: number | undefined = header.length;
    for (; index < length; index++) {
        if (header[index].toUpperCase() == "LOCATION" && header[++index].includes("game.php")) {
            return true;
        }
    }
    length = undefined;
    index = undefined;
    return false;
}

export default CheckHeaderLogin
