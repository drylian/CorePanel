import bcrypt from "bcrypt";
import User, { UserCookie } from "@/Database/Models/Users";
import { ALTcpt, AlTexp } from "@/Utils";
import { v4 as uuidv4 } from "uuid";
import { Router } from "@/Http/RouterController";
import { Global } from "@/Configurations";
import Activities from "@/Database/Models/Activities";

new Router({
	name: "Login",
	dir: __filename,
	method: Router.Methods.Post,
	path: "/auth/login",
	type: [Router.Types.Guest],
	async run({ req, res }, i18n, core) {
		function Response(msg: string, status = 400, complete = false) {
			res.status(status).json({ complete: complete, status: status, message: msg, timestamp: Date.now() })
		}
		const { callback } = req.query
		// Is logged, not need access
		if (req?.user) return res.status(302).redirect(callback ? String(callback) : "/");
		const { email, password, remember_me = false } = req.body;
		try {
			if (!email || !password) {
				Response(i18n.t("Http.ObrigatoryCampsNotFound", { camps: "email , password" }))
				return;
			}
			const user = await User.findOne({ where: { email: email } });
			if (!user) {
				Response(i18n.t("Http.UserNotFound"), 401)
				return;
			}
			if (bcrypt.compareSync(password, user.password)) {
				const UserData = user as Partial<typeof user>;
				delete UserData.password;
				delete UserData.id;
				if (remember_me && UserData.uuid) {
					const rememberMeUUID = uuidv4();
					await User.update({ uuid: UserData.uuid }, { remember: rememberMeUUID })
					res.cookie(
						"X-Application-Refresh",
						ALTcpt({ remember: rememberMeUUID }, Global.secret_refresh.get, {
							ip: req.access.ip?.toString(),
							expires: "90d",
						}),
						{ signed: true, maxAge: AlTexp("90d"), httpOnly: true },
					);
				}
				res.cookie(
					"X-Application-Access",
					ALTcpt(UserData, Global.secret_access.get, {
						ip: req.access.ip?.toString(),
						expires: remember_me ? "15m" : "1h",
					}),
					{ signed: true, maxAge: AlTexp(remember_me ? "15m" : "1h"), httpOnly: true },
				);
				req.user = {
					ip: String(req.access.ip),
					access: "User",
					path: req._parsedUrl.pathname,
					...UserData as UserCookie,
				}
				await Activities.new(req.user, "MakedLogin");
				Response(i18n.t("Http.WelcomeBack", { username: user.username }), 200, true)
			} else {
				Response(i18n.t("Http.EmailOrPasswordImcorrect"), 401)
			}
		} catch (ex) {
			const err = (ex as InstanceType<typeof Error>)
			core.error(`Erro ao autenticar um usuário : "${err.stack}"`);
			Response(i18n.t("Http.ErrorAttemptLogin"), 500)
		}

	},
})