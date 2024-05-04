import { ApplicationConf } from "./Application.conf";
import { DbConfig } from "./Database.conf";
import { Configuration, DataTypes } from "@/Classes/Configuration";
import { Security } from "./Security.conf";

export const Global = {
    /**
     * Application Domain Url, absolute link
     */
    domain: new Configuration({
        env: "APP_DOMAIN_URL",
        def: `${ApplicationConf.url.get}:${ApplicationConf.port.get}`,
        type: DataTypes.str
    }),
    /**
     * Application Token
     */
    client_application_token: new Configuration({
        env: "CORE_APPLICATION_TOKEN",
        def: "",
        type: DataTypes.str
    }),
    ...ApplicationConf,
    ...DbConfig,
    ...Security
}
export function AssetsLink(str?: string) {
    return `${Global.domain.get}/assets` + (str ? `/${str}` : "")
}