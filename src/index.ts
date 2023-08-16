import Mandelbrot from "~/Mandelbrot";
import { CANVAS_SIZES, SUGGESTED_ITERATIONS, ZOOM_MULTIPLIER } from "~/constants";
import '~/styles/styles';

const iterationsDatalist = document.querySelector('#iterations') as HTMLSelectElement;
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const wheel = document.querySelector("#wheel") as HTMLInputElement;
const mandelbrot = new Mandelbrot(canvas);
if (process.env.NODE_ENV === 'development') window.mandelbrot = mandelbrot;

const INPUTS = {
    LEN: document.querySelector("#len") as HTMLInputElement, //width
    LEN2: document.querySelector("#len2") as HTMLInputElement, //height
    X1: document.querySelector("#x1") as HTMLInputElement,
    Y1: document.querySelector("#y1") as HTMLInputElement,
    ITER: document.querySelector("#iter") as HTMLInputElement,
    CSIZE: document.querySelector("#cSize") as HTMLInputElement,
    COLOR_OFFSET: document.querySelector("#color-offset") as HTMLInputElement,
}

const input = {
    get(element: HTMLInputElement) {
        return +element.value
    },
    set(element: HTMLInputElement, value: any) {
        element.value = value
    }
}

addListeners();
initializeDatasetsAndSelects();
loadInitialStateFromURLParams();
draw();

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
    mandelbrot.colorOffset = +input.get(INPUTS.COLOR_OFFSET);
    mandelbrot.draw(x1, y1, x1 + len, y1 + len2);
    setTimeout(() => {
        // mandelbrot.forceStopWorkers()
    }, 500)
}

function reset() {
    if (canvas == null) throw new Error('canvas is not defined');
    input.set(INPUTS.LEN, 3);
    input.set(INPUTS.LEN2, 3 / canvas.width * canvas.height);
    input.set(INPUTS.X1, -2);
    input.set(INPUTS.Y1, -1.5);
    input.set(INPUTS.COLOR_OFFSET, 0);
    clearURLParamsState();
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
    updateURLParamsState();
    draw();
}

function download() {
    const link = document.createElement('a');
    link.download = 'mandelbrot.png';
    link.href = canvas.toDataURL("image/png", 1.0); // type, quality
    link.click();
}

function clearURLParamsState() {
    window.history.pushState({}, '', window.location.origin + window.location.pathname);
}

function updateURLParamsState() {
    const params = new URLSearchParams(document.location.search);
    params.set('x1', input.get(INPUTS.X1).toString());
    params.set('y1', input.get(INPUTS.Y1).toString());
    params.set('x2', (input.get(INPUTS.X1) + input.get(INPUTS.LEN)).toString());
    params.set('y2', (input.get(INPUTS.Y1) + input.get(INPUTS.LEN2)).toString());
    params.set('i', input.get(INPUTS.ITER).toString());
    params.set('colorOffset', input.get(INPUTS.COLOR_OFFSET).toString());
    window.history.pushState({}, '', `?${params.toString()}`);
}

function loadInitialStateFromURLParams() {
    const params = new URLSearchParams(document.location.search);
    let i = params.get('i');
    let x1 = params.get('x1');
    let y1 = params.get('y1');
    let x2 = params.get('x2');
    let y2 = params.get('y2');
    let colorOffset = params.get('colorOffset');
    if (!i || Number.isNaN(+i)) i = '120';
    if (!x1 || Number.isNaN(+x1)) x1 = '-2';
    if (!x2 || Number.isNaN(+x2)) x2 = '1';
    if (!y1 || Number.isNaN(+y1)) y1 = '-1.5';
    if (!y2 || Number.isNaN(+y2)) y2 = '1.5';
    if (!colorOffset || Number.isNaN(+colorOffset)) colorOffset = '0';
    
    input.set(INPUTS.X1, x1);
    input.set(INPUTS.Y1, y1);
    input.set(INPUTS.LEN, x2 ? (+x2) - input.get(INPUTS.X1) : -1.5);
    input.set(INPUTS.LEN2, y2 ? (+y2) - input.get(INPUTS.Y1) : 1.5);
    input.set(INPUTS.COLOR_OFFSET, colorOffset);
    input.set(INPUTS.ITER, i);
}

function initializeDatasetsAndSelects() {
    for (let iterations of SUGGESTED_ITERATIONS) {
        const option = document.createElement('option');
        option.value = iterations.toString();
        iterationsDatalist.appendChild(option)
    }
    
    for (let { name, value } of CANVAS_SIZES) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = name;
        INPUTS.CSIZE.appendChild(option);
    }
}
 
function addListeners() {
    canvas.addEventListener("mousedown", e => {
        if (e.button == 0) return click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.CLICK_ZOOM_IN);
        if (e.button == 2) return click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.CLICK_ZOOM_OUT);
    });
     
    canvas.addEventListener("wheel", e => {
        e.preventDefault();
        e.stopPropagation();
        if(!wheel.checked) return;
    
        if(e.deltaY < 0) {
            click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.SCROLL_ZOOM_IN);
        } else click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.SCROLL_ZOOM_OUT);
    });
    
    canvas.addEventListener("contextmenu", e => e.preventDefault());
    document.getElementById("reset")?.addEventListener("click", e => reset());
    document.getElementById("zoom_plus")?.addEventListener("click", e => click(0.5, 0.5));
    document.getElementById("zoom_minus")?.addEventListener("click", e => click(0.5, 0.5, 0.5));
    document.getElementById("download")?.addEventListener("click", e => download());
    INPUTS.ITER.addEventListener("change", () => {
        updateURLParamsState();
        draw();
    });
    INPUTS.COLOR_OFFSET.addEventListener('change', () => {
        updateURLParamsState();
        draw();
    });
    
    INPUTS.CSIZE.addEventListener("change", () => {
        let [width, height] = INPUTS.CSIZE.value.split("x");
        canvas.width = +width;
        canvas.height = +height;
        input.set(INPUTS.LEN2, input.get(INPUTS.LEN) / canvas.width * canvas.height);
        draw();
    });
}