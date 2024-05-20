import { Request, Response } from "express";
import pathe from "path";
import { Loggings } from "loggings";
import { Global } from "@/Configurations";
import I18alt from "@/Controllers/Languages";
import { ResourcesPATH, RootPATH } from "@/Structural";
import { Eta } from "eta";
import { dirEX, gen } from "@/Utils";
import { GetPermission } from "@/Database/Models/Users";
interface OptionsTypes {
    title?: string,
    alert?: string,
    path?: string,
    title_args?: object,
    alert_type?: "info" | "error" | "success" | "warning",
}
interface Routertype {
    path: string;
    children: any;
    permission?: number;
};
const ETA_INDEX = pathe.join(ResourcesPATH, "Views", "Index.eta")
const eta = new Eta({ views: pathe.dirname(ETA_INDEX) })

/**
 * Router of Etalization, use it.Router(URL,routes)
 * @param url URL 
 * @param routes routes of Router
 * @returns 
 */
export function Router(url: InstanceType<typeof URL>, Routes: Routertype[]) {
    const path = url.pathname;
    if (!path) return null;
    const result = [];
    for (const route of Routes) {
        let regexPattern = '^' + route.path.replace("/**", "").replace(/:\w+/g, '([^\\/]+)') + '\\/?$';
        const match = path.match(new RegExp(regexPattern));
        if (match || path === route.path) {
            const params: Record<string, string | undefined> = {};
            const keys = route.path.match(/:(\w+)/g) || [];
            keys.forEach((key, index) => {
                params[key.substring(1)] = match ? match[index + 1] : undefined;
            });
            result.push({
                path: route.path,
                children: route.children,
                permission: route.permission ? route.permission : undefined,
                params: params
            });
        } else if (route.path.endsWith("**") && path.startsWith(route.path.replace("/**", ""))) {
            result.push({
                path: route.path,
                children: route.children,
                permission: route.permission ? route.permission : undefined,
            });
        }
    }
    return result[0];
}
/**
 * Eta Main Controller class
 */
export class Etalization {
    private options: OptionsTypes
    private core: InstanceType<typeof Loggings>
    private metadata: object
    private eta: InstanceType<typeof Eta>
    constructor() {
        this.eta = eta
        this.core = new Loggings("Views", "orange")
        this.options = {};
        this.metadata = {};
    }

    /**
     * Add Aditional configurations of eta file
     */
    public meta<T extends {}>(options: T) {
        this.metadata = options
    }

    /**
     * Set Title of page
     */
    public title(str: string, args?: object) {
        this.options.title = str
        if (args) this.options.title_args = args
    }

    /**
     * Success Alert message
     */
    public sus(str: string) {
        this.options.alert = str
        this.options.alert_type = "success"
    }

    /**
     * Success Alert message
     */
    public log(str: string) {
        this.options.alert = str
        this.options.alert_type = "info"
    }

    /**
     * Error Alert message
     */
    public err(str: string) {
        this.options.alert = str
        this.options.alert_type = "error"
    }

    /**
     * Warning Alert message
     */
    public war(str: string) {
        this.options.alert = str
        this.options.alert_type = "warning"
    }

    /**
     * Makes Etalization html and send
     */
    async send(req: Request, res: Response, i18n: InstanceType<typeof I18alt>) {
        try {
            const html = await this.eta.renderAsync("Index.eta", {
                ...this.options, Router, req, res, Global, i18n, gen, GetPermission, ...this.metadata
            });
            if (!res.headersSent) res.status(res.statusCode || 200).send(html)
        } catch (e) {
            this.core.error((e as InstanceType<typeof Error>).stack ?? "idk")
            try {
                const html = await this.eta.renderAsync("Index.eta", {
                    ...this.options, Router, req, res, Global, gen, GetPermission, i18n, HasERROR: true, error: e
                });
                res.status(res.statusCode || 200).send(html)
            } catch (e) {
                this.core.error("Fatal:", (e as InstanceType<typeof Error>).stack ?? "idk")
                const html = this.eta.render("Errors/Fatal", {
                    ...this.options, req, Global, i18n
                })
                res.status(500).send(html)
            }
        }
    }
}
