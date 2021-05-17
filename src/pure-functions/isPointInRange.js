export default function isPointInRange(x, y ,obj) {
  return !(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height);
}