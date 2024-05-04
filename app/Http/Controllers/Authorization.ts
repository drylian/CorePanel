import { Request, Response } from "express";
import { AuthenticateTypes, RouterConfigurations } from "../RouterController";

type AuthorizationReturn = {
    response: string,
    code: string,
    status: number,
    redirect?:string
}
/**
 * Authorization of connections, Checker of users / tokens
 * @param Request 
 * @param Response 
 * @param Options 
 */
export async function Authorization(Request: Request, Response:Response, Options: RouterConfigurations): Promise<AuthorizationReturn> {
    if (Options.type) {
        const NotCookie = !Request.signedCookies["X-Application-Access"] && !Request.signedCookies["X-Application-Refresh"]
        if (!NotCookie && Request.user) {
            /**
             * Cookie Permission Checker
             */
            if(Request.user.access === "User") {
                if(Options.permission) {
                    if(Request.user.permission < Options.permission) {
                        return {
                            response: `You do not have sufficient permissions to be able to access the resources on this route`,
                            code: "NotHaveNecessaryPerms",
                            status: 403
                        }
                    }
                }
                if (!Options.type.includes(AuthenticateTypes.Cookie)) {
                    const allowedTypes = [];
                    for (const type of Options.type) {
                        if (AuthenticateTypes.Cookie !== type && AuthenticateTypes.FullAccess !== type) allowedTypes.push(type)
                    }
                    return {
                        response: `This route does not allow this type of access token, types allowed ${allowedTypes.join(", ")}`,
                        code: "TokenTypeAccessDenied",
                        status: 403
                    }
                }
                return {
                    response: "OK",
                    code: "HaveAccess",
                    status: 200
                }
            }
        }
        if (NotCookie && Request.headers.authorization) {
            /**
             * Authorization Authorization
             */
            const Authorization = Request.headers.authorization?.split(" ");
            if (Authorization.length < 2) {
                return {
                    response: 'The way to use the token is invalid, use Bearer and the token used, example: "Bearer Token123"',
                    code: "InvalidTokenFormat",
                    status: 400
                }
            }

            if (!Object.values(AuthenticateTypes).includes(Authorization[0] as typeof AuthenticateTypes[keyof typeof AuthenticateTypes])) {
                return {
                    response: `The access types supported by the api are ${AuthenticateTypes.Token} and ${AuthenticateTypes.ClientToken}, example: "${AuthenticateTypes.ClientToken} Token123" `,
                    code: "InvalidTypeTokenFormat",
                    status: 400
                }
            }

            const [AuthType, AuthToken] = Authorization;
            if (!Options.type.includes(AuthType as typeof AuthenticateTypes[keyof typeof AuthenticateTypes])) {
                const allowedTypes = [];
                for (const type of Options.type) {
                    if (AuthenticateTypes.Cookie !== type && AuthenticateTypes.FullAccess !== type) allowedTypes.push(type)
                }
                return {
                    response: `This route does not allow this type of access token, types allowed ${allowedTypes.join(", ")}`,
                    code: "TokenTypeAccessDenied",
                    status: 403
                }
            }
            const Result = "FutureAuthTokenChecker"
        }
        if (Options.type.includes(AuthenticateTypes.Guest)) {
            return {
                response: "OK",
                code: "HaveAccess",
                status: 200
            }
        } else {
            return {
                response: "Access type of this request is unknown, please try again",
                code: "AccessTypeNotFound",
                status: 401
            }
        }
    }
    return {
        response: "Route requires authorization but does not say what type of authorization is required.",
        code: "InvalidRouteRequirements",
        status: 500
    }
}