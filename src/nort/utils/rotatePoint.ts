export default function rotatePoint (x: number, y: number, rx: number, ry: number, radii: number): { x: number, y: number } {

  const cos = Math.cos(radii);
  const sin = Math.sin(radii);

  const translatedX = x - rx;
  const translatedY = y - ry;

  const resultX = translatedX * cos - translatedY * sin;
  const resultY = translatedX * sin + translatedY * cos;

  return {
    x: resultX + rx,
    y: resultY + ry,
  };

}