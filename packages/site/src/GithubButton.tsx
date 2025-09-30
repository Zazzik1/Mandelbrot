import { IconButton } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

export default function GitHubButton() {
    return (
        <IconButton
            as="a"
            href="https://github.com/Zazzik1/Mandelbrot"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            variant="ghost"
            padding="0 8px"
        >
            <FaGithub />
        </IconButton>
    );
}
