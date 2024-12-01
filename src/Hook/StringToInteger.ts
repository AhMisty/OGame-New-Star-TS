const StringToInteger = (string: string) : number => parseInt(string?.replaceAll(".", "")) | 0;

export default StringToInteger
