export class Storage {
  private static isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  public static get<T>(key: string): T[] {
    if (!this.isAvailable()) {
      return [];
    }
    const data = localStorage.getItem(key);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data) as T[];
    } catch {
      return [];
    }
  }

  public static set<T>(key: string, data: T[]): void {
    if (!this.isAvailable()) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(data));
  }

  public static remove(key: string): void {
    if (!this.isAvailable()) {
      return;
    }
    localStorage.removeItem(key);
  }

  public static clear(): void {
    if (!this.isAvailable()) {
      return;
    }
    localStorage.clear();
  }
}
