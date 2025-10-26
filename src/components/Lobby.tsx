import React from "react";
import { Typography } from "@mui/material";

// STUDENT NOTE: Teacher said that after login we shouldn't just dump user straight into game;
// we will likely have a lobby or some "home" area. This is that placeholder.

const Lobby: React.FC = () => {
        return (
                <div>
                        <Typography variant="h5">Lobby</Typography>
                        <Typography variant="body1">
                                This is a placeholder “lobby”. Later we’ll show active games,
                                matchmaking, etc.
                        </Typography>
                </div>
        );
};

export default Lobby;
