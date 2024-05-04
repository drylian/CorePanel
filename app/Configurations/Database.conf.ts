import { Configuration, DataTypes } from "@/Classes/Configuration";
// import { StoragePATH } from "@/Structural";
import { Env, JSONDriver } from "@/Utils";

type Ips = {
		requests: number;
		warn: number;
		blocked: boolean;
		history: {
			[key: string]: string;
		};
};

export const DbConfig = {
    /**
     * Dialect of Database
     */
    db_dialect: new Configuration({
        env: "DB_DIALECT",
        def: "sqlite",
        chk: (env, def) => {
            const Data = Env(env)
            if (Data !== undefined) {
                if (Data === "mysql") return Data
                if (Data === "sqlite") return Data
            }
            return def
        },
        type: DataTypes.str
    }),
    /**
     * Host of Database
     */
    db_host: new Configuration({
        env: "DB_HOSTNAME",
        def: Env("DB_DIALECT") == "mysql" ? (Env("DB_HOSTNAME") ? Env("DB_HOSTNAME") : undefined) : undefined,
        type: DataTypes.str
    }),
    /**
     * Port of Database
     */
    db_port: new Configuration({
        env: "DB_PORT",
        def: Env("DB_DIALECT") == "mysql" ? (Env("DB_PORT") ? Number(Env("DB_PORT")) : 3306) : 3306,
        type: DataTypes.num
    }),
    /**
     * User of Database
     */
    db_user: new Configuration({
        env: "DB_USERNAME",
        def: Env("DB_DIALECT") == "mysql" ? (Env("DB_USERNAME") ? Env("DB_USERNAME") : undefined) : undefined,
        type: DataTypes.str
    }),
    /**
     * Pass of Database
     */
    db_pass: new Configuration({
        env: "DB_PASSWORD",
        def: Env("DB_DIALECT") == "mysql" ? (Env("DB_PASSWORD") ? Env("DB_PASSWORD") : undefined) : undefined,
        type: DataTypes.str
    }),
    /**
     * Database of Database
     */
    db_database: new Configuration({
        env: "DB_DATABASE",
        def: Env("DB_DIALECT") == "mysql" ? (Env("DB_DATABASE") ? Env("DB_DATABASE") : undefined) : ":memory:",
        type: DataTypes.str
    }),
    // acesses: new JSONDriver<Record<string, Ips>>(StoragePATH + "/Requesters.json"),
}