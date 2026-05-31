export {};

declare global {
  interface String {
    capitalize(): string;
  }

  interface Object {
    keys<T extends object>(this: T): (keyof T)[];
  }
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function(this: string) {return this.charAt(0).toUpperCase() + this.slice(1)},
  enumerable: false,
  configurable: false,
  writable: false,
});

Object.defineProperty(Object.prototype, 'keys', {
  value: function(this: object) {
    return Object.keys(this)
  },
  enumerable: false,
  configurable: false,
  writable: false,
});
