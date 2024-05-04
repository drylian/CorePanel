import { Configuration, DataTypes } from "@/Classes/Configuration";
import { Package } from "@/Structural";
import { Env, Envsv, gen } from "@/Utils";
export type ApplicationAuthorizations = {
	system: boolean;
	discord: {
		enabled: boolean;
		client_id: string;
		secret: string;
		redirect: string;
	}
}
export const ApplicationConf = {
	/**
	 * Application Lang
	 */
	language: new Configuration({
		env: "APP_LANGUAGE",
		def: Env("APP_LANGUAGE") ? Env("APP_LANGUAGE") : Envsv("APP_LANGUAGE", "pt-BR"),
		type: DataTypes.str
	}),
	/**
	 * Application Auth modes
	 */
	auth: new Configuration({
		env: "AUTH_REGISTERS",
		def: { system: true, discord: { enabled: false, client_id: "", secret: "", redirect: "" } },
		type: DataTypes.obj
	}) as InstanceType<typeof Configuration<ApplicationAuthorizations>>,
	/**
	 * Application Protocol
	 */
	protocol: new Configuration({
		env: "APP_PROTOCOL",
		def: "http/https",
		type: DataTypes.str
	}),
	/**
	 * Application Mode
	 */
	mode: new Configuration({
		env: Package.core_configs ? "" :"NODE_ENV",
		def: Package.core_configs ? "production" : Envsv("NODE_ENV", "development"),
		type: DataTypes.str
	}),
	/**
	 * Application logotype locale, http/https:// as supported, "discord" is bot discord img
	 */
	logo: new Configuration({
		env: "APP_LOGO",
		def: "/assets/logo.jpg",
		type: DataTypes.str
	}),
	/**
	 * Application default port
	 */
	port: new Configuration({
		env: "APP_PORT",
		def: 3000,
		type: DataTypes.num
	}),
	/**
	 * Application default Signature, used in cookies
	 */
	signature: new Configuration({
		env: "APP_SIGNATURE",
		def: Env("APP_SIGNATURE") ? Env("APP_SIGNATURE") : Envsv("APP_SIGNATURE", gen(128)),
		type: DataTypes.str
	}),
	/**
	 * Application Secret Refresh Cookie
	 */
	secret_refresh: new Configuration({
		env: "APP_REFRESH_TOKEN",
		def: Env("APP_REFRESH_TOKEN") ? Env("APP_REFRESH_TOKEN") : Envsv("APP_REFRESH_TOKEN", gen(128)),
		type: DataTypes.str
	}),
	/**
	 * Application Secret Access Cookie
	 */
	secret_access: new Configuration({
		env: "APP_ACCESS_TOKEN",
		def: Env("APP_ACCESS_TOKEN") ? Env("APP_ACCESS_TOKEN") : Envsv("APP_ACCESS_TOKEN", gen(128)),
		type: DataTypes.str
	}),
	/**
	 * Application default Title, application title, "discord" use discord bot name
	 */
	title: new Configuration({
		env: "APP_TITLE",
		def: "Core-Panel",
		type: DataTypes.str
	}),
	/**
	 * Application default Url, application url
	 */
	url: new Configuration({
		env: "APP_URL",
		def: "http://localhost",
		type: DataTypes.str
	}),
}
