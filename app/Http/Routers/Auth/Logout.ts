import { Router } from "@/Http/RouterController";
new Router({
	name: "Logout",
	dir: __filename,
	method: Router.Methods.Get,
	path: "/auth/logout",
	type: [Router.Types.Cookie],
	async run({ req, res }) {
		res.clearCookie("X-Application-Refresh");
        res.clearCookie("X-Application-Access");
        req.signedCookies["X-Application-Refresh"] = undefined;
        req.signedCookies["X-Application-Refresh"] = undefined;
        res.status(302).redirect("/auth/login");
	},
})