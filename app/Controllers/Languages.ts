import * as fs from "fs";
import * as _ from "lodash";
import { json } from "@/Utils";
import { Console, LoggingsMessage } from "loggings";
import { ResourcesPATH } from "@/Structural";
import { Global } from "@/Configurations";
const core = (...message: LoggingsMessage[]) => Console("Warn", "yellow", ...message);
/**
 * Languages of Core
 */
export default class I18alt {
	private current: string;
	public static core: Record<string, object> = {}
	public static get live() { return new I18alt() }
	constructor(lang?: string) { this.current = lang ?? Global['language'].get; }

	public get mt() { return this.meta }
	public get meta() {
		const langs: object[] = []
		for (const lang in I18alt.core) {
			const resources = I18alt.core[lang] as Record<string, object>
			if (resources['meta']) langs.push({ ...(resources['meta']), lang })
		}
		return langs
	}

	public lmt = (lang: string) => this.LangMeta(lang)
	public LangMeta(lang: string) {
		const resources = I18alt.core[lang] as { meta: object }
		if (resources?.meta) return resources.meta
		return {}
	}

	public lr = (lang?: string) => this.langResources(lang)
	public langResources(lang?: string): object {
		if (lang) return I18alt.core[lang];
		return I18alt.core;
	}

	public t = (key: string, params: Record<string, string|number> = {}) => this.translate(key, params);
	public translate(key: string, params: Record<string, string|number> = {}): string {
		if (!params.lang) params.lang = this.current;
		const directory = `LangDIR:${key.replaceAll(":", "/").split(".")[0]}/${key.split(".")[1]}.json`;
		const keys = key.replaceAll(":", ".").split(".")
		if (I18alt.core[params.lang]) {
			let translation = _.get(I18alt.core[params.lang], keys.join("."));
			if (translation === keys.join(".")) {
				/**
				 * Not found translation in current lang
				 */
				translation = keys.pop();
				core(`KEY: [${keys.pop()}].purple-b | [${directory}].blue | not found in lang ["${params.lang}"].blue`);
			}
			if (typeof translation === "string") {
				for (const param in params) translation = translation.replaceAll(`{${param}}`, params[param]); // default
				for (const param in params) translation = translation.replaceAll(`{{${param}}}`, params[param]); // i18next
				return translation
			}
		} else if (!I18alt.core[params.lang]) {
			core(`LANG: [${params.lang}].red not found , changing of default lang "${Global['language'].get}"].green.`);
			this.current = Global['language'].get;
			return this.t(key, params);
		}
		core(`KEY: [${keys.pop()}].purple-b | [${directory}].blue | not found in lang ["${params.lang}"].blue`);
		return key;
	}

	public get lg() { return this.language }
	public get language() { return this.current };

	public get lgs() { return this.languages; }
	public get languages() {
		const langs = []
		for (const lang in I18alt.core) {
			langs.push(lang)
		}
		return langs;
	}

	public sl = (lang?: string) => this.setLanguage(lang);
	public setLanguage(lang?: string) {
		if (lang && I18alt.core[lang]) {
			this.current = lang
			return true
		}
		core(`LANG: ["${lang}"].blue not found, not changed current lang.`);
		return false;
	}

	public GNR = (namespace: string, i18next: boolean, lang?: string) => this.getNamespaceResource(namespace, i18next, lang);
	public getNamespaceResource(namespace: string, i18next: boolean, lang?: string): object {
		const value = namespace;
		namespace = namespace.replace(/:/g, "/");
		const keys = namespace.split(".");
		const langdir = `${ResourcesPATH + "/Languages"}/${lang || this.current}/${keys[0]}.json`;
		if (i18next && lang) {
			const nextLang = lang.split(" ");
			const nextNamespace = value.split(" ");
			const response: { [locale: string]: object } = {};
			nextLang.forEach((locale) => {
				response[locale] = {};
				nextNamespace.forEach((nextns) => {
					let result;
					if (nextns.indexOf(":") !== -1) {
						result = _.get(I18alt.core[locale], nextns.replace(/:/g, ".").split("."));
					} else {
						result = _.get(I18alt.core[locale], nextns);
					}
					if (result !== undefined) {
						_.set(response[locale], nextns, result);
					} else {
						_.set(response[locale], nextns, []);
					}
				});
			});
			return response;
		} else if (namespace.split(".").length === 1) {
			if (fs.existsSync(langdir)) {
				return json(langdir);
			}
		} else {
			keys.shift();
			const nestedKey = keys.join(".");
			return _.set({}, keys, _.get(json(langdir), nestedKey, nestedKey));
		}
		return {
			error: "NamespaceResourcesNotFound",
			message: this.t("core:langs.NamespaceResourcesNotFound", {
				SelectedLang: lang || this.current,
				Selectednamespace: value,
			}),
		};
	}
}
