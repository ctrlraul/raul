export default class HSLA {

  static random () {
    return new HSLA(
      Math.round(Math.random() * 360),
      70 + Math.random() * 30,
      40 + Math.random() * 20,
    );
  }


  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  a: number; // 0-1

  constructor (h = 0, s = 0, l = 0, a = 1) {
    this.h = h;
    this.s = s;
    this.l = l;
    this.a = a;
  }

  public toCSS () {
    return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
  }

  public withLightness (l: number): HSLA {
    return new HSLA(this.h, this.s, l, this.a);
  }

  public copy (): HSLA {
    return new HSLA(this.h, this.s, this.l, this.a);
  }

  public mutate (amount: number = 1): this {
    this.h += amount * 11.25 * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    this.s += amount * 5     * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    this.l += amount * 5     * Math.random() * (Math.random() > 0.5 ? 1 : -1);
    return this;
  }

  public setL (lightness: number): this {
    this.l = lightness;
    return this;
  }

  public setA (alpha: number): this {
    this.a = alpha;
    return this;
  }

}
