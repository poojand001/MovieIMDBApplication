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
import Alert from "@material-ui/lab/Alert";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      emailid: "",
      password: "",
      token: "",
      username: "",
      success: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }
  handlePasswordChange(e, newValue) {
    this.setState({ password: newValue.value });
  }
  handleEmailChange(e, newValue) {
    this.setState({ emailid: newValue.value });
  }
  handleLogin() {
    let comp = this;
    axios
      .post("https://film-rating-assignment.herokuapp.com/api/login", {
        emailid: comp.state.emailid,
        password: comp.state.password,
      })
      .then(function (res) {
        comp.setState({
          message: "Successfully logged in",
          token: res.data["accessToken"],
          username: res.data["UserName"],
          success: true,
        });
        setTimeout(() => {
          comp.props.history.push({
            pathname: "/admin",
            token: res.data["accessToken"],
            username: res.data["UserName"],
          });
        }, 2000);
      })
      .catch((res) => {
        comp.setState({
          message: "Invalid username or password",
          success: false,
        });
      });
  }
  render() {
    return (
      <React.Fragment>
        {" "}
        {this.state.message !== "" ? (
          <Alert severity={this.state.success ? "success" : "error"}>
            {" "}
            {this.state.message}{" "}
          </Alert>
        ) : (
          ""
        )}{" "}
        <Grid
          textAlign="center"
          style={{ height: "100vh" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Log - in (Only for admins){" "}
            </Header>{" "}
            <Form size="large">
              <Segment stacked>
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
                />{" "}
                <Button
                  color="teal"
                  fluid
                  size="large"
                  onClick={this.handleLogin}
                >
                  Login{" "}
                </Button>{" "}
              </Segment>{" "}
            </Form>{" "}
            <Message>
              New to us ? <a href="/Register"> Register </a>{" "}
            </Message>{" "}
          </Grid.Column>{" "}
        </Grid>
      </React.Fragment>
    );
  }
}
export default Login;
