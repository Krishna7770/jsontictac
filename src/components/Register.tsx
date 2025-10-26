import React from "react";
import { TextField, Button, Stack, Alert, Typography } from "@mui/material";

// STUDENT NOTE: Teacher said registration should NOT happen silently in login.
// We create a dedicated Register component,
// which will POST to register.php on the server side.

interface RegisterProps {
        config: any;
        onRegisterSuccess: (email: string) => void;
        onRegisterFail: (message: string) => void;
}

const Register: React.FC<RegisterProps> = ({ config, onRegisterSuccess, onRegisterFail }) => {
        const [email, setEmail] = React.useState("");
        const [pass1, setPass1] = React.useState("");
        const [pass2, setPass2] = React.useState("");
        const [error, setError] = React.useState<string | null>(null);

        function handleRegister() {
                if (!email.includes("@")) {
                        setError("Please use a valid email (teacher mentioned @).");
                        return;
                }
                if (pass1.length < 4) {
                        setError("Password too short.");
                        return;
                }
                if (pass1 !== pass2) {
                        setError("Passwords do not match.");
                        return;
                }

                const body = { email: email, pass: pass1 };

                fetch(config.serviceroot + "/register.php", {
                        method: "POST",
                        mode: "cors",
                        credentials: "include",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify(body),
                })
                        .then((r) => r.json())
                        .then((j) => {
                                if (j.success) {
                                        onRegisterSuccess(email);
                                } else {
                                        const msg = j.message || "Registration failed.";
                                        setError(msg);
                                        onRegisterFail(msg);
                                }
                        })
                        .catch((e) => {
                                console.log(e);
                                const msg = "Server/network error during registration";
                                setError(msg);
                                onRegisterFail(msg);
                        });
        }

        return (
                <Stack spacing={2} maxWidth={360}>
                        <Typography variant="h5">Register</Typography>
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                                label="Email"
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                                label="Password"
                                type="password"
                                onChange={(e) => setPass1(e.target.value)}
                        />
                        <TextField
                                label="Repeat password"
                                type="password"
                                onChange={(e) => setPass2(e.target.value)}
                        />

                        <Button variant="contained" onClick={handleRegister}>
                                Create account
                        </Button>
                </Stack>
        );
};

export default Register;
