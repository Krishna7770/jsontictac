import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

// STUDENT NOTE: This component is new. It did not exist in teacher's original code.
// Teacher asked for a constant top/side bar that shows login state and allows navigation.

export type ViewName = "login" | "register" | "lobby" | "game";

interface LayoutProps {
        currentUser: string | null; // email if logged in
        onNavigate: (view: ViewName) => void; // to switch between login/register/lobby/game
        onLogout: () => void; // calls backend logout and clears session
        children: React.ReactNode; // rest of screen
}

const Layout: React.FC<LayoutProps> = ({ currentUser, onNavigate, onLogout, children }) => {
        return (
                <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                        <AppBar position="static">
                                <Toolbar sx={{ display: "flex", gap: 2 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                jsontictac — {currentUser
                                                        ? `Logged in as ${currentUser}`
                                                        : "Not logged in"}
                                        </Typography>

                                        {!currentUser && (
                                                <>
                                                        <Button color="inherit" onClick={() => onNavigate("login")}>
                                                                Login
                                                        </Button>
                                                        <Button color="inherit" onClick={() => onNavigate("register")}>
                                                                Register
                                                        </Button>
                                                </>
                                        )}

                                        {currentUser && (
                                                <>
                                                        <Button color="inherit" onClick={() => onNavigate("lobby")}>
                                                                Lobby
                                                        </Button>
                                                        <Button color="inherit" onClick={() => onNavigate("game")}>
                                                                Game
                                                        </Button>
                                                        <Button color="inherit" onClick={onLogout}>
                                                                Logout
                                                        </Button>
                                                </>
                                        )}
                                </Toolbar>
                        </AppBar>

                        <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
                </Box>
        );
};

export default Layout;
