import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
} from "semantic-ui-react";
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      emailid: "",
      password: "",
      username: "",
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }
  handlePasswordChange(e, newValue) {
    this.setState({ password: newValue.value });
  }
  handleEmailChange(e, newValue) {
    this.setState({ emailid: newValue.value });
  }
  handleUsernameChange(e, newValue) {
    this.setState({ username: newValue.value });
  }
  handleRegister(e, newValue) {
    axios
      .post("https://film-rating-assignment.herokuapp.com/api/register", {
        emailid: this.state.emailid,
        password: this.state.password,
        username: this.state.username,
      })
      .then((res) => {
        this.setState({ message: "Successfully added" });
        this.props.history.push("/login");
      })
      .catch((res) => this.setState({ message: res.message }));
  }
  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Register - (Only for admins){" "}
          </Header>{" "}
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="User Name"
                onChange={this.handleUsernameChange}
              />{" "}
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={this.handleEmailChange}
              />{" "}
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={this.handlePasswordChange}
              />
              <Button
                color="teal"
                fluid
                size="large"
                onClick={this.handleRegister}
              >
                Register{" "}
              </Button>{" "}
            </Segment>{" "}
          </Form>{" "}
          <Message>
            Already have an account ? <a href="/login"> Login </a>{" "}
          </Message>{" "}
        </Grid.Column>{" "}
      </Grid>
    );
  }
}
export default Register;
