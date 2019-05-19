

export const formatAsCodeBlock = (text:string):string => {
    if(text.endsWith("\n"))
        return "```\n" + text + "```";
    else
        return "```\n" + text + "\n```";
}

export const putFirstLetterToUpperCase = (string:string):string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}