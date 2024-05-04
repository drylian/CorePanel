import chokidar from "chokidar";
import path from "path";
import { json } from "@/Utils";
import { ResourcesPATH } from "@/Structural";
import _ from "lodash";
import fs from "fs/promises";
import { glob } from "glob";
import { Console, LoggingsMessage } from "loggings";
import { Global } from "@/Configurations";
import I18alt from "@/Controllers/Languages";

function Core(type: string, ...args: LoggingsMessage[]) {
	return Console(type, "magenta", ...args);
}

export async function PreloadLangs() {
	if (Global['mode'].get.startsWith("dev")) {
		const paths = await glob(["Languages/**/*.json"], { cwd: ResourcesPATH });
		for (const pather of paths) {
			const local = pather.split("\\").slice(1).join("/");
			const locale = local.replace(".json", "").replace(/[/\\]/g, ".");
			const data = _.set({}, locale, JSON.parse(await fs.readFile(ResourcesPATH + `/${pather}`, "utf-8")));
			I18alt.core = _.merge(I18alt.core, data);
		}
	}
}
/**
 * Language metadata loads Watcher
 */
async function StructuralLanguageWatcher() {
	if (Global['mode'].get.startsWith("dev")) {
		/**
		 * Active Watcher for live langs
		 */
		const directoryToWatch = ResourcesPATH + "/Languages";
		const watcher = chokidar.watch(directoryToWatch, {
			persistent: true,
			// eslint-disable-next-line no-useless-escape
			ignored: /(^|[\/\\])\../, // Ignora arquivos ocultos (começando com ponto)
		});
		watcher.on("add", (filePath) => {
			if (path.extname(filePath) === ".json") {
				const locale = path.relative(directoryToWatch, filePath).replace(".json", "").replace(/[/\\]/g, ".");
				const data = _.set({}, locale.split("."), json(filePath));
				I18alt.core = _.merge(I18alt.core, data);
			}
		});
		watcher.on("change", (filePath) => {
			if (path.extname(filePath) === ".json") {
				const locale = path.relative(directoryToWatch, filePath).replace(".json", "").replace(/[/\\]/g, ".");
				const data = _.set({}, locale.split("."), json(filePath));
				const location = path
					.relative(directoryToWatch, filePath)
					.replace(".json", "")
					.replace(/[/\\]/g, " -> ");
				I18alt.core = _.merge(I18alt.core, data);
				Core("Lang", `[${location}].red modificado.`);
			}
		});
		watcher.on("unlink", (filePath) => {
			if (path.extname(filePath) === ".json") {
				const locale = path.relative(directoryToWatch, filePath).replace(".json", "").replace(/[/\\]/g, ".");
				const data = _.set({}, locale.split("."), json(filePath));
				const location = path
					.relative(directoryToWatch, filePath)
					.replace(".json", "")
					.replace(/[/\\]/g, " -> ");
				I18alt.core = _.merge(I18alt.core, data);
				Core("Lang", `[${location}].red deletado.`);
			}
		});
	} else {
		/**
		 * Production mode (Load Compilated langs)
		 */
		const LangCore = path.join(ResourcesPATH, "langs.json");
		const Language = await fs.readFile(LangCore, "utf8");
		I18alt.core = _.merge(I18alt.core, JSON.parse(Language));
	}
}
StructuralLanguageWatcher();