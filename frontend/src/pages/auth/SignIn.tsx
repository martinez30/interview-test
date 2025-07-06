import React from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";

import Logo from "../../assets/logo.svg"

import SignIn from "../../components/auth/SignIn";

const SignInPage = () => {
  return (
    <React.Fragment>
      <Helmet title="Login" />
      <div className="text-center mt-4">
        <img src={Logo} height={70} className="mb-3" />
        <h2>Bem vindo</h2>
        <p className="lead">Acesse com sua conta para continuar</p>
      </div>

      <Card>
        <Card.Body>
          <div className="m-sm-3">
            <SignIn />
          </div>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
}

export default SignInPage;
