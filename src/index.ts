import Mandelbrot from "~/Mandelbrot";
import { CANVAS_SIZES, DEFAULT_CONVERGED_COLOR, DEFAULT_ITERATIONS, DOWNLOADED_FILE_NAME, RGB_PALETTES, SUGGESTED_ITERATIONS, ZOOM_MULTIPLIER } from "~/constants";
import '~/styles/styles';
import StateManager from "~/utils/StateManager/StateManager";
import URLSearchParamsStrategy from "~/utils/StateManager/strategies/URLSearchParamsStrategy";
import { AppState, RGBColorPalette } from "~/types";

const stateManager = new StateManager<AppState>(URLSearchParamsStrategy);
const iterationsDatalist = document.querySelector('#iterations') as HTMLSelectElement;
const colorPaletteSelectElement = document.querySelector("#color-palette") as HTMLSelectElement;
const colorConvergedInput = document.querySelector("#color-converged") as HTMLInputElement;
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
        alert("iterations are <= 0, corrected to 25");
        input.set(INPUTS.ITER, 25)
    };
    let x1 = input.get(INPUTS.X1);
    let y1 = input.get(INPUTS.Y1);
    mandelbrot.setIterations(input.get(INPUTS.ITER));
    mandelbrot.setColorOffset(input.get(INPUTS.COLOR_OFFSET));
    mandelbrot.setColorPalette(RGB_PALETTES[colorPaletteSelectElement.value]);
    mandelbrot.setConvergedColor(colorConvergedInput.value);
    mandelbrot.draw(x1, y1, x1 + len, y1 + len2);
}

function reset() {
    stateManager.clearState();
    loadInitialStateFromURLParams();
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
    updateState();
    draw();
}

function download() {
    const link = document.createElement('a');
    link.download = DOWNLOADED_FILE_NAME;
    link.href = canvas.toDataURL("image/png", 1.0); // type, quality
    link.click();
}

function updateState() {
    stateManager.setState({
        x1: input.get(INPUTS.X1).toString(),
        y1: input.get(INPUTS.Y1).toString(),
        x2: (input.get(INPUTS.X1) + input.get(INPUTS.LEN)).toString(),
        y2: (input.get(INPUTS.Y1) + input.get(INPUTS.LEN2)).toString(),
        i: input.get(INPUTS.ITER).toString(),
        colorOffset: input.get(INPUTS.COLOR_OFFSET).toString(),
    })
}

function loadInitialStateFromURLParams() {
    let { x1, x2, y1, y2, i, colorOffset } = stateManager.getState();
    if (!i || Number.isNaN(+i)) i = DEFAULT_ITERATIONS.toString();
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
    colorPaletteSelectElement.value = Object.keys(RGB_PALETTES)[0];
    colorConvergedInput.value = `rgb(${DEFAULT_CONVERGED_COLOR.join(',')})`;
}

function initializeDatasetsAndSelects() {
    for (let iterations of SUGGESTED_ITERATIONS) {
        const option = document.createElement('option');
        option.value = iterations.toString();
        iterationsDatalist.appendChild(option)
    }
    
    for (let { name, value, selected } of CANVAS_SIZES) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = name;
        if (selected) {
            option.selected = true;
            let [width, height] = value.split("x");
            canvas.width = +width;
            canvas.height = +height;
        }
        INPUTS.CSIZE.appendChild(option);
    }

    for (let paletteName of Object.keys(RGB_PALETTES)) {
        const option = document.createElement('option');
        option.value = paletteName;
        option.textContent = paletteName;
        colorPaletteSelectElement.appendChild(option);
    }
}
 
function addListeners() {
    canvas.addEventListener("mousedown", e => {
        if (e.button == 0) return click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.CLICK_ZOOM_IN);
        if (e.button == 2) return click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.CLICK_ZOOM_OUT);
    });
     
    canvas.addEventListener("wheel", e => {
        if(!wheel.checked) return;
        e.preventDefault();
        e.stopPropagation();
    
        if(e.deltaY < 0) {
            click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.SCROLL_ZOOM_IN);
        } else click(e.offsetX / canvas.width, e.offsetY / canvas.height, ZOOM_MULTIPLIER.SCROLL_ZOOM_OUT);
    });
    
    canvas.addEventListener("contextmenu", e => e.preventDefault());
    document.getElementById("reset")?.addEventListener("click", e => reset());
    document.getElementById("zoom_plus")?.addEventListener("click", e => click(0.5, 0.5));
    document.getElementById("zoom_minus")?.addEventListener("click", e => click(0.5, 0.5, 0.5));
    document.getElementById("download")?.addEventListener("click", e => download());
    document.getElementById("iter+25")?.addEventListener("click", e => {
        let iterations = stateManager.getState().i;
        if (iterations == null || Number.isNaN(+iterations)) iterations = '0';
        let newIterations = +iterations + 25;
        if (newIterations <= 0) newIterations = 25;
        stateManager.setOne('i', newIterations)
        input.set(INPUTS.ITER, newIterations);
        draw();
    });
    document.getElementById("iter-25")?.addEventListener("click", e => {
        let iterations = stateManager.getState().i;
        if (iterations == null || Number.isNaN(+iterations)) iterations = '0';
        let newIterations = +iterations - 25;
        if (newIterations <= 0) newIterations = 25;
        stateManager.setOne('i', newIterations)
        input.set(INPUTS.ITER, newIterations);
        draw();
    });
    INPUTS.ITER.addEventListener("change", () => {
        updateState();
        draw();
    });
    INPUTS.COLOR_OFFSET.addEventListener('change', () => {
        updateState();
        draw();
    });
    colorPaletteSelectElement.addEventListener("change", () => {
        mandelbrot.setColorPalette(RGB_PALETTES[colorPaletteSelectElement.value]);
        draw();
    });

    colorConvergedInput.addEventListener("change", () => {
        mandelbrot.setConvergedColor(colorConvergedInput.value);
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