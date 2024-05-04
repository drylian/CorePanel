import { Configuration, DataTypes } from "@/Classes/Configuration";
import { Env, Envsv, gen } from "@/Utils";

/**
 * Security Configurations
 */
export const Security = {
	/**
	 * Application Crsf key
	 */
	crsf_secret: new Configuration({
		env: "CSRF_SECRET",
		def: Env("CSRF_SECRET") ? Env("CSRF_SECRET") : Envsv("CSRF_SECRET", gen(128)),
		type: DataTypes.str
	}),
    /**
	 * Application Crsf Routes
	 */
	crsf_routes: new Configuration({
		env: "CSRF_ROUTES",
		def: [""],
		type: DataTypes.array
	}),
    cors_enabled: new Configuration({
		env: "CORS_ENABLED",
		def: true,
		type: DataTypes.bool
	}),
    cors_routes: new Configuration({
		env: "CORS_KEY",
		def: [""],
		type: DataTypes.array
	}),
}