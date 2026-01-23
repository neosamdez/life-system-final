declare module 'streamdown' {
    import { FC, ReactNode } from 'react';

    interface StreamdownProps {
        children: ReactNode;
        className?: string;
    }

    export const Streamdown: FC<StreamdownProps>;
}
