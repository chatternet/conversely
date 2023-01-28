import { IdName } from "chatternet-client-http";

export interface LoginInfo {
  did: string;
  password: string;
}

export interface NameTime {
  name: string;
  timestamp: number;
}

/**
 * Map IDs to most recent name.
 */
export class IdToName {
  constructor(
    private readonly idToNameTime: Map<string, NameTime> = new Map()
  ) {}

  /**
   * Update the name for an ID.
   *
   * Adds a new name, or updates an existing name only if the timestamp is
   * larger than the previous name's timestamp.
   *
   * Returns `this` if the update does not change the state, or else returns
   * a copy of the object (sharing the same underlying map) to allow react
   * state to track changes.
   *
   * @param id the id
   * @param name the name
   * @param timestamp the timestamp at which this name was published
   * @returns the same or a new `IdToName` object
   */
  update(id: string, name: string | undefined, timestamp: number): IdToName {
    const lastTimestamp = this.idToNameTime.get(id)?.timestamp;
    if (lastTimestamp != null && timestamp <= lastTimestamp) return this;
    if (name == null) {
      this.idToNameTime.delete(id);
    } else {
      this.idToNameTime.set(id, { name, timestamp });
    }
    return new IdToName(this.idToNameTime);
  }

  get(id: string): string | undefined {
    return this.idToNameTime.get(id)?.name;
  }

  getIdNames(): IdName[] {
    return [...this.idToNameTime.entries()].map(
      ([id, { name, timestamp }]) => ({
        id,
        name,
        timestamp,
      })
    );
  }

  isEmpty(): boolean {
    return this.idToNameTime.size <= 0;
  }
}
