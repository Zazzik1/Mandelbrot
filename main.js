 // Author: Zazzik1
import Mandelbrot from './mandelbrot.js';

let canvas = document.getElementById("c");
var m = new Mandelbrot(canvas);
m.drawOnCanvas(-2, -1.5, 1, 1.5); //x1, y1, x2, y2

let input = {
    LEN: document.getElementById("len"), //width
    LEN2: document.getElementById("len2"), //height
    X1: document.getElementById("x1"),
    Y1: document.getElementById("y1"),
    ITER: document.getElementById("iter"),
    CSIZE: document.getElementById("cSize"),
    get(id) {
        return parseFloat(id.value)
    },
    set(id, value) {
        id.value = value
    }
}

function draw() {
    let len = input.get(input.LEN);
    let len2 = input.get(input.LEN2);
    if (len <= 0 && len2 <= 0) {
        alert("Width should be > 0");
        return
    };
    if (input.get(input.ITER) <= 0) {
        alert("iterations are <= 0, corrected to 40");
        input.set(input.ITER, 40)
    };
    let x1 = input.get(input.X1);
    let y1 = input.get(input.Y1);
    m.iterations = input.get(input.ITER);
    m.drawOnCanvas(x1, y1, x1 + len, y1 + len2);
}

function reset() {
    input.set(input.LEN, 3);
    input.set(input.LEN2, 3 / canvas.width * canvas.height);
    input.set(input.X1, -2);
    input.set(input.Y1, -1.5);
    draw();
}

canvas.addEventListener("mousedown", e => {
    if (e.button == 0) {
        click(e.offsetX / canvas.width, e.offsetY / canvas.height);
    } else if (e.button == 2) click(e.offsetX / canvas.width, e.offsetY / canvas.height, 0.5);
});

canvas.addEventListener("contextmenu", e => e.preventDefault());
document.getElementById("reset").addEventListener("click", e => reset());
document.getElementById("zoom_plus").addEventListener("click", e => click(0.5, 0.5));
document.getElementById("zoom_minus").addEventListener("click", e => click(0.5, 0.5, 0.5));
document.getElementById("download").addEventListener("click", e => download());
input.ITER.addEventListener("change", () => draw());

input.CSIZE.addEventListener("change", () => {
    let size = document.getElementById("cSize").value.split("x");
    canvas.width = size[0];
    canvas.height = size[1];
    input.set(input.LEN2, input.get(input.LEN) / canvas.width * canvas.height);
    draw();
});

function click(rX, rY, mult = 2) { //0-1 fraction
    let x = input.get(input.X1);
    let y = input.get(input.Y1);
    input.set(input.LEN, input.get(input.LEN) / mult);
    input.set(input.LEN2, input.get(input.LEN2) / mult);
    let len = input.get(input.LEN);
    let len2 = input.get(input.LEN2);
    input.set(input.X1, rX * len * mult + x - (len / 2));
    input.set(input.Y1, rY * len2 * mult + y - (len2 / 2));
    draw();
}

function download() {
    var link = document.createElement('a');
    link.download = 'mandelbrot.png';
    link.href = canvas.toDataURL("image/png", 1.0); // type, quality
    link.click();
}