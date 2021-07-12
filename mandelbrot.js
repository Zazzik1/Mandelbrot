// Author: Zazzik1
class Mandelbrot {
    iterations = 120;
	maxLoopNr = 30;
	lastTimeout = null;
    rgb = [
        "rgb(66,30,15)",
        "rgb(25,7,26)",
        "rgb(9,1,47)",
        "rgb(4,4,73)",
        "rgb(0,7,100)",
        "rgb(12,44,138)",
        "rgb(24,82,177)",
        "rgb(57,125,209)",
        "rgb(134,181,229)",
        "rgb(211,236,248)",
        "rgb(241,233,191)",
        "rgb(248,201,95)",
        "rgb(255,170,0)",
        "rgb(204,128,0)",
        "rgb(153,87,0)",
        "rgb(106,52,3)"
    ];
    constructor(canvas, doneCallback) {
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.done = doneCallback;
        } else throw "Error: canvas was not given";
    }
    isInSet(a, b) { //decides if the given point (a+bi) belongs to the Mandelbrot series: returns nothing when belongs or no. of iterations in other case
        let aa, bb;
        aa = bb = 0;
        for (let i = 1; i <= this.iterations; i++) { //z' = z^2 + (a+bi)
            let at = aa ** 2 - (bb ** 2) + a;
            bb = 2 * aa * bb + b;
            aa = at;
            if (Math.sqrt(aa ** 2 + (bb ** 2)) > 2) return i // diverges
        }
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
                    this.ctx.fillStyle = this.rgb[color];
                }
                this.ctx.fillRect(x, y, 1, 1);
            }
        }
		if(loopNr < this.maxLoopNr){ //max loopNr - bigger = smoother loading
			this.lastTimeout = setTimeout(this._drawLoop, 0, a, b, w, h, da, db, loopNr + 1);
		} else if(typeof this.done === "function") this.done();
	}
}