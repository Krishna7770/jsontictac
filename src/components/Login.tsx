import React from "react";
import { TextField, Button, Stack, Alert, Typography } from "@mui/material";

/*
        EXERCISE 2:
        Separate Login into it's own component file and then make it prettier to look at and more logical to use.
        This will also require some change to the PHP side of things. Use your experience and common sense.
        The "most silly feature" at the moment is that if a username does not exist, the username is registered
        right away and without even notifying the user that the registration was done!-)
        ...
        Registration needs it's own view, passwords should not be displayed on screen, at registration time the
        password should be queried twice to ensure no typos... etc. etc.
*/

// I changed the password field to type="password" so it's not shown in plain text.

interface LoginProps {
        config: any;
        onLoginSuccess: (email: string) => void;
        onLoginFail: (message: string) => void;
}

const Login: React.FC<LoginProps> = ({ config, onLoginSuccess, onLoginFail }) => {
        const [email, setEmail] = React.useState("");
        const [pass, setPass] = React.useState("");
        const [error, setError] = React.useState<string | null>(null);

        function confirmSession(j: any) {
                // if (j.success) view="game", else view="login"
                if (j.success) {
                        onLoginSuccess(email);
                } else {
                        const msg = "Login failed (Nonexistent user or wrong password?)";
                        setError(msg);
                        onLoginFail(msg);
                }
        }

        function showError(e: any) {
                console.log(e);
                const msg = "Whoops... communication with the server did not work out...";
                setError(msg);
                onLoginFail(msg);
        }

        function getSession() {
                const obu = { email: email, pass: pass };
                // fetch(c.serviceroot+c.login, { method:"POST", mode:"cors", credentials:"include",
                //                                headers:{'Content-Type':'text/plain'}, body: JSON.stringify(obu) })

                fetch(config.serviceroot + config.login, {
                        method: "POST",
                        mode: "cors",
                        credentials: "include",
                        headers: { "Content-Type": "text/plain" },
                        body: JSON.stringify(obu),
                })
                        .then((r) => r.json())
                        .then((j) => confirmSession(j))
                        .catch((e) => showError(e));
        }

        return (
                <Stack spacing={2} maxWidth={360}>
                        <Typography variant="h5">Login</Typography>

                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                                type="email"
                        />
                        <TextField
                                onChange={(e) => setPass(e.target.value)}
                                label="Password"
                                type="password" //   hide password
                        />

                        <Button variant="contained" onClick={getSession}>
                                Sign in
                        </Button>

                        {/* to original login auto-created new accounts. We're moving
                           that behavior to a dedicated Register view instead, which is what
                           they asked us to do ("Registration needs it's own view").
                        */}
                </Stack>
        );
};

export default Login;
