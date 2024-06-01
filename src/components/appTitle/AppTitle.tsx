import "@/style/color.css"

type AppTitleProps = {
    className?: String;
    defaultColor?: boolean;
};


const AppTitle: React.FC<AppTitleProps> = ({ className, defaultColor = true }) => {
    return (
        <div className={`h-12 font-bold text-4xl ${defaultColor ? "text-gradient" : ""} ${className}`} > 𝓓𝓮𝓿𝓰𝓻𝓪𝓶</div>
    );
}

export default AppTitle;