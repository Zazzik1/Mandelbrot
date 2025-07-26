# Link to the preview: [Mandelbrot](https://zazzik1.github.io/Mandelbrot/)
Interactive representation of the [Mandelbrot series](https://en.wikipedia.org/wiki/Mandelbrot_set) using Javascript, Web Workers and HTML Canvas element. Thanks to the multiprocessing, it allows for quick obtaining of high-resolution fractals.

<p align="center">
    <img src="https://user-images.githubusercontent.com/78451054/144238786-6bf2f184-4256-45a3-a179-201738d036fa.png">
</p>

# How to use?
![Dynamic Regex Badge](https://img.shields.io/badge/dynamic/regex?url=https%3A%2F%2Fraw.githubusercontent.com%2FZazzik1%2FMandelbrot%2Frefs%2Fheads%2Fmain%2F.github%2Fworkflows%2Fpass_tests_and_release.yml&search=node-version%3A%20%5C%5B(.*)%5C%5D&replace=%241&label=node%20version)

### Installation:
```sh
git clone https://github.com/Zazzik1/Mandelbrot
cd Mandelbrot
npm ci # installation of dependencies
```
### Run (development mode):
```sh
npm run dev
```
After that you can navigate to the following address and see the live reload: [http://localhost:4000](http://localhost:4000/).

### Build:
```sh
npm run build
```
This command generates files in the `./build` directory, which must be hosted as static files by any static server, e.g by using `npx serve` or `python3 -m http.server` commands.