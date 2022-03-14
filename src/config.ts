export const network = "mumbai".toLowerCase();
export const Web3Sword_address = "0x14e438b4B95269f37CDCfa5d4c6B0920F840eA72".toLowerCase();
export const start_block = "25509712".toLowerCase();
export function getAll(): Map<string, string>  {
    let map = new Map<string, string>();
    map.set("network", network);
map.set("Web3Sword_address", Web3Sword_address);
map.set("start_block", start_block);
    return map;
}
export function getAllKeys(): string[] {
    return [
        "network",
"Web3Sword_address",
"start_block"
    ];
}
