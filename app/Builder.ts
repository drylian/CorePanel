import { exec } from '@yao-pkg/pkg'
import { Structurals } from './Classes/Structurals';
import { Package, ResourcesPATH } from './Structural';
import I18alt from './Controllers/Languages';
import { obfuscate } from 'javascript-obfuscator';
import fs from "fs/promises";
import esbuild from "esbuild";
import { Loggings } from 'loggings';
import ChildProcess from 'child_process';
import nodeExternalsPlugin from "esbuild-node-externals";
import _ from 'lodash';
import { glob } from 'glob';
import { dirCP, adirRE, dirEX, hashmd5, jsonsv, json, ajsonsv } from './Utils';
import os from 'os';
import { createHash } from 'crypto';
import path from 'path';

const core = new Loggings("Compilation");
interface BuildInfo {
    path: string
    platform: string
    arch: string
    size: string
    timeBuild: string
    hashMD5: string
    hashSHA: string
}
type BuildManifest = Record<string, BuildInfo>

interface BuilderConstructor {
    /**
     * Build another platforms, not limited in os.platform (win,linux)
     */
    cross?: ReturnType<typeof os.platform>[]
    /**
     * Directory of Typescript Resources
     */
    directory: string;
    /**
     * Outdir of build
     */
    outdir: string;
    /**
     * Plataforms of builds
     */
    platforms: Array<'linux' | 'alpine' | 'linuxstatic' | 'macos'>;
    /**
     * Archs of build
     */
    archs: Array<'x64' | 'arm64'>;
    /**
     * Node version of build
     */
    nodeVersion: '18' | '20';
    /**
     * Obfuscate build? (default:true)
     */
    obfuscate: boolean;
    /**
     * Make application build? (default:true)
     */
    pkgbuild: boolean;
    /**
     * Mode of builder (custom/default)
     */
    mode: string
    /**
     * Make Bundler of services (esbuild)
     */
    bundler: boolean
    /**
     * Debug Mode, show more logs
     */
    debug: boolean
}

class Builder {
    private options: BuilderConstructor;
    constructor(options: BuilderConstructor) {
        this.options = options;
    }

    /**
     * Format Bytes
     */
    public fbytes(bytes: number): string {
        if (bytes < 0) {
            return 'Invalid size';
        }
        const megabyte = 1024 * 1024;
        const gigabyte = 1024 * megabyte;
        if (bytes < megabyte) {
            return bytes + ' B';
        } else if (bytes < gigabyte) {
            return (bytes / megabyte).toFixed(2) + ' MB';
        } else {
            return (bytes / gigabyte).toFixed(2) + ' GB';
        }
    }

    /**
     * Copy dest/source
     */
    public async copy(source: string, destination: string) {
        try {
            await fs.mkdir(destination, { recursive: true });
            const files = await fs.readdir(source);

            for (const file of files) {
                const sourcePath = path.join(source, file);
                const destinationPath = path.join(destination, file);

                const stats = await fs.stat(sourcePath);

                if (stats.isDirectory()) {
                    await this.copy(sourcePath, destinationPath);
                } else {
                    await fs.copyFile(sourcePath, destinationPath);
                }
            }

            core.log(`Assets: [${source}].cyan-b::[${destination}].blue-b.`);
        } catch (ex) {
            const err = ex as InstanceType<typeof Error>
            core.error(`Error copying directory ${source}:`, err);
        }
    }

    /**
     * Clear Rest Trash of builds
     */
    public async clean(trashs: string[] = ["temp", this.options.outdir, `${this.options.directory}/Structurales.ts`]) {
        for (const folder of trashs) {
            if (await fs.access(folder).then(() => true).catch(() => false)) {
                core.log(`Deleting [${folder}].red-b ...`);
                await fs.rm(folder, { recursive: true });
            }
        }
    }

