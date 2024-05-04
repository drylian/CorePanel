import chokidar from "chokidar";
import { dirEX } from "@/Utils";
import path from "path";
import { Loggings } from "loggings";
import { exec } from "child_process";
import { RootPATH } from "@/Structural";
import { Global } from "@/Configurations";

const core = new Loggings("Tailwind", "blue");

/**
 * Compile the tailwind.css
 */
const Compiler = async () => {
	try {
		const comando = `tailwindcss -i ${RootPATH}/Assets/css/main.css -o ${RootPATH}/Assets/css/tailwind.css --watch`;

		exec(comando, (error, stdout, stderr) => {
			if (error) {
				core.error(`Erro ao executar o comando: ${error.message}`);
				return;
			}
			if (stderr) {
				core.error(`Erro na execução: ${stderr}`);
				return;
			}
			core.log(`Saída do comando:\n${stdout}`);
		});
	} catch (ex) {
		const error = ex as InstanceType<typeof Error>
		core.error("Erro ao recompilar o Tailwind CSS:", error);
	}
};
const ProductionTailwind = async () => {
	try {
		const comando = `tailwindcss -i ${RootPATH}/Assets/css/main.css -o ${RootPATH}/Assets/css/tailwind.css`;

		exec(comando, (error, stdout, stderr) => {
			if (error) {
				core.error(`Erro ao executar o comando: ${error.message}`);
				return;
			}
			if (stderr) {
				core.error(`Erro na execução: ${stderr}`);
				return;
			}
			core.log(`Saída do comando:\n${stdout}`);
		});
	} catch (ex) {
		const error = ex as InstanceType<typeof Error>
		core.error("Erro ao recompilar o Tailwind CSS:", error);
	}
};
async function StructuralTailwind() {
	if (!dirEX(path.join(RootPATH, "/Assets/css/tailwind.css"))) {
		await ProductionTailwind();
	}
	if (Global.mode.get.startsWith("dev")) {
		core.info("Aplicação em modo desenvolvimento, ativando tailwind Auto Rebuild");
		const configWatcher = chokidar.watch("./tailwind.config.cjs");
		configWatcher.on("change", () => {
			core.info("tailwind.config.cjs foi alterado. Rebuildando o Tailwind CSS...");
			Compiler();
		});
		Compiler();
	}
}
StructuralTailwind();