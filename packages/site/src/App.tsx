import {
    Box,
    Button,
    Color,
    ColorPicker,
    Field,
    Heading,
    HStack,
    NumberInput,
    parseColor,
    Portal,
    Select,
    Separator,
    Slider,
    Stack,
    Switch,
    Text,
} from '@chakra-ui/react';
import { Mandelbrot, MandelbrotRef, Position } from '@zazzik/react-mandelbrot';
import { useCallback, useMemo, useRef, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';
import {
    CANVAS_SIZES,
    CanvasSizeKey,
    canvasSizes,
    ColorPaletteKey,
    colorPalettes,
    DEFAULT_CONVERGED_COLOR,
    DEFAULT_ITERATIONS,
    DEFAULT_POSITION,
    RGB_PALETTES,
} from '@/constants/constants';
import GitHubButton from '@/GithubButton';
import { getPositionWithAspectRatio } from '@/util';

type ValueChangeDetails = { value: string; valueAsNumber: number };

function App() {
    // check window width only on init
    const DEFAULT_CANVAS_SIZE_KEY: CanvasSizeKey = useMemo(
        () => (window.innerWidth < 600 ? '360x640' : '600x600'),
        [],
    );
    const mandelbrotRef = useRef<MandelbrotRef>(null);
    const [position, setPosition] = useState<Position>(
        getPositionWithAspectRatio(
            DEFAULT_POSITION,
            CANVAS_SIZES[DEFAULT_CANVAS_SIZE_KEY].width,
            CANVAS_SIZES[DEFAULT_CANVAS_SIZE_KEY].height,
        ),
    );
    const [iterations, setIterations] = useState<number>(DEFAULT_ITERATIONS);
    const [mouseWheelEnabled, setMouseWheelEnabled] = useState(true);
    const [canvasSize, setCanvasSize] = useState<CanvasSizeKey>(
        DEFAULT_CANVAS_SIZE_KEY,
    );
    const [colorPaletteKey, setColorPalette] =
        useState<ColorPaletteKey>('DEFAULT_PALETTE');
    const [colorOffset, setColorOffset] = useState<number>(0);
    const [convergedColor, setConvergedColor] = useState(
        parseColor(DEFAULT_CONVERGED_COLOR),
    );

    const colorPalette = RGB_PALETTES[colorPaletteKey as ColorPaletteKey];
    const { width, height } = useMemo(
        () => CANVAS_SIZES[canvasSize as CanvasSizeKey],
        [canvasSize],
    );

    const handleResetSettings = useCallback(() => {
        setPosition(
            getPositionWithAspectRatio(
                DEFAULT_POSITION,
                CANVAS_SIZES[DEFAULT_CANVAS_SIZE_KEY].width,
                CANVAS_SIZES[DEFAULT_CANVAS_SIZE_KEY].height,
            ),
        );
        setIterations(DEFAULT_ITERATIONS);
        setColorOffset(0);
        setConvergedColor(parseColor(DEFAULT_CONVERGED_COLOR));
        setColorPalette('DEFAULT_PALETTE');
        setMouseWheelEnabled(true);
        setCanvasSize(DEFAULT_CANVAS_SIZE_KEY);
    }, [DEFAULT_CANVAS_SIZE_KEY]);

    const handleDownloadImage = useCallback(() => {
        mandelbrotRef.current?.downloadImage();
    }, []);

    const handleZoom = useCallback((zoom: number) => {
        mandelbrotRef.current?.click(0.5, 0.5, zoom);
    }, []);

    const convergedColorHex = useMemo(
        () => convergedColor.toString('hex'),
        [convergedColor],
    );
    return (
        <Stack>
            <HStack
                justifyContent="space-between"
                flexWrap="wrap"
            >
                <Heading size="2xl">Mandelbrot fractal generator</Heading>
                <GitHubButton />
            </HStack>
            <HStack
                gap="32px"
                flexWrap="wrap"
            >
                <Text
                    fontSize="md"
                    maxWidth="400px"
                    color="#bab2c9"
                    marginRight="16px"
                >
                    If you want to zoom, just click (left/right mouse button) on
                    desired place on canvas and sometimes increase iterations to
                    make edges sharpen.
                </Text>
                <Stack>
                    <HStack>
                        <Button
                            size="sm"
                            colorPalette="green"
                            variant="outline"
                            onClick={() => handleZoom(2)}
                        >
                            Zoom +
                        </Button>
                        <Button
                            size="sm"
                            colorPalette="green"
                            variant="outline"
                            onClick={() => handleZoom(0.5)}
                        >
                            Zoom -
                        </Button>
                    </HStack>
                    <Switch.Root
                        size="lg"
                        checked={mouseWheelEnabled}
                        onCheckedChange={(e: { checked: boolean }) =>
                            setMouseWheelEnabled(e.checked)
                        }
                    >
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb>
                                <Switch.ThumbIndicator
                                    fallback={<HiX color="black" />}
                                >
                                    <HiCheck />
                                </Switch.ThumbIndicator>
                            </Switch.Thumb>
                        </Switch.Control>
                        <Switch.Label>Use mouse wheel to zoom</Switch.Label>
                    </Switch.Root>
                </Stack>
            </HStack>
            <Box marginTop="8px">
                <HStack
                    alignItems="end"
                    flexWrap="wrap"
                >
                    <Field.Root width="max-content">
                        <Field.Label>Max iterations (precision)</Field.Label>
                        <NumberInput.Root
                            maxW="200px"
                            value={iterations}
                            onValueChange={(e: ValueChangeDetails) =>
                                setIterations(
                                    e.valueAsNumber > 0
                                        ? e.valueAsNumber < 10001
                                            ? e.valueAsNumber
                                            : 10000
                                        : 1,
                                )
                            }
                        >
                            <NumberInput.Control />
                            <NumberInput.Input />
                        </NumberInput.Root>
                    </Field.Root>
                    <Select.Root
                        collection={canvasSizes}
                        width="150px"
                        value={[canvasSize]}
                        onValueChange={(e) => {
                            const key = e.value[0] as CanvasSizeKey;
                            const { width, height } = CANVAS_SIZES[key];
                            setPosition((old) =>
                                getPositionWithAspectRatio(old, width, height),
                            );
                            setCanvasSize(key);
                        }}
                    >
                        <Select.HiddenSelect />
                        <Select.Label>Canvas size</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select canvas size" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {canvasSizes.items.map((size) => (
                                        <Select.Item
                                            item={size}
                                            key={size.value}
                                        >
                                            {size.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                    <ColorPicker.Root
                        value={convergedColor}
                        onValueChange={(e: { value: Color }) =>
                            setConvergedColor(e.value)
                        }
                        maxW="140px"
                    >
                        <ColorPicker.HiddenInput />
                        <ColorPicker.Label>Converged color</ColorPicker.Label>
                        <ColorPicker.Control>
                            <ColorPicker.Input />
                            <ColorPicker.Trigger />
                        </ColorPicker.Control>
                        <Portal>
                            <ColorPicker.Positioner>
                                <ColorPicker.Content>
                                    <ColorPicker.Area />
                                    <HStack>
                                        <ColorPicker.EyeDropper
                                            size="xs"
                                            variant="outline"
                                        />
                                        <ColorPicker.Sliders />
                                    </HStack>
                                </ColorPicker.Content>
                            </ColorPicker.Positioner>
                        </Portal>
                    </ColorPicker.Root>
                    <Stack>
                        <Slider.Root
                            width="150px"
                            value={[colorOffset]}
                            onValueChange={(e: { value: number[] }) =>
                                setColorOffset(e.value[0])
                            }
                            max={
                                colorPalette.length
                                    ? colorPalette.length - 1
                                    : 1
                            }
                            min={0}
                        >
                            <Slider.Label>Color offset</Slider.Label>
                            <Slider.Control>
                                <Slider.Track>
                                    <Slider.Range />
                                </Slider.Track>
                                <Slider.Thumbs />
                            </Slider.Control>
                        </Slider.Root>
                        <Select.Root
                            collection={colorPalettes}
                            width="150px"
                            value={[colorPaletteKey]}
                            onValueChange={(e: { value: string[] }) => {
                                setColorPalette(e.value[0] as ColorPaletteKey);
                                setColorOffset(0);
                            }}
                        >
                            <Select.HiddenSelect />
                            <Select.Label>Color palette</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText placeholder="Select color palette" />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                            <Portal>
                                <Select.Positioner>
                                    <Select.Content>
                                        {colorPalettes.items.map((palette) => (
                                            <Select.Item
                                                item={palette}
                                                key={palette.value}
                                            >
                                                {palette.label}
                                                <Select.ItemIndicator />
                                            </Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Positioner>
                            </Portal>
                        </Select.Root>
                    </Stack>
                    <Stack>
                        <Button
                            colorPalette="green"
                            variant="surface"
                            onClick={handleDownloadImage}
                        >
                            Download image
                        </Button>
                        <Button
                            colorPalette="red"
                            variant="surface"
                            onClick={handleResetSettings}
                        >
                            Reset settings
                        </Button>
                    </Stack>
                </HStack>
            </Box>
            <Separator />
            <div>
                <Mandelbrot
                    ref={mandelbrotRef}
                    width={width}
                    height={height}
                    position={position}
                    iterations={iterations}
                    onPositionChange={setPosition}
                    mouseWheelEnabled={mouseWheelEnabled}
                    colorOffset={colorOffset}
                    convergedColor={convergedColorHex}
                    colorPalette={colorPalette}
                />
            </div>
        </Stack>
    );
}

export default App;
