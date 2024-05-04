import { EventEmitter } from "node:events";
import { randomUUID } from "crypto";
import cronParser, { CronExpression } from "cron-parser";
import { Console, LoggingsMessage } from "loggings";
import { JSONDriver } from "@/Utils";

function Core(type: string, ...args: LoggingsMessage[]) {
	return Console(type, "red", ...args);
}

/**
 * Configuration object for defining recurring cron jobs.
 */
export type CronsConfigurations<Metadata = undefined> = {
	/**
	 * Identifier for the Cron job.
	 */
	name: string;
	/**
	 * Cron argument, e.g., "* * * * * *" for every second.
	 */
	cron: string;
	/**
	 * Function to be executed when the cron job is triggered.
	 */
	exec: (cron: CronsConfigurations<Metadata>, interval: CronExpression) => void;
	/**
	 * Metadata for the cron job, for specific information.
	 */
	metadata?: Metadata;
	/**
	 * Indicates whether the cron job should run only once.
	 */
	once?: boolean;
};

/**
 * Configuration object for defining a unique cron job to run only once.
 */
export type UniqueCron<MetaArgs> = {
	/**
	 * Identifier for the unique cron job.
	 */
	name: string;
	/**
	 * Cron argument, e.g., "* * * * * *" for every second.
	 */
	cron: string;
	/**
	 * Function to be executed when the unique cron job is triggered.
	 */
	exec: (cron: UniqueCron<MetaArgs>) => void;
	/**
	 * Metadata for the unique cron job, for specific information.
	 */
	metadata: MetaArgs;
};

/**
 * Extended configuration interface for cron jobs, including a UUID.
 */
export interface CronsConfigurationsSystem<Metadata> extends CronsConfigurations<Metadata> {
	uuid: string;
	started: boolean;
	next_exec: number;
}

/**
 * Class representing a collection of cron jobs.
 */
export class Crons<Metadata> {
	/**
	 * Array containing all defined cron jobs.
	 */
	public static all = new JSONDriver<Record<string, CronsConfigurationsSystem<InstanceType<typeof Crons>["data"]["metadata"]>>>("");
	/**
	 * EventEmitter used for managing cron job events.
	 */
	public static set = new EventEmitter();
	public static timeouts = new Map();
	/**
	 * Starts the specified cron job.
	 * @param cron - Configuration for the cron job.
	 */
	public static start(cron: CronsConfigurationsSystem<InstanceType<typeof Crons>["data"]["metadata"]>) {
		const interval = cronParser.parseExpression(cron.cron);
		const nextScheduledTime = interval.next().getTime();
		const currentTime = Date.now();
		const delay = nextScheduledTime - currentTime;
		Crons.all.merge(cron.uuid, {
			started: true,
			next_exec: delay
		})
		// Updates the interval and schedules the next execution
		this.timeouts.set(
			cron.uuid,
			setTimeout(() => {
				Crons.set.emit(cron.uuid, cron, interval);
				if (!cron.once) Crons.start(cron);
			}, delay),
		);
	}

	/**
	 * Deletes Mapped Cron, and Removes Interval of expect cron
	 * @param name Name of Cron
	 * @returns 
	 */
	public static remove(name: string) {
		const key = Crons.all.find("name", name)
		if (key) {
			const cron = Crons.all.get(key);
			if (!cron) return false;
			Crons.set.removeListener(cron.uuid, () => { });
			const timeout = Crons.timeouts.get(cron.uuid);
			clearInterval(timeout);
			Crons.all.delete(key);

			Core("Crons", `[${cron.name}].green-b removed successfully.`);
			return true;
		}
	}

	/**
	 * Configures unique cron jobs that run only once.
	 * @return Returns the setTimeout ID, which can be used for cancellation.
	 */
	public static once<MetaArgs>(cron: UniqueCron<MetaArgs>) {
		const interval = cronParser.parseExpression(cron.cron);
		const nextScheduledTime = interval.next().getTime();
		const currentTime = Date.now();
		const delay = nextScheduledTime - currentTime;
		Core("UnicCron", `[${cron.name}].green-b added successfully.`);

		return setTimeout(() => {
			cron.exec(cron);
		}, delay);
	}

	/**
	 * Updates or adds a cron job.
	 * @param cron - Configuration for the cron job.
	 */
	public static post(cron: CronsConfigurationsSystem<InstanceType<typeof Crons>["data"]["metadata"]>) {
		if (cron?.uuid) {
			const key = Crons.all.find("name", cron.name)
			if (key) {
				Crons.all.merge(key, cron)
			}
		} else {
			// Generates a new UUID if not provided
			const newcron = {
				...cron,
				uuid: randomUUID().replaceAll("-", ""),
			};
			newcron.once = cron.once ? cron.once : false;
			Crons.all.set(cron.uuid, newcron);
			Core("Cron", `[${cron.name}].yellow-b adicionado.`);
		}
	}

	/**
	 * Generates a cron expression for a specific date.
	 * @param date - Expiration date.
	 * @returns Returns the cron expression.
	 */
	public static date(date: Date) {
		const seconds = date.getSeconds();
		const minutes = date.getMinutes();
		const hours = date.getHours();
		const dayOfMonth = date.getDate();
		let month = date.getMonth() + 1; // Months start from zero in JavaScript
		if (month === 13) {
			month = 12;
		}
		return `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} *`;
	}

	/**
	 * Constructor for the Crons class.
	 * @param data - Configuration for the cron job.
	 */
	constructor(public data: CronsConfigurations<Metadata>) {
		const cron = {
			...data,
			started: false,
			next_exec: 0,
			uuid: randomUUID().replaceAll("-", ""),
		};
		cron.once = data.once ? data.once : false;
		Crons.all.set(cron.uuid, (cron as CronsConfigurationsSystem<InstanceType<typeof Crons>["data"]["metadata"]>));
		Core("Cron", `[${cron.name}].green-b Configurado.`);
	}
}
