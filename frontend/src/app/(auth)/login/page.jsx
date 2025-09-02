import ModeToggle from "@/components/shared/ModeToggle";
import LoginForm from "./_components/login-form";
import { Toaster } from "@/components/ui/sonner";

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="mb-2 flex items-center justify-end">
                    <ModeToggle />
                </div>
                <LoginForm />
            </div>
            <Toaster position="top-center" richColors />
        </div>
    );
}
