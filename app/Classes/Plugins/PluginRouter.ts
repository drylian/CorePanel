import { Loggings } from "loggings";
import { NextFunction, Request, Response } from "express";

import { Permissions } from "@/Database/Models/Users";
import I18alt from "@/Controllers/Languages";
import { PluginLoader } from "./PluginLoader";

/**
 * Methods of Route
 */
export enum ExpressMethods {
    Get = "get",
    Post = "post",
    Put = "put",
    Delete = "delete",
}

/**
 * Methods of Middlewares
 */
export enum MiddlewareMethods {
    Get = "get",
    Post = "post",
    Put = "put",
    Delete = "delete",
    Use = "use"
}
/**
 * Auth types of Dashboard
 */
export enum AuthenticateTypes {
    Guest = "Guest",
    Cookie = "Cookie",
    Token = "Admin-Bearer",
    ClientToken = "Bearer",
    FullAuthAccess = "AuthAccess",
    FullAccess = "AllAccess",
}

type ExpressConfigurations = {
    req: Request;
    res: Response;
    next: NextFunction;
};

export type RouterConfigurations = {
    /**
     * Plugin loader
     */
    loader: InstanceType<typeof PluginLoader>;
    /**
     * Route Name used
     */
    name:string
    /**
     * use client: or admin: to route specific admin or client routes, if not used it will be considered /plugins
     * example
     * client:/create would return /client/<plugin.name>/create
     * admin:/manager would return /admin/<plugin.name>/manager
     */
    path: string;
    /**
     *Permission required to access this route
     */
    permission?: typeof Permissions[keyof typeof Permissions];
    /**
     * Type of Access allowed [Cookie, Token, and ClientToken]
     */
    type: Array<AuthenticateTypes>;
    /**
     * Type of route used, GET,PUT,POST,DELETE
     */
    method: ExpressMethods;
    /**
     * Router Function
     * @param express Request,Response,NextFunction do express
     * @param core Log Console
     */
    run(express: ExpressConfigurations, i18n: InstanceType<typeof I18alt>, core: InstanceType<typeof Loggings>): Promise<void> | void;
};

/**
 * Router of Plugin
 */
export class PluginRouter {
    public static all: RouterConfigurations[] = [];
    public static readonly Methods = ExpressMethods;
    public static readonly Types = AuthenticateTypes;
    public options:RouterConfigurations
    constructor(options: RouterConfigurations) {
        let type;
        if ((options as RouterConfigurations).type.includes(AuthenticateTypes.FullAuthAccess)) {
            type = [AuthenticateTypes.Cookie, AuthenticateTypes.Token, AuthenticateTypes.ClientToken];
        } else if ((options as RouterConfigurations).type.includes(AuthenticateTypes.FullAccess)) {
            type = [AuthenticateTypes.Cookie, AuthenticateTypes.Token, AuthenticateTypes.ClientToken, AuthenticateTypes.Guest];
        } else {
            type = (options as RouterConfigurations).type;
        }
        this.options = {
            ...options,
            type,
        };
        options.loader.routes.push(this);
    }
}
