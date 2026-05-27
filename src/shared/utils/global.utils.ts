export {};

declare global {
  interface String {
    capitalize(): string;
  }
}

Object.defineProperty(String.prototype, 'capitalize', {
  value: function(this: string) {return this.charAt(0).toUpperCase() + this.slice(1)},
  enumerable: false,
  configurable: false,
  writable: false,
});
