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
    constructor(canvas, doneCallback) {
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.done = doneCallback;
        } else throw "Error: canvas was not given";
    }
    isInSet(a, b) { //decides if the given point (a+bi) belongs to the Mandelbrot series: returns nothing when belongs or no. of iterations in other case
        let aa, bb, i;
        aa = bb = i = 0;
        for (; i < this.iterations; i++) { //z' = z^2 + (a+bi)
            let at = aa ** 2 - (bb ** 2) + a;
            bb = 2 * aa * bb + b;
            aa = at;
            if (Math.sqrt(aa ** 2 + (bb ** 2)) > 2) return i // diverges
        }
        return // convergence
    }
    drawOnCanvas(a, b, ea, eb) { //x1, y1, x2, y2 - function used for actual drawing
		if(this.lastTimeout) clearTimeout(this.lastTimeout);
        let w = this.canvas.width;
		let h = this.canvas.height;
        this.ctx.clearRect(0, 0, w, h);
        const da = (ea - a) / w;
        const db = (eb - b) / h;
        this._drawLoop(a, b, w, h, da, db);
    }
	_drawLoop = (a, b, w, h, da, db, loopNr = 0) => {
		for (let x = 0; x < w; x++) {
            for (let y = loopNr; y < h; y+=this.maxLoopNr) {
				if(this.stop) return;
                let point = this.isInSet(a + (x * da), b + (y * db));
                if (!point) { //point belongs to the set
                    this.ctx.fillStyle = "black";
                } else { //colors outer points
                    let color = point % 16;
                    this.ctx.fillStyle = "rgb(" + this.rgb[color][0] + "," + this.rgb[color][1] + "," + this.rgb[color][2] + ")";
                }
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
		if(loopNr < this.maxLoopNr){ //max loopNr - bigger = smoother loading
			this.lastTimeout = setTimeout(this._drawLoop, 0, a, b, w, h, da, db, loopNr + 1);
		} else if(typeof this.done === "function") this.done();
	}
}