import { RootPATH } from "@/Structural";
import express from "express";
import { glob } from "glob";
import path from "path";
import { Router } from "./RouterController";
import { Loggings } from "loggings";
import { Authorization } from "./Controllers/Authorization";
import { Etalization } from "@/Classes/Etalization";
import I18alt from "@/Controllers/Languages";
import cookieParser from "cookie-parser";
import { Global } from "@/Configurations";

/**
 * Function responsible for loading all routes from the server
 */
export async function StructuralHttp() {
    const server = express();
    const i18 = new I18alt();
    server.use(cookieParser(Global.signature.get));
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
    server.use("/assets", express.static(RootPATH + "/Assets"));
    server.use("/assets", express.static("./node_modules/boxicons/"));

    /**
     * Priority Middlewares
     */
    const PriorityMiddlewares = Router.middlewares
        .filter(item => item.hasOwnProperty('priority'))
        .sort((a, b) => (a as { priority: number }).priority - (b as { priority: number }).priority);

    for (const isolated of PriorityMiddlewares) {
        if (isolated.priority) {
            server[isolated.method](isolated.path, async (req, res, next) => {
                const core = new Loggings("Http", "silver", {
                    format:`[{status}] [{hours}:{minutes}:{seconds}].gray [Middleware:${isolated.name}].cyan-b {message}`,
                    register_locale_file: `{register_dir}/{title}/${isolated.name}/{status}`
                })
                try {
                    isolated.run({ req, res, next }, i18, core)
                } catch (ex) {
                    const err = (ex as InstanceType<typeof Error>)
                    core.error(`[Locale].red:${isolated.dir} \n [Cause].red:${err.cause ?? "idk"} \n [Message].red: ${err.message} \n Stack:${err.stack ?? "idk"}`)
                    if (!res.headersSent) {
                        res.status(500).json({ code: err.name || "MiddlewareRequestError", status: 500, message: "Error when trying to process the accessed route, please try again later", timestamp: Date.now() })
                    }
                }
            })
        }
    }

    /**
     * Commum Middlewares
     */
    for (const isolated of Router.middlewares) {
        if (!isolated?.priority) {
            server[isolated.method](isolated.path, async (req, res, next) => {
                const core = new Loggings("Http", "silver", {
                    format:`[{status}] [{hours}:{minutes}:{seconds}].gray [Middleware:${isolated.name}].cyan-b {message}`,
                    register_locale_file: `{register_dir}/{title}/${isolated.name}/{status}`
                })
                try {
                    isolated.run({ req, res, next }, i18, core)
                } catch (ex) {
                    const err = (ex as InstanceType<typeof Error>)
                    core.error(`[Locale].red:${isolated.dir} \n [Cause].red:${err.cause ?? "idk"} \n [Message].red: ${err.message} \n Stack:${err.stack ?? "idk"}`)
                    if (!res.headersSent) {
                        res.status(500).json({ code: err.name || "MiddlewareRequestError", status: 500, message: "Error when trying to process the accessed route, please try again later", timestamp: Date.now() })
                    }
                }
            })
        }
    }

    /**
     * Server Routes (Api)
     */
    for (const isolated of Router.all) {
        server[isolated.method](isolated.path, async (req, res, next) => {
            const core = new Loggings("Http", "silver", {
                format:`[{status}] [{hours}:{minutes}:{seconds}].gray [Route:${isolated.name}].cyan-b {message}`,
                register_locale_file: `{register_dir}/{title}/${isolated.name}/{status}`
            })
            try {
                if (isolated?.permission && isolated?.permission !== undefined) {
                    const Auth = await Authorization(req, res, isolated);
                    if (Auth.response === "OK") {
                        isolated.run({ req, res, next }, i18, core)
                    } else {
                        res.status(Auth.status).json({ code: Auth.code, status: Auth.status, message: Auth.response, timestamp: Date.now() })
                    }
                } else {
                    isolated.run({ req, res, next }, i18, core)
                }
            } catch (ex) {
                const err = (ex as InstanceType<typeof Error>)
                core.error(`[Locale].red:${isolated.dir} \n [Cause].red:${err.cause ?? "idk"} \n [Message].red: ${err.message} \n Stack:${err.stack ?? "idk"}`)
                if (!res.headersSent) {
                    res.status(500).json({ code: err.name || "RouteRequestError", status: 500, message: "Error when trying to process the accessed route, please try again later", timestamp: Date.now() })
                }
            }
        })
    }

    /**
     * Views Routes and Load React Page
     */
    server.get("*", (req, res) => {
        console.log(req._parsedUrl.pathname)
        const html = new Etalization();
        html.send(req, res, i18)
    })

    return server
}