
import { FC, SVGProps } from 'react';
import { IconProps } from '@tabler/icons-react';

// Updated to support both standard SVG icons and Tabler icons
export type IconType = FC<SVGProps<SVGSVGElement> | IconProps>;
