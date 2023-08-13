import Mandelbrot from "./Mandelbrot";
import { ZOOM_MULTIPLIER } from "./constants";
import './styles/styles';

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const wheel = document.querySelector("#wheel") as HTMLInputElement;
const mandelbrot = new Mandelbrot(canvas);
if (process.env.NODE_ENV === 'development') window.mandelbrot = mandelbrot;
mandelbrot.draw(-2, -1.5, 1, 1.5); //x1, y1, x2, y2

const INPUTS = {
    LEN: document.querySelector("#len") as HTMLInputElement, //width
    LEN2: document.querySelector("#len2") as HTMLInputElement, //height
    X1: document.querySelector("#x1") as HTMLInputElement,
    Y1: document.querySelector("#y1") as HTMLInputElement,
    ITER: document.querySelector("#iter") as HTMLInputElement,
    CSIZE: document.querySelector("#cSize") as HTMLInputElement,
}

const input = {
    get(element: HTMLInputElement) {
        return +element.value
    },
    set(element: HTMLInputElement, value: any) {
        element.value = value
    }
}

function draw() {
    let len = input.get(INPUTS.LEN);
    let len2 = input.get(INPUTS.LEN2);
    if (len <= 0 && len2 <= 0) return alert("Width should be > 0");
    if (input.get(INPUTS.ITER) <= 0) {
        alert("iterations are <= 0, corrected to 40");
        input.set(INPUTS.ITER, 40)
    };
    let x1 = input.get(INPUTS.X1);
    let y1 = input.get(INPUTS.Y1);
    mandelbrot.iterations = input.get(INPUTS.ITER);
    mandelbrot.draw(x1, y1, x1 + len, y1 + len2);
}

function reset() {
if (canvas == null) throw new Error('canvas is not defined');
    input.set(INPUTS.LEN, 3);
    input.set(INPUTS.LEN2, 3 / canvas.width * canvas.height);
    input.set(INPUTS.X1, -2);
    input.set(INPUTS.Y1, -1.5);
    draw();
}
 
function click(rX: number, rY: number, mult: ZOOM_MULTIPLIER = ZOOM_MULTIPLIER.CLICK_ZOOM_IN) {
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
    const link = document.createElement('a');
    link.download = 'mandelbrot.png';
    link.href = canvas.toDataURL("image/png", 1.0); // type, quality
    link.click();
}
 
// event listeners
canvas.addEventListener("mousedown", e => {
    if (e.button == 0) return click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.CLICK_ZOOM_IN);
    if (e.button == 2) return click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.CLICK_ZOOM_OUT);
});
 
canvas.addEventListener("wheel", e => {
    if(!wheel.checked) {
        e.preventDefault();
        return false
    }
    if(e.deltaY > 0) {
        click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.SCROLL_ZOOM_IN);
    } else if(e.deltaY < 0) click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.SCROLL_ZOOM_OUT);
});

canvas.addEventListener("contextmenu", e => e.preventDefault());
document.getElementById("reset")?.addEventListener("click", e => reset());
document.getElementById("zoom_plus")?.addEventListener("click", e => click(0.5, 0.5));
document.getElementById("zoom_minus")?.addEventListener("click", e => click(0.5, 0.5, 0.5));
document.getElementById("download")?.addEventListener("click", e => download());
INPUTS.ITER.addEventListener("change", draw);
 
INPUTS.CSIZE.addEventListener("change", () => {
    let [width, height] = INPUTS.CSIZE.value.split("x");
    canvas.width = +width;
    canvas.height = +height;
    input.set(INPUTS.LEN2, input.get(INPUTS.LEN) / canvas.width * canvas.height);
    draw();
});