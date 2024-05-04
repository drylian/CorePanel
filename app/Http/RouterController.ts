import { Loggings } from "loggings";
import { NextFunction, Request, Response } from "express";

import { Permissions } from "@/Database/Models/Users";
import I18alt from "@/Controllers/Languages";

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
     * Router identifier, used in logs, html and lang,
     * Add the name argument to /routes/names.json in the langs file
     */
    name: string;
    /**
     * Absolute dirfile locale
     */
    dir: string;
    /**
     * Router Path
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
export type MiddlewareConfigurations = {
    /**
     * Router identifier, used in logs, html and lang,
     * Add the name argument to /routes/names.json in the langs file
     */
    name: string;
    /**
     * Middleware priority, if placed it will be set above the others
     */
    priority?: number
    /**
     * Absolute dirfile locale
     */
    dir: string;
    /**
    * Type of route used, GET,PUT,POST,DELETE
    */
    method: MiddlewareMethods;
    /**
     * Router Path
     */
    path: string;
    /**
     * Router Function
     * @param express Request,Response,NextFunction do express
     * @param core Log Console
     */
    run(express: ExpressConfigurations, i18n: InstanceType<typeof I18alt>, core: InstanceType<typeof Loggings>): Promise<void> | void;
};
export class Router {
    public static all: RouterConfigurations[] = [];
    public static middlewares: MiddlewareConfigurations[] = [];

    public static readonly Methods = ExpressMethods;
    public static readonly MidMethods = MiddlewareMethods;

    public static readonly Types = AuthenticateTypes;

    constructor(options: RouterConfigurations | MiddlewareConfigurations) {
        let type;
        if (!(options as MiddlewareConfigurations)?.priority) {
            if ((options as RouterConfigurations).type.includes(AuthenticateTypes.FullAuthAccess)) {
                type = [AuthenticateTypes.Cookie, AuthenticateTypes.Token, AuthenticateTypes.ClientToken];
            } else if ((options as RouterConfigurations).type.includes(AuthenticateTypes.FullAccess)) {
                type = [AuthenticateTypes.Cookie, AuthenticateTypes.Token, AuthenticateTypes.ClientToken, AuthenticateTypes.Guest];
            } else {
                type = (options as RouterConfigurations).type;
            }
            const data = {
                ...options,
                type,
            };
            Router.all.push(data as RouterConfigurations);
        } else {
            Router.middlewares.push(options as MiddlewareConfigurations);
        }
    }
}
