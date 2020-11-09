import React, { Component } from "react";
import { Modal, Form, Icon } from "semantic-ui-react";
import { Autocomplete, Alert } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import axios from "axios";
import FlashMessage from "react-flash-message";
class EditMovie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      generelist: [],
      genreoptions: [],
      defaultvalue: [],
      Popularity: this.props.moviedetails.Popularity,
      Director: this.props.moviedetails.Director,
      IMDB_Score: this.props.moviedetails.IMDB_Score,
      newGenre: "",
      newGenrelist: [],
      message: "",
      semaphore: false,
      success: false,
    };
    this.handlegenrelist = this.handlegenrelist.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${this.props.token}`;
  }
  handlegenrelist(e, newValue) {
    this.setState({ newGenrelist: newValue });
    let newoptions = this.state.genrelist.filter((f) => !newValue.includes(f));
    this.setState({ genreoptions: newoptions });
  }
  handleDelete(e) {
    let comp = this;
    axios
      .post("https://film-rating-assignment.herokuapp.com/api/removemovie", {
        movieid: this.props.moviedetails.Id,
      })
      .then((res) => {
        this.setState({
          success: true,
          message: `Successfully deleted ${this.props.moviedetails.Name} `,
        });
        setTimeout(() => {
          this.setState({ open: false });
          this.props.action();
        }, 3000);
      })
      .catch((res) =>
        comp.setState({
          message: "Unable to delete the movie",
          success: false,
        })
      );
  }
  handleSubmit(e) {
    let comp = this;
    let newgenrelist = this.state.newGenrelist;
    if (this.state.newGenre !== "") newgenrelist.push(this.state.newGenre);
    axios
      .post("https://film-rating-assignment.herokuapp.com/api/editmovie", {
        movieid: this.props.moviedetails.Id,
        name: this.props.moviedetails.Name,
        director: this.state.Director,
        popularity: this.state.Popularity,
        imdb_score: this.state.IMDB_Score,
        genre: newgenrelist,
      })
      .then((res) => {
        comp.setState({
          message: `Successfully updated the ${this.props.moviedetails.Name}`,
          success: true,
        });
        setTimeout(() => {
          comp.setState({ open: false, message: "" });
          comp.props.action();
        }, 3000);
      })
      .catch((res) => {
        comp.setState({
          message: "Unable to update the details",
          success: false,
        });
      });
  }
  componentDidUpdate() {
    if (
      !this.state.semaphore &&
      this.props.genrelist.length !== 0 &&
      this.props.moviedetails.Genres.length !== 0
    ) {
      let genres = this.props.genrelist;
      let genrenamelist = [];
      for (let i = 0; i < genres.length; i++) {
        genrenamelist.push(genres[i].Name);
      }
      this.setState({ genrelist: genrenamelist, semaphore: true });
      let allgenres = genrenamelist;
      genres = this.props.moviedetails.Genres;
      genrenamelist = [];
      for (let i = 0; i < genres.length; i++) {
        genrenamelist.push(genres[i].Name);
      }
      this.setState({
        defaultvalue: genrenamelist,
        newGenrelist: genrenamelist,
      });
      allgenres = allgenres.filter((f) => !genrenamelist.includes(f));
      this.setState({ genreoptions: allgenres });
    }
  }
  render() {
    let triggeringevent = <Icon id="edit-movie" name="edit" />;
    return (
      <Modal
        onClose={() => this.setState({ open: false })}
        onOpen={() => this.setState({ open: true })}
        open={this.state.open}
        trigger={triggeringevent}
      >
        <Modal.Header> Edit {this.props.moviedetails.Name} </Modal.Header>{" "}
        <Modal.Content>
          <Modal.Description>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Director Name"
                  placeholder="Director name"
                  defaultValue={this.props.moviedetails.Director}
                  onChange={(event, newValue) =>
                    this.setState({ Director: newValue.value })
                  }
                />{" "}
                <Form.Input
                  fluid
                  label="Popularity"
                  placeholder="Popularity"
                  defaultValue={this.props.moviedetails.Popularity}
                  onChange={(event, newValue) =>
                    this.setState({ Popularity: newValue.value })
                  }
                />{" "}
                <Form.Input
                  fluid
                  label="IMDB_Score"
                  placeholder="IMDB_SCore"
                  defaultValue={this.props.moviedetails.IMDB_Score}
                  onChange={(event, newValue) =>
                    this.setState({ IMDB_Score: newValue.value })
                  }
                />{" "}
              </Form.Group>{" "}
              {this.state.semaphore ? (
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
                />
              ) : (
                ""
              )}{" "}
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
                <Form.Button color="red" onClick={this.handleDelete}>
                  {" "}
                  Delete{" "}
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

export default EditMovie;
