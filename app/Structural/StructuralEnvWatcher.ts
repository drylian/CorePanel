import chokidar from "chokidar";
import fs from "fs";
import dotenv from "dotenv";
import { Global } from "@/Configurations";
import { Loggings } from "loggings";
import _ from "lodash";
const core = new Loggings("Env", "blue", { register: false })
/**
 * Structural Env updates
 */
async function StructuralEnvWatcher() {
	const configWatcher = chokidar.watch("./.env");
	configWatcher.on("change", () => {
		const envFileContent = fs.readFileSync(".env", "utf8");
		const envConfig: Record<string, string> = dotenv.parse(envFileContent);
		for (const key in Global) {
			const config = Global[key as keyof typeof Global];
			if (!config?.options) return
			try {
				if (envConfig[config.options.env] !== undefined && String(config.get) !== envConfig[config.options.env]) {
					if (!_.isEqual(config.get, config.options.type(envConfig[config.options.env]))) {
						core.log(`[${config.options.env}].green-b Atualizado`)
						config.set(envConfig[config.options.env] as never)
					}
				}
			} catch (e) {
				core.warn(`Erro ao tentar setar [${config.options.env}].red-b, verifique se o env está correto`)
			}
		}
	});
}
StructuralEnvWatcher();
