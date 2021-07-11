// Author: Zazzik1
class Mandelbrot {
    iterations = 120;
	maxLoopNr = 30;
	lastTimeout = null;
    rgb = [
        [66, 30, 15],
        [25, 7, 26],
        [9, 1, 47],
        [4, 4, 73],
        [0, 7, 100],
        [12, 44, 138],
        [24, 82, 177],
        [57, 125, 209],
        [134, 181, 229],
        [211, 236, 248],
        [241, 233, 191],
        [248, 201, 95],
        [255, 170, 0],
        [204, 128, 0],
        [153, 87, 0],
        [106, 52, 3]
    ];
    constructor(canvas) {
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
        } else throw "Error: canvas was not given";
    }
    isInSet(a, b) { //decides if the given point (a+bi) belongs to the Mandelbrot series
        let aa = 0;
        let bb = 0;
        let i = 0;
        for (; i < this.iterations; i++) { //z' = z^2 + (a+bi)
            let at = aa * aa - (bb * bb) + a;
            bb = 2 * aa * bb + b;
            aa = at;
            if (Math.sqrt(aa * aa + (bb * bb)) > 2) break; //if diverges - break
        }
        return (Math.sqrt(aa * aa + (bb * bb)) < 2) ? 1 : ({
            i: i
        }); //if converges return 1; if diverges return object with number of iterations
    }
    drawOnCanvas(a, b, ea, eb) { //x1, y1, x2, y2
		if(this.lastTimeout) clearTimeout(this.lastTimeout);
        let w = this.canvas.width;
		let h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);
        const da = (ea - a) / w;
        const db = (eb - b) / h;
        this.drawLoop(this, a, b, w, h, da, db);
    }
	drawLoop(self, a, b, w, h, da, db, loopNr = 0){
		for (let x = 0; x < w; x++) {
            for (let y = loopNr; y < h; y+=self.maxLoopNr) {
				if(self.stop) return;
                let point = self.isInSet(a + (x * da), b + (y * db));
                if (point == 1) { //point belongs to the set
                    self.ctx.fillStyle = "black";
                } else { //colors outer points
                    let color = point.i % 16;
                    self.ctx.fillStyle = "rgb(" + self.rgb[color][0] + "," + self.rgb[color][1] + "," + self.rgb[color][2] + ")";
                }
                self.ctx.fillRect(x, y, 1, 1);
            }
        }
		if(loopNr < self.maxLoopNr){ //max loopNr - bigger = smoother loading
			self.lastTimeout = setTimeout(self.drawLoop, 0, self, a, b, w, h, da, db, loopNr + 1);
		}
	}
}