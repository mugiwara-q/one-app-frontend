
// Uppercase the first letter
export function UpperFirstLetter(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

// FROM FRENCH DDMMYYYY to ISO YYYY-MM-DD
export function ParseNumberToIsoDate(date: string): string {
    return date.replace(/(\d\d)(\d\d)(\d\d\d\d)/, "$3-$2-$1") // ISO DATE FORMAT
}

// FROM ISO YYY-MM-DD to FRENCH NUMBER DDMMYYYY
export function ParseIsoDateToNumber(date: string): string {
    return date.replace(/(\d\d\d\d)-(\d\d)-(\d\d)/, "$3$2$1") // ISO DATE FORMAT
}

export function EmptyObject(object: any): any {
    for (const key in object)
        object[key] = "";
    return object
}

export function CopyToClipBoard(text: string) {
    navigator.clipboard.writeText(text)
}
