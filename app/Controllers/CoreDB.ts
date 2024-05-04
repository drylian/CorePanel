import { Global } from '@/Configurations';
import { DataSource, MixedList, EntitySchema, DatabaseType } from 'typeorm';
import LoggingsTypeORM from './Database/Logger';

export class CoreDB {
    public inited: boolean;
    static connection: InstanceType<typeof DataSource> | null = null;
    static entities: MixedList<string | Function | EntitySchema<any>>[] = [];
    constructor() {
        this.inited = false;
    }
    public preset() {
        CoreDB.connection = new DataSource({
            type: (Global['db_dialect']).get as any,
            host: Global['db_host'].get,
            password: Global['db_pass'].get,
            port: Global['db_port'].get,
            username: Global['db_user'].get,
            database: Global['db_database'].get,
            synchronize: true,
            logger: new LoggingsTypeORM(),
            entities: CoreDB.entities as any
        })
    }
}
export const DBcore = new CoreDB();