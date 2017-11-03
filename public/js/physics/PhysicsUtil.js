"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PhysicsUtil {
    static doesLineSegmentCollide(A, B, O, P) {
        let AO = { x: 0, y: 0 }, AP = { x: 0, y: 0 }, AB = { x: 0, y: 0 };
        AB.x = B.x - A.x;
        AB.y = B.y - A.y;
        AP.x = P.x - A.x;
        AP.y = P.y - A.y;
        AO.x = O.x - A.x;
        AO.y = O.y - A.y;
        return ((AB.x * AP.y - AB.y * AP.x) * (AB.x * AO.y - AB.y * AO.x) < 0.0);
    }
    static getPartialSegmentCollisionDistance(A, B, O, P) {
        if (!this.doesLineSegmentCollide(A, B, O, P))
            return 1.0;
        let AB = { x: 0, y: 0 }, OP = { x: 0, y: 0 };
        AB.x = B.x - A.x;
        AB.y = B.y - A.y;
        OP.x = P.x - O.x;
        OP.y = P.y - O.y;
        return -(A.x * OP.y - O.x * OP.y - OP.x * A.y + OP.x * O.y) / (AB.x * OP.y - AB.y * OP.x);
    }
    static isPointInCircle(point, center, radius) {
        let d2 = (point.x - center.x) * (point.x - center.x) + (point.y - center.y) * (point.y - center.y);
        return (d2 <= radius * radius);
    }
    static doesCircleCollideWithBoundingBox(A, B, C, radius) {
        var minAB = { x: Math.min(A.x, B.x), y: Math.min(A.y, B.y) };
        var maxAB = { x: Math.max(A.x, B.x), y: Math.max(A.y, B.y) };
        var minC = { x: C.x - radius, y: C.y - radius };
        var maxC = { x: C.x + radius, y: C.y + radius };
        return !(maxAB.x < minC.x ||
            minAB.x > maxC.x ||
            maxAB.y < minC.y ||
            minAB.y > maxC.y);
    }
    static doesPointCollideWithCircle(A, B, C, radius) {
        if (!this.doesCircleCollideWithBoundingBox(A, B, C, radius))
            return false;
        var u = { x: B.x - A.x, y: B.y - A.y };
        var AC = { x: C.x - A.x, y: C.y - A.y };
        var z = u.x * AC.y - u.y * AC.x;
        z = Math.abs(z);
        var denom = Math.sqrt(u.x * u.x + u.y * u.y);
        var CI = z / denom;
        return (CI < radius);
    }
    static doesLineCollideWithCircle(line, C, radius) {
        let A = line.p1;
        let B = line.p2;
        if (this.doesPointCollideWithCircle(A, B, C, radius) == false)
            return false;
        var AB = { x: 0, y: 0 }, AC = { x: 0, y: 0 }, BC = { x: 0, y: 0 };
        AB.x = B.x - A.x;
        AB.y = B.y - A.y;
        AC.x = C.x - A.x;
        AC.y = C.y - A.y;
        BC.x = C.x - B.x;
        BC.y = C.y - B.y;
        var pscal1 = AB.x * AC.x + AB.y * AC.y;
        var pscal2 = (-AB.x) * BC.x + (-AB.y) * BC.y;
        if (pscal1 >= 0 && pscal2 >= 0)
            return true;
        if (this.isPointInCircle(A, C, radius) ||
            this.isPointInCircle(B, C, radius))
            return true;
        return false;
    }
}
exports.default = PhysicsUtil;
//# sourceMappingURL=PhysicsUtil.js.map