import "@/Structural";
import "@/Configurations";
import "reflect-metadata";
import {
	Package,
	PreloadLangs,
} from "@/Structural";
import { Global } from "@/Configurations";
import { Loggings } from "loggings";
import { CoreDB, DBcore } from "./Controllers/CoreDB";
import { StructuralHttp } from "./Http/StructuralHttp";
import { Application } from "express";
import { Configuration } from "./Classes/Configuration";
import I18alt from "./Controllers/Languages";
import { Router } from "./Http/RouterController";
import User, { Permissions } from "./Database/Models/Users";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import Activities from "./Database/Models/Activities";
import { Structurals } from "./Classes/Structurals";
async function Development() {
	const saltRounds = 10;
	const salt = bcrypt.genSaltSync(saltRounds);
	const hashedPassword = bcrypt.hashSync("admin", salt);
	const uuid = v4();
	const user = User.create({
		lang: I18alt.live.lg,
		username:"admin",
		email:"admin@gmail.com",
		password: hashedPassword,
		permission:Permissions.Owner,
		uuid: uuid,
	});
	await user.save();
	Activities.sys("Criou o usuário " + user.username)
}
/**
 * Load Structural Configurations
 */
async function BasementConfigurations() {
	await PreloadLangs();
	await Structurals.starts();
	DBcore.preset();
	if (CoreDB.connection) await CoreDB.connection.initialize();
	return await StructuralHttp();
}

BasementConfigurations().then(async (server: Application) => {
	const core = new Loggings("Main", "maroon")
	server.listen({
		host: "0.0.0.0",
		port: Global.port.get,
	})
	const uptimeInSeconds = process.uptime();
	const days = Math.floor(uptimeInSeconds / 86400);
	const hours = Math.floor(uptimeInSeconds / 3600) % 24;
	const minutes = Math.floor(uptimeInSeconds / 60) % 60;
	const seconds = Math.floor(uptimeInSeconds) % 60;
	const Uptime = `${days > 0 ? days + "d " : ""}${hours > 0 ? hours + "h " : ""}${minutes > 0 ? minutes + "m " : ""
		}${seconds > 0 ? seconds + "s " : "0s"}`;
	core.log("")
	core.log("	[░█▀▀ ░█▀█ ░█▀▄ ░█▀▀].blue      [░█▀█ ░█▀█ ░█▄ █ ░█▀▀ ░█].blue")
	core.log("	[░█   ░█░█ ░█▀▄ ░█▀▀].blue  ▀▀▀ [░█▀▀ ░█▀█ ░█ ▀█ ░█▀▀ ░█].blue")
	core.log("	[░▀▀▀ ░▀▀▀ ░▀░▀ ░▀▀▀].blue      [░▀   ░▀ ▀ ░▀  ▀ ░▀▀▀ ░▀▀▀].blue")
	core.log("")
	core.log("")
	core.log("----------------------------------------------------------------")
	core.log("                         [Estatisticas].lime-b                    ")
	core.log("----------------------------------------------------------------")
	core.log("[Versão:].bold [" + `${Package.version ? Package.version : "Canary"}].green-b`)
	core.log("[Modo:].bold " + `${Global.mode.get.startsWith("pro") ? `[Produção].purple-b` : "[Desenvolvimento].magenta-b"}`)
	core.log("[Uptime de iniciação:].bold " + `[${Uptime}].blue-b`)
	core.log(`[Struturas Carregadas:].bold [${Structurals.all.length}].purple-b`);
	core.log(`[Linguagem Padrão:].bold [${I18alt.live.language}].cyan-b`);
	core.log(`[Envs Carregados:].bold [${Configuration.envs.length}].purple-b`);
	core.log(`[Middlewares Carregados:].bold [${Router.middlewares.length}].purple-b`);
	core.log(`[Rotas Carregadas:].bold [${Router.all.length}].purple-b`);
	core.log(`[Iniciado:].bold [${Global.url.get}:${Global.port.get}].purple-b`)
	core.log("----------------------------------------------------------------")
	core.log("                    [Principais  dependencias].lime-b                    ")
	core.log("----------------------------------------------------------------")
	core.log("[Controlador Backend].bold [Express].green-b [:].bold " + `[${Package?.dependencies?.express}].blue-b`)
	core.log("")
	if (Global.mode.get.startsWith("pro")) {
		process.on('uncaughtException', err => {
			core.error(`Error:` + err.message);
			if (err?.stack) core.error("Locals:" + err.stack);
		})
	} else {
		await Development();
	}
})