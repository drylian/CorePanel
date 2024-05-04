import fs from "fs/promises";
import { dirDEL, dirEX } from "./Folder";
import path from "path";
import { CurrentMode, RootPATH } from "@/Structural";

/**
 * Import Modules in dinamic Resources
 */
export async function importer(pather: string) {
    const file = path.join(RootPATH, pather) + (CurrentMode === "Typescript" ? ".ts" : ".js")
    const cache = path.join(RootPATH, pather) + "-" + Date.now() + (CurrentMode === "Typescript" ? ".ts" : ".js")
    if (dirEX(file)) {
        await fs.copyFile(file, cache);
        const module = await import(path.relative(__dirname, path.join(process.cwd(),cache)));
        dirDEL(cache);
        return module;
    }
}