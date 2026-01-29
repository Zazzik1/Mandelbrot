import { IconButton } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';

const handleOnClick = () => {
    window.open('https://github.com/Zazzik1/Mandelbrot', '_blank', 'noopener noreferrer');
};

export default function GitHubButton() {
    return (
        <IconButton
            onClick={handleOnClick}
            aria-label="GitHub"
            variant="ghost"
            padding="0 8px"
        >
            <FaGithub />
        </IconButton>
    );
}
