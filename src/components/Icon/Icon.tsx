import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

// const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }} />

interface IconProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports;
}

const fallback = <div style={{ background: '#ddd', width: 24, height: 24 }} />

const Icon = ({ name, ...props }: IconProps) => {
    const LucideIcon = lazy(dynamicIconImports[name]);

    return (
        <Suspense fallback={<div></div>}>
            <LucideIcon {...props} />
        </Suspense>
    );
}

export default Icon