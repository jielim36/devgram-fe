import { ReactNode } from "react";
import "@/style/color.css"

type DotContainerProps = {
    children: ReactNode;
    hasDot: boolean;
}

const DotContainer: React.FC<DotContainerProps> = ({
    children,
    hasDot
}) => {
    return (
        <div className="relative w-full h-full">
            {children}
            {hasDot &&
                <div className="absolute w-3 h-3 bg-gradient rounded-full top-0 right-1">
                    <span className="animate-ping absolute inline-flex w-full h-full rounded-full opacity-75 bg-gradient"></span>
                </div>
            }
        </div>
    );
}

// const Dot = () => {
//     return <span className="animate-ping absolute inline-flex w-3 h-3 rounded-full opacity-75"></span>;
// }

export default DotContainer;