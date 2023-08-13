import Mandelbrot from "./Mandelbrot";
import './styles/styles';

let canvas = document.querySelector("#c") as HTMLCanvasElement;
let wheel = document.getElementById("wheel") as HTMLInputElement;
var mandelbrot = new Mandelbrot(canvas);
window.mandelbrot = mandelbrot;
mandelbrot.drawOnCanvas(-2, -1.5, 1, 1.5); //x1, y1, x2, y2

const INPUTS = {
    LEN: document.querySelector("#len") as HTMLInputElement, //width
    LEN2: document.querySelector("#len2") as HTMLInputElement, //height
    X1: document.querySelector("#x1") as HTMLInputElement,
    Y1: document.querySelector("#y1") as HTMLInputElement,
    ITER: document.querySelector("#iter") as HTMLInputElement,
    CSIZE: document.querySelector("#cSize") as HTMLInputElement,
}

let input = {
    get(element: HTMLInputElement) {
        return +element.value
    },
    set(element: HTMLInputElement, value: any) {
        element.value = value
    }
}

function draw() {
    console.log('draw');
    let len = input.get(INPUTS.LEN);
    let len2 = input.get(INPUTS.LEN2);
    if (len <= 0 && len2 <= 0) {
        alert("Width should be > 0");
        return
    };
    if (input.get(INPUTS.ITER) <= 0) {
        alert("iterations are <= 0, corrected to 40");
        input.set(INPUTS.ITER, 40)
    };
    let x1 = input.get(INPUTS.X1);
    let y1 = input.get(INPUTS.Y1);
    mandelbrot.iterations = input.get(INPUTS.ITER);
    mandelbrot.drawOnCanvas(x1, y1, x1 + len, y1 + len2);
}

function reset() {
if (canvas == null) throw new Error('canvas is not defined');
    input.set(INPUTS.LEN, 3);
    input.set(INPUTS.LEN2, 3 / canvas.width * canvas.height);
    input.set(INPUTS.X1, -2);
    input.set(INPUTS.Y1, -1.5);
    draw();
}
 
function click(rX: number, rY: number, mult: number = 2) { //0-1 fraction
    let x = input.get(INPUTS.X1);
    let y = input.get(INPUTS.Y1);
    input.set(INPUTS.LEN, input.get(INPUTS.LEN) / mult);
    input.set(INPUTS.LEN2, input.get(INPUTS.LEN2) / mult);
    let len = input.get(INPUTS.LEN);
    let len2 = input.get(INPUTS.LEN2);
    input.set(INPUTS.X1, rX * len * mult + x - (len / 2));
    input.set(INPUTS.Y1, rY * len2 * mult + y - (len2 / 2));
    draw();
}
 
function download() {
    var link = document.createElement('a');
    link.download = 'mandelbrot.png';
    link.href = canvas.toDataURL("image/png", 1.0); // type, quality
    link.click();
}
 
// event listeners
canvas.addEventListener("mousedown", e => {
    if (e.button == 0) {
        click(e.offsetX / canvas.width, e.offsetY / canvas.height);
    } else if (e.button == 2) click(e.offsetX / canvas.width, e.offsetY / canvas.height, 0.5);
});
 
canvas.addEventListener("wheel", e => {
    if(!wheel.checked) {
        e.preventDefault();
        return false
    }
    if(e.deltaY > 0) {
        click(e.offsetX / canvas.width, e.offsetY / canvas.height, 1.4);
    } else if(e.deltaY < 0) click(e.offsetX / canvas.width, e.offsetY / canvas.height, 1/1.4);
});

canvas.addEventListener("contextmenu", e => e.preventDefault());
document.getElementById("reset")?.addEventListener("click", e => reset());
document.getElementById("zoom_plus")?.addEventListener("click", e => click(0.5, 0.5));
document.getElementById("zoom_minus")?.addEventListener("click", e => click(0.5, 0.5, 0.5));
document.getElementById("download")?.addEventListener("click", e => download());
INPUTS.ITER.addEventListener("change", draw);
 
INPUTS.CSIZE.addEventListener("change", () => {
    let size = INPUTS.CSIZE.value.split("x");
    canvas.width = +size[0];
    canvas.height = +size[1];
    input.set(INPUTS.LEN2, input.get(INPUTS.LEN) / canvas.width * canvas.height);
    draw();
});