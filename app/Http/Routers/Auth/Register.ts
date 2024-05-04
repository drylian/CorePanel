import bcrypt from "bcrypt";
import User, { UserCookie } from "@/Database/Models/Users";
import { ALTcpt, AlTexp } from "@/Utils";
import { v4 as uuidv4 } from "uuid";
import { Router } from "@/Http/RouterController";
import { Global } from "@/Configurations";
import Activities from "@/Database/Models/Activities";

new Router({
    name: "Register",
    dir: __filename,
    method: Router.Methods.Post,
    path: "/auth/register",
    type: [Router.Types.FullAccess],
    async run({ req, res }, i18n, core) {
        function Response(msg: string, status = 400, complete = false) {
            res.status(status).json({ complete: complete, status: status, message: msg, timestamp: Date.now() })
        }
        const { callback } = req.query
        // Is logged, not need access
        if (req?.user) return res.status(302).redirect(callback ? String(callback) : "/");
        const { email, username, password, terms = false } = req.body;

        if (!Global.auth.get.system) {
            Response(i18n.t("Http.RegisterSystemAsDisabled"), 401)
            return;
        }

        if (!terms) {
            Response(i18n.t("Http.TermsNeedAccepts"), 403)
            return;
        }

        if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
            Response(i18n.t("Http.InvalidCharUsername"), 403)
            return;
        }

        if (String(password).length < 4 || String(password).length > 25) {
            Response(i18n.t("Http.MaxMinInCamp", { camp: "password", min: 4, max: 25 }), 400)
            return;
        }

        if (String(username).length < 4 || String(username).length > 25) {
            Response(i18n.t("Http.MaxMinInCamp", { camp: "username", min: 4, max: 25 }), 400)
            return;
        }
        
        try {
            if (!username || !email || !password) {
                Response(i18n.t("Http.ObrigatoryCampsNotFound", { camps: "email , password" }))
                return;
            }

            if (await User.findOne({ where: { email: email } })) {
                Response(i18n.t("Http.EmailHasUsed"), 200)
                return;
            }
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const uuid = uuidv4();
            const user = User.create({
                lang: i18n.lg,
                username,
                email,
                password: hashedPassword,
                uuid: uuid,
            });
            await user.save();
            const UserData = user as Partial<typeof user>;
            delete UserData.password;
            delete UserData.id;
            req.user = {
                ip: String(req.access.ip),
                access: "User",
                path: req._parsedUrl.pathname,
                ...UserData as UserCookie,
            }
            await Activities.new(req.user, "CreatedAccount");
            Response(i18n.t("Http.SuccessOfCreationAccount"), 200, true)
        } catch (ex) {
            const err = (ex as InstanceType<typeof Error>)
            core.error(`Erro ao autenticar um usuário : "${err.stack}"`);
            Response(i18n.t("Http.ErrorAttemptLogin"), 500)
        }

    },
})