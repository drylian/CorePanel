import { AlTexp, hashmd5 } from "@/Utils";
import { Router } from "../RouterController";

new Router({
    name: "LanguageRequest",
    dir: __filename,
    method: Router.Methods.Get,
    path: "/languages/requests",
    type: [Router.Types.FullAccess],
    async run({ req, res, next }, i18n) {
        const { namespace, lang, native, hash } = req.query;
        const data = i18n.GNR(namespace as string, native !== undefined, lang as string);
        res.header({
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            ETag: hashmd5(data),
            i18hash: hash || "know",
        });
        res.status(200).json(data);
    },
})

new Router({
    name: "LanguageRoutes",
    dir: __filename,
    method: Router.Methods.Post,
    path: "/languages/lang",
    type: [Router.Types.FullAccess],
    async run({ req, res, next }, i18n) {
        const { lang } = req.query;
        if (lang && typeof lang === "string" && i18n.lgs.includes(lang)) {
            res.cookie('X-APPLICATION-LANG', lang, { maxAge: AlTexp("30d") });
            req.cookies["X-APPLICATION-LANG"] = lang
        }
        res.status(200).json({
            reload: true
        });
    },
})