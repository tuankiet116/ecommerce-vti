import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { useLogin } from "@/api/useAuth";
import { useNavigate } from "react-router-dom";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const login = useLogin();
    const navigate = useNavigate();

    const handleLogin = useCallback(() => {
        login.mutateAsync(
            { email, password },
            {
                onSuccess: (data) => {
                    navigate("/admin");
                },
                onError: (error) => {
                    toast.error("Login failed. Please check your credentials.");
                },
            },
        );
    }, [email, password, login, navigate]);

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleLogin();
            }
        });

        return () => {
            window.removeEventListener("keydown", handleLogin);
        };
    });

    return (
        <>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className={cn("flex flex-col gap-6")}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Login to Shopera Admin</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            value={email}
                                            onChange={handleEmailChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                        </div>
                                        <Input id="password" type="password" value={password} onChange={handlePasswordChange} required />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            style={{ cursor: "pointer" }}
                                            onClick={handleLogin}
                                            disabled={login.isPending}
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Toaster position="bottom-center" />
                    </div>
                </div>
            </div>
        </>
    );
}
