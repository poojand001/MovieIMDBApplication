import React, { Component } from "react";
import { Modal, Form, Button } from "semantic-ui-react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import axios from "axios";
class AddMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      generelist: [],
      genreoptions: [],
      defaultvalue: [],
      Popularity: "",
      Director: "",
      IMDB_Score: "",
      newGenre: "",
      newGenrelist: [],
      message: "",
      newMovie: "",
      semaphore: false,
    };
    this.handlegenrelist = this.handlegenrelist.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${this.props.token}`;
  }
  handlegenrelist(e, newValue) {
    this.setState({ newGenrelist: newValue });
    let newoptions = this.state.genrelist.filter((f) => !newValue.includes(f));
    this.setState({ genreoptions: newoptions });
  }
  handleSubmit(e) {
    let comp = this;
    let newgenrelist = this.state.newGenrelist;
    if (this.state.newGenre !== "") newgenrelist.push(this.state.newGenre);
    console.log(comp.props.token);
    axios
      .post("https://film-rating-assignment.herokuapp.com/api/addmovie", {
        name: this.state.newMovie,
        director: this.state.Director,
        popularity: this.state.Popularity,
        imdb_score: this.state.IMDB_Score,
        genre: newgenrelist,
      })
      .then((res) => {
        comp.setState({
          message: `Successfully added the ${this.state.newMovie}`,
          open: false,
        });
        this.props.action();
      })
      .catch((res) => {
        comp.setState({ message: res.message });
      });
  }
  componentDidUpdate() {
    if (this.props.genrelist.length !== 0 && !this.state.semaphore) {
      let genres = this.props.genrelist;

      let genrenamelist = [];
      for (let i = 0; i < genres.length; i++) {
        genrenamelist.push(genres[i].Name);
      }
      this.setState({
        semaphore: true,
        genrelist: genrenamelist,
        genreoptions: genrenamelist,
      });
    }
  }
  render() {
    let triggeringevent = <Button color="blue"> Add Movie </Button>;
    return (
      <Modal
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        trigger={triggeringevent}
      >
        <Modal.Header> Add Movie </Modal.Header>{" "}
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Input
                fluid
                label="Name"
                placeholder="Name of new Movie"
                required
                onChange={(event, newValue) =>
                  this.setState({ newMovie: newValue.value })
                }
              />{" "}
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Director Name"
                  placeholder="Director name"
                  required
                  defaultValue={this.state.Director}
                  onChange={(event, newValue) =>
                    this.setState({ Director: newValue.value })
                  }
                />{" "}
                <Form.Input
                  fluid
                  label="Popularity"
                  placeholder="Popularity"
                  required
                  defaultValue={this.state.Popularity}
                  onChange={(event, newValue) =>
                    this.setState({ Popularity: newValue.value })
                  }
                />{" "}
                <Form.Input
                  fluid
                  label="IMDB_Score"
                  placeholder="IMDB_SCore"
                  required
                  defaultValue={this.state.IMDB_Score}
                  onChange={(event, newValue) =>
                    this.setState({ IMDB_Score: newValue.value })
                  }
                />{" "}
              </Form.Group>{" "}
              <Autocomplete
                multiple
                id="tags-outlined"
                options={this.state.genreoptions}
                defaultValue={this.state.defaultvalue}
                onChange={this.handlegenrelist}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="All Genres list"
                    placeholder="Genres"
                  />
                )}
              />{" "}
              <Form.Input
                fluid
                label="Add Genre"
                placeholder="Name of new Genre"
                onChange={(event, newValue) =>
                  this.setState({ newGenre: newValue.value })
                }
              />{" "}
              <Form.Group inline>
                <Form.Button color="blue" onClick={this.handleSubmit}>
                  {" "}
                  Submit{" "}
                </Form.Button>{" "}
              </Form.Group>{" "}
            </Form>{" "}
          </Modal.Description>{" "}
        </Modal.Content>{" "}
      </Modal>
    );
  }
}

export default AddMovie;
