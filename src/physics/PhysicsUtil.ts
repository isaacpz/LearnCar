import { line } from '../components/line';
import { point } from '../components/point';

export default class PhysicsUtil {

    static doLineSegmentsCollide(line1: line, line2: line): boolean {
        let A = line1.p1;
        let B = line1.p2;
        let O = line2.p1;
        let P = line2.p2;
        let AO: point = { x: 0, y: 0 },
            AP: point = { x: 0, y: 0 },
            AB: point = { x: 0, y: 0 };

        AB.x = B.x - A.x;
        AB.y = B.y - A.y;
        AP.x = P.x - A.x;
        AP.y = P.y - A.y;
        AO.x = O.x - A.x;
        AO.y = O.y - A.y;

        return ((AB.x * AP.y - AB.y * AP.x) * (AB.x * AO.y - AB.y * AO.x) < 0.0);
    }

    static getPartialSegmentCollisionDistance(line1: line, line2: line): number {
        if (!this.doLineSegmentsCollide(line1, line2))
            return 1.0;

        let A = line1.p1;
        let B = line1.p2;
        let O = line2.p1;
        let P = line2.p2;

        let AB: point = { x: 0, y: 0 },
            OP: point = { x: 0, y: 0 };

        AB.x = B.x - A.x;
        AB.y = B.y - A.y;
        OP.x = P.x - O.x;
        OP.y = P.y - O.y;

        return -(A.x * OP.y - O.x * OP.y - OP.x * A.y + OP.x * O.y) / (AB.x * OP.y - AB.y * OP.x);
    }


    static isPointInCircle(point: point, center: point, radius: number): boolean {
        let d2 = (point.x - center.x) * (point.x - center.x) + (point.y - center.y) * (point.y - center.y);
        return (d2 <= radius * radius);
    }

    static doesCircleCollideWithBoundingBox(A: point, B: point, C: point, radius: number): boolean {
        var minAB = { x: Math.min(B.x, A.x), y: Math.min(A.y, B.y) };
        var maxAB = { x: Math.max(A.x, B.x), y: Math.max(A.y, B.y) };
        var minC = { x: C.x - radius, y: C.y - radius };
        var maxC = { x: C.x + radius, y: C.y + radius };

        return !(maxAB.x < minC.x ||
            minAB.x > maxC.x ||
            maxAB.y < minC.y ||
            minAB.y > maxC.y);
    }

    static doesPointCollideWithCircle(A: point, B: point, C: point, radius: number): boolean {
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

    static doesLineCollideWithCircle(line: line, C: point, radius: number): boolean {
        //Make points
        let A: point = line.p1;
        let B: point = line.p2;

        if (this.doesPointCollideWithCircle(A, B, C, radius) == false)
            return false;  //If it's not touching the right, it can't touch the segment

        var AB: point = { x: 0, y: 0 },
            AC: point = { x: 0, y: 0 },
            BC: point = { x: 0, y: 0 };

        AB.x = B.x - A.x;
        AB.y = B.y - A.y;
        AC.x = C.x - A.x;
        AC.y = C.y - A.y;
        BC.x = C.x - B.x;
        BC.y = C.y - B.y;

        var pscal1 = AB.x * AC.x + AB.y * AC.y;  // scalar product
        var pscal2 = (-AB.x) * BC.x + (-AB.y) * BC.y;

        if (pscal1 >= 0 && pscal2 >= 0)
            return true;

        // is a or b in the circle?
        if (this.isPointInCircle(A, C, radius) ||
            this.isPointInCircle(B, C, radius))
            return true;

        return false;
    }

    static rotateVec2(point: point, center: point, angle: number): point {
        var newPos: point = { x: 0, y: 0 };

        var cos_a = Math.cos(angle);
        var sin_a = Math.sin(angle);

        newPos.x = center.x + (point.x - center.x) * cos_a + (point.y - center.y) * sin_a;
        newPos.y = center.y + (point.x - center.x) * sin_a - (point.y - center.y) * cos_a;

        return newPos;
    }

}
