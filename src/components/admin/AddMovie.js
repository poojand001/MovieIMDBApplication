import React, { Component } from "react";
import { Modal, Form, Button } from "semantic-ui-react";
import { Autocomplete, Alert } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import axios from "axios";
import FlashMessage from "react-flash-message";
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
      success: false,
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
          success: true,
        });
        setTimeout(() => {
          this.setState({ open: false, message: "" });
          this.props.action();
        }, 3000);
      })
      .catch((res) => {
        comp.setState({ message: "Unable to add the movie", success: false });
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
                  onChange={(event, newValue) =>
                    this.setState({ Director: newValue.value })
                  }
                />{" "}
                <Form.Input
                  fluid
                  label="Popularity"
                  placeholder="Popularity"
                  required
                  onChange={(event, newValue) =>
                    this.setState({ Popularity: newValue.value })
                  }
                />{" "}
                <Form.Input
                  fluid
                  label="IMDB_Score"
                  placeholder="IMDB_SCore"
                  required
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
            {this.state.message !== "" ? (
              <FlashMessage dureation={3000}>
                <Alert severity={this.state.success ? "success" : "error"}>
                  {" "}
                  {this.state.message}{" "}
                </Alert>{" "}
              </FlashMessage>
            ) : (
              ""
            )}{" "}
          </Modal.Description>{" "}
        </Modal.Content>{" "}
      </Modal>
    );
  }
}

export default AddMovie;
