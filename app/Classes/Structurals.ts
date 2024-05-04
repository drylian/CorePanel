import { Global } from "@/Configurations";
import { CurrentMode, RootPATH } from "@/Structural";
import { gen } from "@/Utils";
import fs from "fs/promises";
import { glob } from "glob";
import path from "path"
const CoreDIR = path.join(RootPATH);

interface StructuralContructor {
    name: string,
    path: string[],
    cwd?: string,
    exec?: (options: StructuralContructor, filedata: any) => Promise<void> | void
    run?: (options: StructuralContructor) => Promise<void> | void
}
/**
 * Structurals Controller of Panel
 */
export class Structurals {
    static all: StructuralContructor[] = []
    constructor(options: StructuralContructor) {
        Structurals.all.push(options)
    }

    /**
     * Read Structurals Dir in development in production read Structurales.ts
     */
    static async reads() {
        if (CurrentMode === "Typescript") {
            const paths = await glob("Structural/**/*.{ts,js}", { cwd: CoreDIR });
            for (const pather of paths) {
                const local = path.relative(RootPATH, path.join(process.cwd(), pather))
                await import(local)
            }
        }
    }

    /**
     * Import Development Resources, in production not have function and return void
     */
    static async imports() {
        if (CurrentMode === "Typescript") {
            for (const key in Structurals.all) {
                const Structure = Structurals.all[key];
                const paths = await glob(Structure.path, { cwd: Structure.cwd ?? CoreDIR });
                for (const pather of paths) {
                    const local = path.relative(RootPATH, path.join(process.cwd(), pather))
                    if (Structure.exec) {
                        const modular = await import(local);
                        await Structure.exec(Structure, modular)
                    } else {
                        await import(local);
                    }
                }
            }
        }
    }

    /**
     * Makes Structurales.ts. used in build
     */
    static async file() {
        let file = `import { Structurals } from "@/Classes/Structurals";\n`;
        file += "/**\n * This file is generated of Structurals\n */\n";
        const paths = await glob("Structural/**/*.{ts,js}", { cwd: CoreDIR });
        for (const pather of paths) {
            const local = path.join(path.relative(process.cwd(), path.join(pather)))
            file += `import "./${local.replace(/\.ts$/, '').replaceAll("\\", "/")}";\n`;
        }
        file += "async function Structurales () {\n";
        file += "   /**\n    * Childrens of Structures\n    */\n\n";

        for (const key in Structurals.all) {
            const Structure = Structurals.all[key]
            const paths = await glob(Structure.path, { cwd: Structure.cwd ?? CoreDIR });
            file += `   // Childrens of Structure named ${Structure.name}\n`;
            if (Structure.exec) file += `   const Structural${Structure.name} = Structurals.all[${key}]\n`;
            for (const pather of paths) {
                const local = path.relative(process.cwd(), path.join(process.cwd(), pather))
                if (pather.endsWith("index.ts")) continue;
                const generic = gen(12);
                if (Structure.exec) {
                    file += `   const g${generic} = await import("./${local.replace(/\.ts$/, '').replaceAll("\\", "/")}");\n`;
                    file += `   if(Structural${Structure.name} && Structural${Structure.name}?.exec) await Structural${Structure.name}.exec(Structural${Structure.name},g${generic});\n`;

                } else {
                    file += `   await import("./${local.replace(/\.ts$/, '').replaceAll("\\", "/")}");\n`;
                }
            }
            file += `\n`;
        }
        file += "} \nvoid Structurales();"
        await fs.writeFile(path.join(CoreDIR, "Structurales.ts"), file)
    }

    /**
     * Start Services of structurals
     */
    static async starts() {
        await Structurals.reads();
        await Structurals.imports();
        for (const key in Structurals.all) {
            const Structure = Structurals.all[key];
            if (Structure.run) {
                await Structure.run(Structure);
            }
        }
    }
}