    /**
     * Prepares for Build progress
     */
    public async prepares() {
        await fs.mkdir(this.options.outdir + "/locals", { recursive: true });
        await this.languages();
        await Structurals.reads();
        await Structurals.file();
    }

    /**
     * Obfuscate code
     */
    public async obfuscate() {
        core.log('Starting Obfuscate...')
        const paths = await glob(["temp/**/*.js"]);
        const seed = Math.random()
        const ignored = ['temp\\Database'];
        for (const pather of paths) {
            if (!ignored.some(prefix => pather.startsWith(prefix))) {
                const fileData = await fs.readFile(pather);
                if (fileData === undefined) throw new Error(`An error occurred while trying to obfuscate the file: ${pather}`)
                const response = obfuscate(fileData.toString('utf-8'), {
                    optionsPreset: 'low-obfuscation',
                    log: this.options.debug ? true : false,
                    seed,
                    ignoreImports: true,
                    disableConsoleOutput: false
                })
                await fs.writeFile(pather, response.getObfuscatedCode(), 'utf8')
            }
        }
    }

    /**
     * Makes main langs.json , created using all languages files
     */
    public async languages() {
        const paths = await glob(["Languages/**/*.json"], { cwd: ResourcesPATH });
        for (const pather of paths) {
            const local = pather.split("\\").slice(1).join("/");
            const locale = local.replace(".json", "").replace(/[/\\]/g, ".");
            const data = _.set({}, locale, JSON.parse(await fs.readFile(ResourcesPATH + `/${pather}`, "utf-8")));
            I18alt.core = _.merge(I18alt.core, data);
        }
        await fs.writeFile(this.options.outdir + "/locals/langs.json", JSON.stringify(I18alt.core), "utf-8");
    }

    /**
     * Make Package.json of build
     */
    public async register() {
        const package_dev = Package;
        const realease = Date.now()
        const package_production = {
            name: "core-panel",
            version: `builded-${realease}`,
            main: this.options.bundler ? "./service.js" : `./src/Client.js`,
            license: "ARR",
            core_configs: {
                ...this.options,
                date: new Date(),
            },
            description: "Compilled Source of Core Panel",
            author: "Alternight",
            module: "CommonJS",
            dependencies: package_dev.dependencies
        }
        await fs.writeFile(this.options.outdir + "/package.json", JSON.stringify(package_production, null, 0), 'utf-8');
        await fs.writeFile("temp/package.json", JSON.stringify(package_production, null, 0), 'utf-8');

    }
    /**
     * Optimize Node_Modules
     */
    public async clearmodules(): Promise<void> {
        const removeModules = await glob([`${this.options.outdir}/node_modules/**/*`], {
            ignore: ['/**/*.js', '/**/*.json', '/**/*.cjs', '/**/*.node', '/**/*.yml', '/**/*.css','/boxicons/**/*']
        })

        core.log('\n\nRemoving useless files in node_modules...')

        for (const file of removeModules) {
            if ((await fs.stat(file)).isFile()) await fs.rm(file)
        }
    }

