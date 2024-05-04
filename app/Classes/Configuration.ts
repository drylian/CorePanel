import { Env, Envsv } from "@/Utils";
import { Console, LoggingsMessage } from "loggings";
function Core(...args: LoggingsMessage[]) {
    return Console("Env", "red", ...args);
}
export const DataTypes = {
    str: String,
    num: Number,
    bool: Boolean,
    obj: Object,
    array: <K extends string | K[]>(data: K): K[] => {
        return Array.isArray(data) ? data : JSON.parse((data as string).replaceAll("'", '"'))
    },
}
export type ConfigurationDefault<ValueType> = {
    env: string;
    def: ValueType;
    type: (value: string) => ValueType
    chk?: (env: string, def: ValueType) => ValueType;
};

export type ConfigurationOptions<ValueType> = ConfigurationDefault<ValueType> & {
    value: ValueType | undefined
};

export class Configuration<ValueType> {
    public static envs:string[] = [];
    public options: ConfigurationOptions<ValueType>
    constructor(options: ConfigurationDefault<ValueType>) {
        this.options = { ...options, value: options.def }
        if (options?.chk) {
            this.options.value = options.chk(options.env, options.def)
        } else {
            if (Env(options.env)) this.options.value = options.type(Env(options.env))
            else {
                if (typeof options.def === 'string') {
                    this.options.value = options.type(options.def as string)
                } else if (Array.isArray(options.def)) {
                    this.options.value = options.type(options.def as any)
                }
            }
        }
        Configuration.envs.push(options.env)
    }
    public get get() {
        return this.options.value as typeof this.options.def
    }
    public set(def: string extends ValueType ? string : ValueType) {
        if (this.options?.chk) {
            this.options.value = this.options.type(Envsv(this.options.env, this.options.chk(this.options.env, def)))
        } else {
            if (typeof def === 'string') {
                this.options.value = this.options.type(Envsv(this.options.env, def))
            } else if (Array.isArray(def)) {
                this.options.value = this.options.type(Envsv(this.options.env, def))
            }
            this.options.value = this.options.type(Envsv(this.options.env, def))
        }
    }
}