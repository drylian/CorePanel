// import { glob } from "glob";
// import path from "path";
// import { RootPATH } from "@/Structural";
// import { Events } from "@/Classes/Events";

// new Structurals({
// 	name: "Crons",
// 	path: ["Crons/**/*.{ts,js}"],
// 	async run() {
// 		for (const isolated of Events.all) {
// 			Events.set.on(isolated.name, isolated.run);
// 		}
// 	}
// })