    /**
     * Makes pkg app
     */
    public async pkgbuild() {
        const args = [this.options.outdir, '--compress', 'Brotli', '--public-packages', '"*"', '--public']
        const builds: string[] = []
        const manifests: BuildManifest[] = []
        await ajsonsv(this.options.outdir + "/package.json", {
            bin: this.options.bundler ? "service.js" : `src/Client.js`,
            pkg: {
                scripts: [
                    "**/*.js",
                    "**/*.json",
                    "package.json"
                ],
                assets: [
                    "locals/**/*",
                    "Assets/**/*",
                    "node_modules/**/*.css",
                    "node_modules/**/*.js",
                    "node_modules/**/*.cjs",
                    "node_modules/**/*.json",
                    "node_modules/**/*.node",
                ]
            },
        })
        if (!this.options.bundler) await dirCP("./temp", this.options.outdir + "/src");

        if (!this.options.cross) {
            if (os.platform() !== 'win32') {
                for (const platform of this.options.platforms) {
                    for (const arch of this.options.archs) {
                        builds.push(`node${this.options.nodeVersion}-${platform}-${arch}`)
                    }
                }
            } else {
                for (const arch of this.options.archs) {
                    builds.push(`node${this.options.nodeVersion}-win-${arch}`)
                }
            }
        } else {
            for (const port of this.options.cross) {
                for (const arch of this.options.archs) {
                    builds.push(`node${this.options.nodeVersion}-${port}-${arch}`)
                }
            }
        }
        ChildProcess.execSync(`cd ${this.options.outdir}`, { stdio: "inherit" });

        for (const build of builds) {
            const startTime = Date.now()
            const nameSplit = build.split('-')
            const buildName = `./release/${Package.name}-${nameSplit[1]}-${nameSplit[2]}${nameSplit[1] === 'win' ? '.exe' : nameSplit[1] === 'macos' ? '.app' : ''}`
            const newArg: string[] = []

            if (dirEX(this.options.outdir + "/" + buildName)) await adirRE(this.options.outdir + "/" + buildName)
            if (dirEX(`./release/manifest-${nameSplit[1]}.json`)) await adirRE(this.options.outdir + `/release/manifest-${nameSplit[1]}.json`)

            newArg.push(...args, '-t', build, '-o', buildName)
            core.log('Starting Pkg Build...\n\n')
            await exec(newArg)

            const timeSpent = (Date.now() - startTime) / 1000 + 's'
            core.info(`Build | ${nameSplit[1]}-${nameSplit[2]} | ${timeSpent}`)

            const file = await fs.readFile(buildName)
            const hashMD5 = createHash('md5').update(file).digest('hex')
            const hashSHA = createHash('sha256').update(file).digest('hex')

            manifests.push({
                [nameSplit[1]]: {
                    path: buildName.replace('./release/', ''),
                    platform: nameSplit[1],
                    arch: nameSplit[2],
                    size: this.fbytes(file.byteLength),
                    timeBuild: timeSpent,
                    hashMD5,
                    hashSHA
                }
            })
            for (const manifest of manifests) {
                for (const [key, value] of Object.entries(manifest)) {
                    const values = [value]
                    if (dirEX(`./release/manifest-${key}.json`)) {
                        const existContent = JSON.parse(await fs.readFile(`./release/manifest-${key}.json`, { encoding: 'utf-8' })) as BuildInfo[]
                        values.push(...existContent)
                        console.log(values)
                    }
                    await fs.writeFile(`./release/manifest-${key}.json`, JSON.stringify(values, null, 4))
                }
            }
        }
    }

    /**
     * Makes bundle of services
     */
    public async bundler() {
        await esbuild.build({
            bundle: true,
            minify: true,
            entryPoints: {
                bundle: "./temp/Client.js",
            },
            outfile: this.options.outdir + '/service.js',
            jsx: "transform",
            format: "cjs",
            logLevel: this.options.debug ? "debug" : "silent",
            platform: "node",
            target: ["node20"],
            plugins: [nodeExternalsPlugin()],
        })
    }

