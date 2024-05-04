/**
 * Ifs Logics
 * @param args 
 * @returns 
 */
export function NotHave(...args: string[]) {
    for (const arg of args) {
        if (!arg) {
            return true;
        }
    }
    return false;
}

export function IsEqual(value: string, expect: string[]) {
    for (const arg in expect) {
        if (value === arg) return true
    }
    return false;
}

export function Randow(num: number): number {
    return Math.floor(Math.random() * num);
}