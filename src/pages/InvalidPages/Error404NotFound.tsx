import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Error404NotFound = () => {

    const handleBack = () => {
        history.back();
    }

    return (
        <Card className="w-screen h-screen flex justify-center items-center">
            <span className="text-[60px]">404 Not Found</span>
            <Button onClick={handleBack}>Back</Button>
        </Card>
    );
}

export default Error404NotFound;