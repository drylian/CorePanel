import path from "path";
import { json } from "@/Utils/Json";
const TYPESCRIPT_DIRECTORY = "./app";
const JAVASCRIPT_DIRECTORY = "./src";
const BUNDLE_FILE = "service.js";
const PKG_MODE = BUNDLE_FILE ? (process.cwd() === __dirname ? false : true) : process.cwd().startsWith(__dirname) ? false : true
export const CurrentMode = __filename.endsWith(BUNDLE_FILE) ? "Bundle" : path.join(__filename).endsWith(".ts") ? "Typescript" : "Javascript";
export const Package: PackageJson = json(PKG_MODE ? (CurrentMode === "Bundle" ? path.join(__dirname, "package.json") : path.join(__dirname, "..","..", "package.json")) : "./package.json")
export const RootPATH = CurrentMode === "Bundle" ? (PKG_MODE ? path.join(__dirname) : "./") : CurrentMode === "Javascript" ? (PKG_MODE ? path.join(__dirname, "..") : JAVASCRIPT_DIRECTORY) : TYPESCRIPT_DIRECTORY
export const ResourcesPATH = CurrentMode === "Bundle" ? RootPATH + "/locals" : RootPATH + "/Resources";
