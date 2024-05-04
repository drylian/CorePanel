import { Structurals } from "@/Classes/Structurals";
import { CoreDB } from "@/Controllers/CoreDB";

new Structurals({
	name: "Models",
	path: ["Database/Models/**/*.{ts,js}"],
	exec(options, filedata) {
		CoreDB.entities.push(filedata.default)
	},
})