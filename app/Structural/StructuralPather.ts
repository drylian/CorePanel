import path from "path";
import { json } from "@/Utils/Json";
/**
 * Expected Typescript locale
 */
const TYPESCRIPT_DIRECTORY = "./app";
/**
 * Expected Javascript locale
 */
const JAVASCRIPT_DIRECTORY = "./src";
/**
 * Expected Bundle file
 */
const BUNDLE_FILE = "service.js";
/**
 * Check PKG_MODE
 */
export const PKG_MODE = BUNDLE_FILE ? (process.cwd() === __dirname ? false : true) : process.cwd().startsWith(__dirname) ? false : true
/**
 * Check current Mode in panel "Bundle" | "Typescript" | "Javascript"
 */
export const CurrentMode = __filename.endsWith(BUNDLE_FILE) ? "Bundle" : path.join(__filename).endsWith(".ts") ? "Typescript" : "Javascript";
/**
 * Read main package.json of panel
 */
export const Package: PackageJson = json(PKG_MODE ? (CurrentMode === "Bundle" ? path.join(__dirname, "package.json") : path.join(__dirname, "..","..", "package.json")) : "./package.json")
/**
 * Return RootPATH of panel, in pkg_mode this return internal path of pkg
 */
export const RootPATH = CurrentMode === "Bundle" ? (PKG_MODE ? path.join(__dirname) : "./") : CurrentMode === "Javascript" ? (PKG_MODE ? path.join(__dirname, "..") : JAVASCRIPT_DIRECTORY) : TYPESCRIPT_DIRECTORY
/**
 * Return ResourcesPATH of panel, in pkg_mode this return internal path of pkg
 */
export const ResourcesPATH = CurrentMode === "Bundle" ? RootPATH + "/locals" : RootPATH + "/Resources";
/**
 * Return AbsolutePATH of panel, but ignores pkg_mode locale
 */
export const AbsolutePATH = process.cwd();
