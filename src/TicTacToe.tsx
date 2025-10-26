import React from 'react';
import type { Dispatch, JSX, SetStateAction } from 'react';
import Layout from './components/Layout';
import type { ViewName } from './components/Layout';

// STUDENT NOTE: These are new components we created to satisfy teacher exercises.
//import Layout, { ViewName } from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import Lobby from './components/Lobby';
import Game from './components/Game';

/*
   BIG EXERCISE:  Implement JSX code and logic into this file so that this component displays a
                  UI according to the current state of user interaction:
                  -A TOP BAR/SIDE BAR should be constantly visible and display whether the user has
                   logged in. The Top/side bar can also have application navigation
                  (login,logout,etc.)in it.
                  -the remaining area of the screen should then be dedicated for "stuff" we build
                   later, like:
                        -a login screen (which you can build already now)
                        -a registration screen (you can already do this too!)
                        -a view for "playing the game" (done)
                        -a "lobby" between login and the actual board (this you can also do now!)
                        -(other views will follow in later exercises / weeks)

   The component in this file (TicTacToe, which is the "main component") should therefore be visible
   as the top/side-bar which displays at the minimum a logged in user's email and a "log out" button.
   The rest of the screen contents change dynamically.
   As long as a "statusbar" of this kind is visible the visual aspects do not matter in this exercise,
   you can work on the graphics as much or as little as you like.

   As an example the game board has been separated into it's own file/component called "Game".

   As "ready to use"-democode you also get a _rudimentary_ login (and kind of logout) too. The logic is
   not ready by any means, but the basic operation is functional and can be used in production _IF_
   the production has TLS encryption for the http-communications. Do note that the https-protocol is a
   _requirement_ for this setup to be OK. By looking at the code "as is" (and this will get slightly worse
   before it gets better) you would soon notice that the user name and password are already "out there
   in text"... TLS encryption (https) will make sure nobody in the path towards the end server will see
   those, the encryption takes care of that. This is very much OK, it is how things are supposed to look.
   However... since this setup in the moment "loose" has a tendency to also sometimes run without https
   (like the demos and in class), the code cannot fly in production even if ./https happens to be alright.
   Also realize why https is held as a de facto standard these days. Also consider: we're a bit lazy and
   see passwords in the running Javascript :-) ...and Javascript code is basically _always_ available for
   inspection :-)

   Then after getting a password&user to the server it is either checked to exist in the backend logic,
   if it does (and the password is correct), then we log the user's uid into a session-variable.
   Thereafter the session variable will look pretty much like it (kind of) "always" has.
   It's very similar for all kinds of web sites and pages. With just this setup alone we already have
   a platform in which all that matters is logically built inside different PHP-scripts in a backend and
   only results are transmitted back to the frontend. As a result it's far more difficult to manipulate
   the backend since all the logic necessary to manipulate things is hidden and cannot be altered on the fly.
   This somewhat simplifies our life in security. Nonetheless this is still rather insufficient, security
   wise, and these pages are NOT ABOUT SECURITY in any other way than to remind you that you need to
   remember it's your #1 concern and you should go do the job RIGHT during/after the PRODUCTION PROJECT COURSE.

   Also take notice:
   The "json string" handling below is sometimes shown in React and othertimes it's just done in PHP. This is to
   show either is possible and how it still/"as-long-as" works with plain JSON data (and even without libraries if
   you would so prefer). The use of std lib JS JSON-operations is not new, "your teacher has used it in production
   'since forever'", but PHP was recently given something that finally qualifies as 'usable'.

   An interesting thing to note is:
   Once one gets used to the structure of React one could quite easily do a React-ish framework
   for PHP too :-) Using that would obviously require the React one, because I don't see a point in
   writing that engine twice. (Perhaps I'll write such a library next vacation, probably it could
   be quite useful...)
   
   SECURITY NOTE:
   Due to the use of a server side session it's actually important now that LOGOUT works too. This is especially if
   "Accounts" are shared (see comments relating to registration below!)
   If the UID is not cleared out ("flushed") from the server side a user who thinks (s)he has logged the test account
   out would _not_ be logged out and another student using the same browser would be capable to impersonate the previous,
   despite the logout. This is solved by calling logout.php too.
*/

