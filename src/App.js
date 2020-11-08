import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import MovieCard from "./components/Movies/MovieCard";
import AdminMovieCard from "./components/admin/AdminMovieCard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import 'semantic-ui-css/semantic.min.css';

function App() {
    return ( <
        Router >
        <
        Route exact path = "/"
        component = { MovieCard }
        />{" "} <
        Route exact path = "/login"
        component = { Login }
        /><
        Route exact path = "/register"
        component = { Register }
        /> <
        Route path = "/admin"
        component = { AdminMovieCard }
        /> < /
        Router >
    );
}
export default App;