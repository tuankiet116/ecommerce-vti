import { Separator } from "@/components/ui/separator";
import { Card } from "../ui/card";

export default function FormCard({ title, description, children, secondaryElement }) {
    return (
        <Card className="p-4 px-6 mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-md font-semibold">{title}</h2>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {secondaryElement && <div className="ml-auto">{secondaryElement}</div>}
            </div>
            <div className="space-y-4 mt-4">{children}</div>
        </Card>
    );
}
