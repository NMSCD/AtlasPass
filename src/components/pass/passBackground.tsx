import { Box, Image } from '@hope-ui/solid';
import { Component } from 'solid-js';

interface PassBackgroundProps {
    backgroundImage: string;
    backgroundImageOpacity: number;
    borderRadius?: number;
}

export const PassBackground: Component<PassBackgroundProps> = (props: PassBackgroundProps) => {
    return (
        <Box class="pass-bg"
            borderRadius={props.borderRadius}
        >
            <Image
                class="pass-bg-img"
                opacity={props.backgroundImageOpacity ?? 1}
                src={props.backgroundImage}
            />
        </Box>
    );
}