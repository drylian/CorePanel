import fs from "fs";
import lodash from "lodash";

function json<T>(local: string): T {
	let existingData: string;

	try {
		if (fs.existsSync(local) && local.endsWith(".json")) {
			existingData = fs.readFileSync(local, "utf-8");
		} else if (!local.endsWith(".json")) {
			return {} as T;
		} else {
			return {} as T;
		}
		if (!existingData) return {} as T;
		const parsedData: T = JSON.parse(existingData);
		return parsedData;
	} catch (ex) {
		const err = ex as InstanceType<typeof Error>
		console.error("Erro ao analisar o JSON:", err.message);
		return {} as T;
	}
}
export async function ajson<T>(local: string): Promise<T> {
	let existingData: string;

	try {
		if (fs.existsSync(local) && local.endsWith(".json")) {
			existingData = await fs.promises.readFile(local, "utf-8");
		} else if (!local.endsWith(".json")) {
			return {} as T;
		} else {
			return {} as T;
		}
		if (!existingData) return {} as T;
		const parsedData: T = JSON.parse(existingData);
		return parsedData;
	} catch (ex) {
		const err = ex as InstanceType<typeof Error>

		console.error("Erro ao analisar o JSON:", err.message);
		return {} as T;
	}
}

async function ajsonsv<Datatype>(local: string, data: Datatype, force= false) {
	try {
		let existingData: Datatype;

		// Verifica se o arquivo já existe
		if (fs.existsSync(local)) {
			// Se existir, lê o conteúdo do arquivo e o converte em objeto JSON
			const fileContent = fs.readFileSync(local, "utf-8");
			existingData = JSON.parse(fileContent);
		} else {
			// Se o arquivo não existir, cria um objeto vazio
			existingData = {} as Datatype;
		}

		// Mescla os dados existentes com os novos dados (mesclagem profunda)
		const mergedData = lodash.merge(existingData, data);

		// Converte o objeto mesclado em uma string JSON
		const jsonData = JSON.stringify(mergedData, null, 2); // O terceiro argumento define a formatação com espaços (2 espaços, por exemplo)
		if(force) {
			return await fs.promises.writeFile(local, JSON.stringify(data,null, 2), "utf-8");
		}
		// Escreve a string JSON no arquivo
		return await fs.promises.writeFile(local, jsonData, "utf-8");
	} catch (error) {
		console.error("Erro ao salvar o arquivo:" + local + " ,error :", error);
	}
}

function jsonsv<Datatype>(local: string, data: Datatype, force= false): void {
	try {
		let existingData: Datatype;

		// Verifica se o arquivo já existe
		if (fs.existsSync(local)) {
			// Se existir, lê o conteúdo do arquivo e o converte em objeto JSON
			const fileContent = fs.readFileSync(local, "utf-8");
			existingData = JSON.parse(fileContent);
		} else {
			// Se o arquivo não existir, cria um objeto vazio
			existingData = {} as Datatype;
		}

		// Mescla os dados existentes com os novos dados (mesclagem profunda)
		const mergedData = lodash.merge(existingData, data);

		// Converte o objeto mesclado em uma string JSON
		const jsonData = JSON.stringify(mergedData, null, 2); // O terceiro argumento define a formatação com espaços (2 espaços, por exemplo)
		if(force) {
			fs.writeFileSync(local, JSON.stringify(data,null, 2), "utf-8");
			return;
		}
		// Escreve a string JSON no arquivo
		fs.writeFileSync(local, jsonData, "utf-8");
	} catch (error) {
		console.error("Erro ao salvar o arquivo:" + local + " ,error :", error);
	}
}
export { json, jsonsv, ajsonsv };