    /**
     * Make build based in constructor informations
     */
    public async services() {
        core.log("Cleaning rest trash")
        await this.clean();
        await this.clean(['release']);
        await this.prepares();
        core.log("Compiling typescript");
        ChildProcess.execSync("tsc --project ./tsconfig.json && tsc-alias", { stdio: "inherit" });
        core.log("Typescript compilled successfully")
        core.log("Deleting deleting unnecessary files");
        await fs.rm("./temp/Initialization.js")
        await fs.rm("./temp/Builder.js")
        core.log("Copy assets files");
        await this.copy(this.options.directory + "/Assets", this.options.outdir + "/Assets")
        await this.copy(this.options.directory + "/Resources/Views", this.options.outdir + "/locals/Views")
        await fs.cp("./loggings.config.cjs", this.options.outdir + "/loggings.config.cjs")
        await fs.cp("./tailwind.config.cjs", this.options.outdir + "/tailwind.config.cjs")
        await fs.cp("./postcss.config.cjs", this.options.outdir + "/postcss.config.cjs")
        await this.register();
        if (this.options.obfuscate) {
            core.log("Starting code obfuscation")
            await this.obfuscate();
        }
        core.log("Npm install");
        ChildProcess.execSync(`cd ${this.options.outdir} && npm i`, { stdio: "inherit" });
        ChildProcess.execSync(`cd ..`, { stdio: "inherit" });
        await this.clearmodules();
        if (this.options.bundler) {
            core.log("Making bundler services")
            await this.bundler();
        }
        if (this.options.pkgbuild) {
            core.log("Making pkg Release")
            await this.pkgbuild();
        }
        core.log("Success Build code, exiting")
        process.exit(0)
    }
}

/**
 * CorePanel Builder
 * Service of Build Panel Service
 */
async function Initials() {
    const args = BuilderARGS(process.argv)
    // console.log(args)
    let build: InstanceType<typeof Builder>;
    if (args?.mode && args.mode === "default") {
        core.log("Starting build progress in Default mode")
        build = new Builder({
            directory: 'app',
            outdir: 'build',
            archs: ['x64', 'arm64'],
            platforms: ['linux'],
            nodeVersion: "20",
            obfuscate: true,
            pkgbuild: true,
            mode: "Default",
            bundler: true,
            debug: false,
            cross:["linux","win32"]
        })
    } else {
        build = new Builder({
            directory: args?.directory || 'app',
            outdir: args?.outdir || 'build',
            archs: args?.archs ? args?.archs : ['x64', 'arm64'],
            platforms: args?.platforms ? args?.platforms : ['linux'],
            nodeVersion: args?.nodeVersion || "20",
            obfuscate: Boolean(args?.obfuscate) || true,
            pkgbuild: Boolean(args?.pkgbuild) || true,
            mode: "Custom",
            bundler: Boolean(args?.bundler) || true,
            debug: args?.debug ? args?.debug : false,
            ...[args?.cross ? { cross: args?.cross } : {}]
        })
        core.log(`Starting build progress in Custom mode`)
    }
    await build.services();
}

void Initials();

/**
 * Builder Supported Args
 */
function BuilderARGS(args: string[]): BuilderConstructor {
    const options: Partial<BuilderConstructor> = {
        directory: '',
        outdir: '',
        platforms: [],
        archs: [],
        nodeVersion: '18',
        obfuscate: true,
        pkgbuild: true,
        cross: []
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith('--')) {
            const optionName = arg.slice(2);
            if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                const optionValue = args[i + 1];
                switch (optionName) {
                    case 'directory':
                        options.directory = optionValue;
                        break;
                    case 'outdir':
                        options.outdir = optionValue;
                        break;
                    case 'platforms':
                        options.platforms = optionValue.split(',') as BuilderConstructor['platforms'];
                        break;
                    case 'archs':
                        options.archs = optionValue.split(',') as BuilderConstructor['archs'];
                        break;
                    case 'node-version':
                        options.nodeVersion = optionValue as '18' | '20';
                        break;
                    case 'obfuscate':
                        options.obfuscate = optionValue === 'true';
                        break;
                    case 'pkgbuild':
                        options.pkgbuild = optionValue === 'true';
                        break;
                    case 'cross':
                        options.cross = optionValue.split(',') as BuilderConstructor['cross']
                        break;
                    default:
                        break;
                }
                i++;
            } else {
                switch (optionName) {
                    case 'obfuscate':
                        options.obfuscate = true;
                        break;
                    case 'debug':
                        options.debug = true;
                        break;
                    case 'pkgbuild':
                        options.pkgbuild = true;
                        break;
                    default:
                        break;
                }
            }
        }
    }
    // console.log(options)
    return options as BuilderConstructor;
}
