import "@/style/color.css"
import { useTheme } from "@/utils/ThemeProvider";

type AppTitleProps = {
    className?: String;
    defaultColor?: boolean;
    isBold?: boolean;
};

const bold = "𝓓𝓮𝓿𝓰𝓻𝓪𝓶";
const light = "𝒟𝑒𝓋𝑔𝓇𝒶𝓂";

const AppTitle: React.FC<AppTitleProps> = ({ className, defaultColor = true, isBold = true }) => {

    const { theme } = useTheme();


    return (
        <div
            className={`h-12 font-bold text-4xl cursor-pointer ${defaultColor ? "text-gradient" : ""} ${className}`}
            onClick={() => window.location.href = "/"}
        >
            {isBold ? bold : light}
        </div>
    );
}

export default AppTitle;