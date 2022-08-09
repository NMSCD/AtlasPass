import { Box, Image } from '@hope-ui/solid';
import { Component } from 'solid-js';

interface PassBackgroundProps {
    backgroundImage: string;
    backgroundImageOpacity: number;
}

export const PassBackground: Component<PassBackgroundProps> = (props: PassBackgroundProps) => {
    return (
        <Box class="pass-bg">
            <Image
                class="pass-bg-img"
                src={props.backgroundImage}
                style={{
                    'opacity': props.backgroundImageOpacity ?? 1
                }}
            />
        </Box>
    );
}