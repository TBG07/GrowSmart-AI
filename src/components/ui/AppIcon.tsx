import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface AppIconProps extends Omit<LucideProps, 'ref'> {
    name: string;
}

const AppIcon = ({ name, ...props }: AppIconProps) => {
    const IconComponent = (LucideIcons as any)[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in lucide-react`);
        return null;
    }

    return <IconComponent {...props} />;
};

export default AppIcon;
