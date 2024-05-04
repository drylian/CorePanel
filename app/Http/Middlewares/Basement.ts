import I18alt from "@/Controllers/Languages";
import { Router } from "../RouterController";
import { ALTcpt, ALTdcp, AlTexp, gen } from "@/Utils";
import { PanelUser } from "@/Application";
import { Global } from "@/Configurations";
import User, { UserCookie } from "@/Database/Models/Users";
import { v4 } from "uuid";

/**
 * Basic request configurations
 */
new Router({
    name: "Basement",
    priority: 1,
    dir: __filename,
    path: "*",
    method: Router.MidMethods.Use,
    async run({ req, res, next }) {
        req.access = {}
        req.access.ip = req.headers["x-forwarded-for"] ?? req.ip ?? req.socket.remoteAddress;
        next();
    }
})

/**
 * Basic Language Cookie Method
 */
new Router({
    name: "LanguageCookieMiddleware",
    priority: 2,
    dir: __filename,
    path: "*",
    method: Router.MidMethods.Get,
    async run({ req, res, next }, i18n) {
        if (!req.cookies["X-APPLICATION-LANG"]) {
            res.cookie('X-APPLICATION-LANG', I18alt.live.lg, { maxAge: AlTexp("30d") });
            req.cookies["X-APPLICATION-LANG"] = I18alt.live.lg
        }
        if (I18alt.live.lgs.includes(req.cookies["X-APPLICATION-LANG"])) {
            req.language = req.cookies["X-APPLICATION-LANG"]
            i18n.sl(req.cookies["X-APPLICATION-LANG"])
        }
        next();
    }
})

/**
 * Cookie Manager
 */
new Router({
    name: "CookieManager",
    priority: 3,
    dir: __filename,
    path: "*",
    method: Router.MidMethods.Use,
    async run({ req, res, next }, i18n) {
        const Cookie = req.signedCookies["X-Application-Access"] || req.signedCookies["X-Application-Refresh"]
        if (Cookie) {
            let access: { data: UserCookie, expires: number } | null = null
            let refresh: { data: { remember: string }, expires: number } | null = null
            if (req.signedCookies["X-Application-Access"]) access = ALTdcp<{ data: UserCookie, expires: number } | null>(
                req.signedCookies["X-Application-Access"],
                Global.secret_access.get,
                req.access.ip?.toString(),
            );
            if (req.signedCookies["X-Application-Refresh"]) refresh = ALTdcp<{ data: { remember: string }, expires: number } | null>(
                req.signedCookies["X-Application-Refresh"],
                Global.secret_refresh.get,
                req.access.ip?.toString(),
            );
            let expiring = false;
            let LocalUser: UserCookie | undefined = undefined;
            if (access) {
                const time = Date.now() + AlTexp("5m")
                const TimerOfUpdate = new Date(time).getTime();
                const AccessExpires = new Date(access.expires).getTime();
                expiring = AccessExpires <= TimerOfUpdate
                LocalUser = access.data
            }
            if (expiring && refresh || refresh && !access) {
                const user = await User.findOne({ where: { remember: refresh.data.remember } });
                if (user) {
                    const UserData = user as Partial<typeof user>;
                    delete UserData.password;
                    delete UserData.id;
                    let rememberMeUUID: string = "" + gen(64), existRemember;
                    do {
                        rememberMeUUID = "remember_me_" + gen(64);
                        existRemember = await User.findOne({ where: { remember: rememberMeUUID } });
                    } while (existRemember);
                    await User.update({ uuid: UserData.uuid }, { remember: rememberMeUUID })
                    res.cookie(
                        "X-Application-Refresh",
                        ALTcpt({ remember: rememberMeUUID }, Global.secret_refresh.get, {
                            ip: req.access.ip?.toString(),
                            expires: "90d",
                        }),
                        { signed: true, maxAge: AlTexp("90d"), httpOnly: true },
                    );
                    res.cookie(
                        "X-Application-Access",
                        ALTcpt(UserData, Global.secret_access.get, {
                            ip: req.access.ip?.toString(),
                            expires: "15m",
                        }),
                        { signed: true, maxAge: AlTexp("15m"), httpOnly: true },
                    );
                    LocalUser = UserData as UserCookie
                } else {
                    LocalUser = undefined;
                    res.clearCookie("X-Application-Access");
                    res.clearCookie("X-Application-Refresh");
                    res.status(302).redirect("/auth/login?callback=" + req.originalUrl)
                    return;
                }
            }
            if (LocalUser) {
                req.user = {
                    ip: String(req.access.ip),
                    access: "User",
                    path: req._parsedUrl.pathname,
                    ...LocalUser,
                }
            }
        }
        if(req.user)i18n.sl(req.user.lang);
        next();
    }
})