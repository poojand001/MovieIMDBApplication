import React, { Component } from "react";
import { Card, Dropdown, Input, Menu, Button } from "semantic-ui-react";
import "../../../node_modules/font-awesome/css/font-awesome.min.css";
import "./MovieCard.css";
import { Typography } from "@material-ui/core";
import axios from "axios";
const styles = {
  title: {
    fontSize: 10,
    color: "white",
  },
};
const sortoptions = [
  {
    text: "Movie",
    value: "Movie",
  },
  {
    text: "Director",
    value: "Director",
  },
  {
    text: "Popularity",
    value: "Popularity",
  },
];
class MovieCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moviemessage: "",
      movies: [],
      genres: [],
      genremessage: "",
      activeItem: "films",
      genreoptions: [],
      totalmovies: [],
      searchmessage: "",
      inputsearch: "",
    };
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handlesort = this.handlesort.bind(this);
    this.handlegenrefilter = this.handlegenrefilter.bind(this);
    this.handlesearch = this.handlesearch.bind(this);
    this.handleinputchange = this.handleinputchange.bind(this);
  }
  handleItemClick(e, { newValue }) {
    this.setState({
      activeItem: newValue,
    });
  }
  handleinputchange(e, newValue) {
    this.setState({ inputsearch: newValue.value });
  }
  handlesearch(e) {
    console.log(this.state.inputsearch);
    axios
      .get(
        `https://film-rating-assignment.herokuapp.com/api/getmovies?search=${this.state.inputsearch}`
      )
      .then((res) => {
        this.setState({ totalmovies: res.data.data, movies: res.data.data });
      })
      .catch((res) => {
        this.setState({ searchmessage: res.message });
      });
  }
  handlesort(e, newValue) {
    let temp = this.state.movies;
    if (newValue.value === "Popularity") {
      temp.sort(function (a, b) {
        if (a.Popularity < b.Popularity) return -1;
        if (a.Popularity > b.Popularity) return 1;
        return 0;
      });
    } else if (newValue.value === "Director") {
      temp.sort(function (a, b) {
        if (a.Director < b.Director) return -1;
        if (a.Director > b.Director) return 1;
        return 0;
      });
    } else {
      temp.sort(function (a, b) {
        if (a.Name < b.Name) return -1;
        if (a.Name > b.Name) return 1;
        return 0;
      });
    }
    this.setState({ movies: temp });
  }
  handlegenrefilter(e, newValue) {
    let genreid = [];
    let temp = [];
    if (newValue.value.length === 0) {
      temp = this.state.movies;
    }
    for (let i = 0; i < newValue.value.length; i++) {
      genreid.push(newValue.value[i]);
    }
    temp = this.state.totalmovies;
    temp = temp.filter((s) => {
      let count = 0;
      for (let i = 0; i < s.Genres.length; i++) {
        if (genreid.includes(s.Genres[i].Id)) {
          count++;
        }
      }
      if (count === genreid.length) return true;
      else return false;
    });
    this.setState({ movies: temp });
  }
  componentWillMount() {
    axios
      .get("https://film-rating-assignment.herokuapp.com/api/getmovies")
      .then((response) => {
        this.setState({
          movies: response.data.data,
          totalmovies: response.data.data,
        });
      })
      .catch((response) => {
        this.setState({ moviemessage: response.message });
      });
    axios
      .get("https://film-rating-assignment.herokuapp.com/api/getgenres")
      .then((response) => {
        let genreopt = [];
        for (let i = 0; i < response.data.data.length; i++) {
          genreopt.push({
            text: response.data.data[i].Name,
            value: response.data.data[i].Id,
          });
        }
        this.setState({ genres: response.data.data, genreoptions: genreopt });
      })
      .catch((response) => {
        this.setState({ genremessage: response.message });
      });
  }
  render() {
    const { activeItem } = this.state;
    return (
      <React.Fragment>
        {" "}
        <Menu secondary>
          <Menu.Item
            name="home"
            active={activeItem === "home"}
            onClick={this.handleItemClick}
          />{" "}
          <Menu.Item
            name="films"
            active={activeItem === "films"}
            onClick={this.handleItemClick}
          />{" "}
          <Menu.Menu position="right">
            {" "}
            <Menu.Item>
              <Menu.Item>
                {" "}
                <Dropdown
                  options={sortoptions}
                  fluid
                  placeholder="Sort By"
                  onChange={this.handlesort}
                />{" "}
              </Menu.Item>
              <Menu.Item>
                {" "}
                <Dropdown
                  options={this.state.genreoptions}
                  fluid
                  placeholder="Genre"
                  multiple
                  selection
                  onChange={this.handlegenrefilter}
                />{" "}
              </Menu.Item>{" "}
              <Input
                placeholder="Search..."
                onChange={this.handleinputchange}
              />{" "}
              <Button color="green" onClick={this.handlesearch}>
                {" "}
                Search{" "}
              </Button>{" "}
            </Menu.Item>{" "}
            <Menu.Item
              name="login"
              active={activeItem === "login"}
              onClick={this.handleItemClick}
              href="/login"
            />
          </Menu.Menu>{" "}
        </Menu>{" "}
        <div id="card-container">
          {" "}
          <Card.Group itemsPerRow={4}>
            {" "}
            {this.state.movies.map((movie, index) => (
              <Card id="cardmovie" key={index}>
                <Card.Content>
                  <Card.Header id="card-text-color" key={index}>
                    {" "}
                    {movie.Name}{" "}
                  </Card.Header>{" "}
                  <Card.Meta id="card-text-color" style={{ fontSize: "0.6em" }}>
                    {" "}
                    {movie.Genres.map((genre, genreindex) => (
                      <span key={genreindex}> {genre.Name} </span>
                    ))}{" "}
                  </Card.Meta>{" "}
                  <Card.Description>
                    {" "}
                    <span className="fa fa-star checked"> </span>
                    <span id="movie-rating" style={styles.color} key={index}>
                      {movie.IMDB_Score}
                    </span>{" "}
                  </Card.Description>{" "}
                </Card.Content>{" "}
                <Card.Content extra>
                  <Typography
                    style={styles.title}
                    color="textSecondary"
                    key={index}
                  >
                    Director: {movie.Director}{" "}
                  </Typography>{" "}
                  <Typography
                    style={styles.title}
                    color="textSecondary"
                    key={index}
                  >
                    Popularity: {movie.Popularity}{" "}
                  </Typography>{" "}
                </Card.Content>{" "}
              </Card>
            ))}{" "}
          </Card.Group>{" "}
        </div>
      </React.Fragment>
    );
  }
}

export default MovieCard;
