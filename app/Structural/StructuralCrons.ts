import { Crons } from "@/Classes/Crons";
import { Structurals } from "@/Classes/Structurals";

/**
 * Crons Structurals
 */
new Structurals({
	name: "Crons",
	path: ["Crons/**/*.{ts,js}"],
	async run() {
		const crons = Crons.all.keys()
        for (const key of crons) {
            const cron = Crons.all.get(key);
            if(cron) {
               Crons.set.on(cron.uuid, cron.exec);
                Crons.start(cron); 
            }
        }
	}
})
