
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

export function getWeekNumber(d:Date) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    let dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    let yearStart = +new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    let weekNo = Math.ceil((((d.valueOf() - yearStart) / 86400000) + 1) / 7)
    return weekNo
}

export function getWeekStart(d: Date) {
    const now = new Date(d)
    const numberdayweek = [6, 0, 1, 2, 3, 4, 5];
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - numberdayweek[now.getDay()])
}
export function getWeekEnd(d: Date) {
    const now = new Date(d)
    return new Date(now.getFullYear(), now.getMonth(), getWeekStart(now).getDate() + 6)
}

// 0 = janvier / 11 = decembre
export function getMonthFromNumber(m: number) {
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
    return months[m]
}