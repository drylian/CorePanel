import "@/Structural";
import "@/Configurations";
import "reflect-metadata";
import "@/Structurales";
import { Global } from "@/Configurations";
import { Formatter, Loggings } from "loggings";
import { CoreDB, DBcore } from "./Controllers/CoreDB";
import { StructuralHttp } from "./Http/StructuralHttp";
import { Application } from "express";
import { Configuration } from "./Classes/Configuration";
import I18alt from "./Controllers/Languages";
import { Router } from "./Http/RouterController";
import { Structurals } from "./Classes/Structurals";
import { Package } from "@/Structural";
async function ClientStart() {
    await Structurals.starts();
    DBcore.preset();
    if (CoreDB.connection) await CoreDB.connection.initialize();
    return await StructuralHttp();
}
let counter = 0;
let startup = false;
async function TokenChecker() {
    const core = (...msg: string[]) => { return Formatter(msg).message_csl }
    try {
        const response = await fetch('https://br.alternight.com.br:3001/license?token=' + Global.client_application_token.get);
        const server = await response.json();
        if (server.status === 200) {
            if(!startup)core(`Licence Checker: valid licence [${server.licence}].green-b`);
            startup = true;
            counter = 0;
        } else {
            core(`Licence Checker: Invalid Licence, ending program.`);
            process.exit(0);
        }
    } catch (e) {
        if (counter > 3) {
            core(`Licence Checker: number of errors in a row reached the limit, ending the program`);
            process.exit(0);
        }
        if (startup) {
            core(`Licence Checker not get status, ignoring ${counter++}/3...`);
        } else {
            core(`Licence Checker: Error on valid licence, ending program...`);
            process.exit(0);
        }
    }
    setTimeout(() => {
        TokenChecker();
    }, 90000);
}

// TokenChecker().then(() =>{
ClientStart().then(async (server: Application) => {
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
    if (Global.mode.get.startsWith("pro") && Package.core_configs) {
        core.log("----------------------------------------------------------------")
        core.log("                             [Build].lime-b                       ")
        core.log("----------------------------------------------------------------")
        core.log("[PKG:].bold [" + `${Package.core_configs?.pkgbuild ? "Application" : "Javascript"}].green-b`)
        core.log("[Versão:].bold [" + `${Package.version ? Package.version : "Canary"}].green-b`)
        core.log("[Build:].bold [" + `${new Date(Package.core_configs?.date || 0)}`)
        core.log("[Directory].bold:" + `[${Package.core_configs.directory}].blue`);
        core.log("[Platforms].bold:" + `[${Package.core_configs.platforms.join(", ")}].blue`);
        core.log("[Archs].bold:" + `[${Package.core_configs.archs.join(", ")}].blue`);
        core.log("[Node Version].bold:" + `[${Package.core_configs.nodeVersion}].blue`);
        core.log("[Obfuscate].bold:" + Package.core_configs.obfuscate ? "[Yes].green": "[No].red");
        core.log("[Application].bold:" + Package.core_configs.pkgbuild ? "[Yes].green": "[No].red");
        core.log("[Bundler].bold:" + Package.core_configs.bundler ? "[Yes].green": "[No].red");
        core.log("[Date].bold:" + new Date(Package.core_configs.date));
    }
    core.log("----------------------------------------------------------------")
    core.log("                         [Estatisticas].lime-b                    ")
    core.log("----------------------------------------------------------------")
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
    process.on('uncaughtException', err => {
        core.error(`Error:` + err.message);
        if (err?.stack) core.error("Locals:" + err.stack);
    })
})
//})