# Mandelbrot
Interactive representation of the [Mandelbrot series](https://en.wikipedia.org/wiki/Mandelbrot_set) using Javascript, Web Workers and HTML Canvas element. Thanks to the multiprocessing (up to 16 processes), it allows for quick obtaining of high-resolution fractals.

<p align="center">
    <img src="https://user-images.githubusercontent.com/78451054/144238786-6bf2f184-4256-45a3-a179-201738d036fa.png">
</p>

# How to use?
This project has implemented simple express based **NodeJS** static server:
#### Installation:
```sh
git clone https://github.com/Zazzik1/Mandelbrot
cd Mandelbrot
git checkout nodejs
npm ci # installation of dependencies
```
#### Run:
```sh
npm start
```
After that you can navigate to the following address in your browser: 
```sh
127.0.0.1:8000
```
