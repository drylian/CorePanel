import { json } from "@/Utils";
import { PluginRouter } from "./PluginRouter"
import { AbsolutePATH, PKG_MODE, RootPATH } from "@/Structural";

interface PluginBasementStructure {
    /**
     * Name of Plugin
     */
    name: string,
    /**
     * Identification of Plugin, used in routes
     */
    identification: string;
    /**
     * Permission of path access 
     */
    permissions: string[],
    /**
     * Description of Plugin
     */
    description: string
}
/**
 * Main loader of plugin
 */
export class PluginLoader {
    /**
     * PluginLoader Static resources, used for panel
     */
    public static ___static__resources:InstanceType<typeof PluginLoader>[] = [];
    /**
     * Plugin Options
     */
    public options: PluginBasementStructure;
    /**
     * routes of plugin 
     */
    public routes: InstanceType<typeof PluginRouter>[] = []
    /**
     * Local of package.json of plugin
     * @param local 
     */
    constructor(local: string) {
        const plugin = json<PluginBasementStructure>((PKG_MODE ? AbsolutePATH : RootPATH) + "/plugins/" + local)
        if (!plugin.description || !plugin.identification || !plugin.name || !plugin.permissions) {
            throw "Basic plugin information is missing"
        } else {
            this.options = plugin
            PluginLoader.___static__resources.push(this)
        }
    }
}
