import { Box, Button, Heading, NumberInput, Stack } from '@chakra-ui/react';
import { Mandelbrot, Position } from '@zazzik/react-mandelbrot';
import { useState } from 'react';
import { Slider } from './components/ui/slider';

type ValueChangeDetails = { value: string; valueAsNumber: number };

function App() {
    const [position, setPosition] = useState<Position | undefined>();
    const [iterations, setIterations] = useState<number>(100);

    return (
        <Stack>
            <Heading>Mandelbrot demo</Heading>
            <div>{JSON.stringify({ position })}</div>
            <Box>
                <Button onClick={() => setPosition(undefined)}>Reset</Button>
            </Box>
            <NumberInput.Root
                maxW="200px"
                value={iterations}
                onValueChange={(e: ValueChangeDetails) =>
                    setIterations(e.valueAsNumber <= 0 ? 1 : e.valueAsNumber)
                }
            >
                <NumberInput.Control />
                <NumberInput.Input />
            </NumberInput.Root>
            <div>
                <Mandelbrot
                    width={600}
                    height={600}
                    position={position}
                    iterations={iterations}
                    onPositionChange={setPosition}
                />
                <Slider
                    value={[iterations]}
                    onValueChange={(e: ValueChangeDetails) =>
                        setIterations(e.valueAsNumber)
                    }
                    on
                    min={1}
                    max={1000}
                />
            </div>
        </Stack>
    );
}

export default App;
