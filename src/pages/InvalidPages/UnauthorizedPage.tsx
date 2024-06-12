import Icon from "@/components/Icon/Icon";
import { Button } from "@/components/ui/button";

const UnauthorizedPage = () => {

    const handleNavigateLoginPage = () => {
        window.location.href = "/login";
    }

    return (
        <div className="h-screen w-screen">
            <div className="w-full h-full flex justify-center items-center">
                <div className="text-center">
                    <BlockUserIcon />
                    <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
                    <p className="text-lg">You are not authorized to access this page.</p>
                    <Button onClick={handleNavigateLoginPage} variant={"link"} className="">Go to Login Page</Button>
                </div>
            </div>
        </div>
    );

}

const BlockUserIcon = () => {
    return (
        <div className="relative w-24 h-24 mx-auto">
            <Icon name="user-round" className="h-full w-full" />
            <Icon name="octagon-x" className="absolute -top-4 -right-3 w-1/2 h-1/2" fill="red" color="white" />
        </div>
    );
}

export default UnauthorizedPage;