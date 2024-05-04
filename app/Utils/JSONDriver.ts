
import { merge } from "lodash";
import { dirCR, dirEX } from "./Folder";
import path from "path";
import { json, jsonsv } from "./Json";

export type JSONParse<Data> = {
    [K in keyof Data]: Data[K];
};

/**
 * Represents a collection of key-value pairs.
 * @template DataType - The type of data to be stored in the collection.
 */
export class JSONDriver<DataType> {
    private items: JSONParse<DataType>;
    private locale: {
        dirname: string,
        filename: string
    };
    /**
     * Creates a new instance of Collection.
     */
    constructor(pather: string) {
        if (pather) {
            const file = pather.endsWith(".json") ? pather : pather + ".json"
            this.locale = {
                dirname: path.dirname(file),
                filename: path.basename(file)
            }
            if (!dirEX(path.dirname(file))) dirCR(path.dirname(file))
            if (dirEX(file)) {
                this.items = json(path.join(this.locale.dirname, this.locale.filename));
            } else {
                this.items = {} as JSONParse<DataType>;
            }
        } else {
            this.locale = {
                dirname: "",
                filename: ""
            }
            this.items = {} as JSONParse<DataType>;
        }
    }

    /**
     * Finds the first key in the collection that matches the provided value.
     * @template K - The type of key in the collection.
     * @param {K} key - The key to search for in the collection.
     * @param {DataType[K]} value - The value associated with the key to be searched.
     * @returns {K | undefined} - The first key in the collection that matches the provided value, or undefined if no value matches.
     */
    public find<K extends keyof DataType[keyof DataType]>(key: K, value: DataType[keyof DataType][K]): keyof DataType | undefined {
        for (const [rootkey, cValue] of this.entries()) {
            if (cValue[key] === value) {
                return rootkey
            }
        }
        return undefined;
    }

    /**
     * Sets a value for the specified key in the collection.
     * If the key already exists, updates its corresponding value.
     * @param {keyof DataType} key - The key to set.
     * @param {DataType[keyof DataType]} value - The value to associate with the key.
     */
    public set<K extends keyof DataType>(key: K, value: DataType[K]) {
        return this.items[key] = value;
    }

    public save(force = true) {
        jsonsv(path.join(this.locale.dirname, this.locale.filename), this.items, force);
    }

    /**
     * Merges an object with the existing value associated with the specified key.
     * If the existing value is an object, the properties of the given object are merged with it.
     * Otherwise, sets the given object as the value for the key.
     * @param {keyof DataType} key - The key to merge or set.
     * @param {Partial<DataType>} obj - The object to merge or set as the value.
     */
    public merge<K extends keyof DataType>(key: K, obj: Partial<DataType[K]>) {
        const existingValue = this.get(key);
        if (existingValue && typeof existingValue === "object" && typeof obj === "object") {
            return this.set(key, merge(existingValue, obj));
        } else {
            return this.set(key, obj as DataType[K]);
        }
    }

    /**
     * Gets the value associated with the specified key from the collection.
     * @param {keyof DataType} key - The key to get the value for.
     * @returns {DataType[keyof DataType] | undefined} - The value associated with the key, or undefined if the key is not found.
     */
    public get<K extends keyof DataType>(key: K): DataType[K] | undefined {
        return this.items[key];
    }

    /**
     * Checks whether the collection contains the specified key.
     * @param {keyof DataType} key - The key to check for.
     * @returns {boolean} - True if the key exists in the collection, otherwise false.
     */
    public has<K extends keyof DataType>(key: K): boolean {
        return key in this.items;
    }

    /**
     * Deletes the key and its associated value from the collection.
     * @param {keyof DataType} key - The key to delete.
     * @returns {boolean} - True if the key was found and deleted, otherwise false.
     */
    public delete<K extends keyof DataType>(key: K): boolean {
        if (this.has(key)) {
            delete this.items[key];
            return true;
        }
        return false;
    }

    /**
     * Removes all keys and values from the collection.
     */
    public clear(): void {
        this.items = {} as JSONParse<DataType>;
    }

    /**
     * Gets the number of key-value pairs in the collection.
     * @returns {number} - The number of key-value pairs in the collection.
     */
    public get size(): number {
        return Object.keys(this.items).length;
    }

    /**
     * Gets an array containing all keys in the collection.
     * @returns {keyof DataType[]} - An array of keys.
     */
    public keys(): (keyof DataType)[] {
        return Object.keys(this.items) as (keyof DataType)[];
    }

    /**
     * Gets an array containing all values in the collection.
     * @returns {DataType[keyof DataType][]} - An array of values.
     */
    public values(): (DataType[keyof DataType])[] {
        return Object.values(this.items);
    }

    /**
     * Gets an array containing all key-value pairs in the collection.
     * @returns {[keyof DataType, DataType[keyof DataType]][]} - An array of key-value pairs.
     */
    public entries(): [keyof DataType, DataType[keyof DataType]][] {
        return Object.entries(this.items) as [keyof DataType, DataType[keyof DataType]][];
    }
}
