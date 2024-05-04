import { UserCookie as DbUser } from "./Database/Models/Users";

export interface PanelUser extends DbUser {
  ip: string,
  access: "Token" | "User",
  path: string
}
declare global {
  namespace Express {
    interface Request {
      /**
       * Application Requester Assets
       */
      access: {
        ip?: string | string[] | undefined;
        nonce?: string;
      };
      language: string;
      _parsedUrl: InstanceType<typeof URL>;
      user: PanelUser | undefined
    }
  }
  /**
   * Types of Package.json
   */
  interface PackageJson {
    name: string;
    buildedtype;
    version: string;
    description?: string;
    main?: string;
    core_configs?: {
      directory: string;
      outdir: string;
      platforms: Array<'linux' | 'alpine' | 'linuxstatic' | 'macos'>;
      archs: Array<'x64' | 'arm64'>;
      nodeVersion: '18' | '20';
      obfuscate: boolean;
      pkgbuild: boolean;
      mode: string
      bundler: boolean
      debug: boolean
      date:Date
    }
    scripts?: {
      [key: string]: string;
    };
    repository?: {
      type: string;
      url: string;
    };
    keywords?: string[];
    author?: string;
    license?: string;
    dependencies?: {
      [key: string]: string;
    };
    devDependencies?: {
      [key: string]: string;
    };
    peerDependencies?: {
      [key: string]: string;
    };
    optionalDependencies?: {
      [key: string]: string;
    };
    engines?: {
      [key: string]: string;
    };
    private?: boolean;
    homepage?: string;
    bugs?: {
      url: string;
      email?: string;
    };
    contributors?: string[] | { name: string; email?: string; url?: string }[];
    scriptsDescription?: {
      [key: string]: string;
    };
  }

}

export { }