export interface Identifiable {
  id: string;
}

export class Library<T extends Identifiable> {
  private items: T[] = [];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  public add(item: T): void {
    const exists = this.items.some((i) => i.id === item.id);
    if (exists) {
      throw new Error(`Елемент з id ${item.id} вже існує.`);
    }
    this.items.push(item);
  }

  public remove(id: string): boolean {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    return this.items.length !== initialLength;
  }

  public find(predicate: (item: T) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  public findById(id: string): T | undefined {
    return this.find((item) => item.id === id);
  }

  public getAll(): T[] {
    return [...this.items];
  }

  public filter(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}