function TicTacToe(props : any)
{
        // STUDENT NOTE:
        // In the teacher's original file, view logic and login UI lived all inside TicTacToe.
        // Exercise 2 said: "Separate Login into it's own component file" and add Register etc.
        // So now TicTacToe tracks global app state and chooses which screen to show.

        // This holds which "page/view" the user is currently looking at.
        // The allowed values match teacher's BIG EXERCISE list.
        const [currentView, setCurrentView] = React.useState<ViewName>(props.view ?? "login");

        // This holds which user is currently logged in (by email). If null => not logged in.
        const [currentUser, setCurrentUser] = React.useState<string|null>(null);

        // We'll need config (serviceroot, endpoints, etc.) for API calls.
        const config = props.config;

        // STUDENT NOTE:
        // In the original code, confirmSession() set the view = "game" on success,
        // and set it back to "login" on failure.
        // We keep that behavior conceptually, but we handle it here via callbacks
        // coming back from the Login component.

        function handleLoginSuccess(email: string)
        {
                setCurrentUser(email);

                // Teacher mentioned that we should eventually have a "lobby" between login and the game,
                // not jump straight into the board. So instead of sending user directly into "game",
                // we land them in "lobby". The user can then navigate to Game from the top bar.
                setCurrentView("lobby");
        }

        function handleLoginFail(_msg: string)
        {
                // If login failed we make sure we're looking at login.
                setCurrentUser(null);
                setCurrentView("login");
        }

        // STUDENT NOTE:
        // Registration is "its own view" instead of silently creating a user in login.php.
        // After successful register, we are basically logged in (the PHP puts uid in session).
        function handleRegisterSuccess(email: string)
        {
                setCurrentUser(email);
                setCurrentView("lobby");
        }

        function handleRegisterFail(_msg: string)
        {
                // Stay on register so user can correct inputs.
                setCurrentView("register");
        }

        // STUDENT NOTE:
        // Teacher warned that logout MUST also contact server so uid in PHP session is cleared,
        // otherwise another person at the same browser could act as previous user.
        function logout()
        {
                fetch(config.serviceroot + "/logout.php", {
                        method : "POST",
                        mode : "cors",
                        credentials : "include"
                })
                .then(r => r.json())
                .then(j => {
                        console.log("logout.php replied:", j);
                })
                .catch(e => {
                        console.log("logout network error:", e);
                });

                // Clear our local state as well
                setCurrentUser(null);
                setCurrentView("login");
        }

        // Decide what to render in the main content area based on currentView.
        let mainContent : JSX.Element;
        switch (currentView)
        {
                case "login":
                        mainContent = (
                                <Login
                                        config={config}
                                        onLoginSuccess={handleLoginSuccess}
                                        onLoginFail={handleLoginFail}
                                />
                        );
                        break;

                case "register":
                        mainContent = (
                                <Register
                                        config={config}
                                        onRegisterSuccess={handleRegisterSuccess}
                                        onRegisterFail={handleRegisterFail}
                                />
                        );
                        break;

                case "lobby":
                        mainContent = (
                                <Lobby />
                        );
                        break;

                case "game":
                        mainContent = (
                                <Game
                                        sizex={3}
                                        sizey={3}
                                        config={config}
                                />
                        );
                        break;

                default:
                        mainContent = <div>Unknown view</div>;
                        break;
        }

        // STUDENT NOTE:
        // Layout is the always-visible top bar / sidebar requested in BIG EXERCISE.
        // It shows whether we're logged in and gives navigation buttons.
        // We pass currentUser to show "Logged in as ...".
        // We pass onNavigate so the bar can switch between login/register/lobby/game.
        // We pass onLogout so Logout works both client-side and server-side.
        return (
                <Layout
                        currentUser={currentUser}
                        onNavigate={(view)=>setCurrentView(view)}
                        onLogout={logout}
                >
                        {mainContent}
                </Layout>
        );
}

export default TicTacToe;
