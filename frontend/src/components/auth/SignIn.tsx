import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Form } from "react-bootstrap";
import useAuth from "@/hooks/useAuth";
import { Loader } from "react-feather";
import ReCAPTCHA from "react-google-recaptcha";


function SignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [searchParams] = useSearchParams();
  const [redirectUri] = useState(searchParams.get("redirect_uri"));

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        submit: false,
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Deve ser um email válido")
          .max(255)
          .required("Email é obrigatório"),
        password: Yup.string().max(255).required("Senha é obrigatória"),
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          const response: any = await signIn(values.email, values.password);

          if (response.isError) {
            setStatus({ success: false });
            setErrors({ submit: response.message });
            setSubmitting(false);
          }
          else {
            if (response && response.message && response.message === "New password required") {
              navigate("/auth/new-password", { state: { email: values.email, oldPassword: values.password } });
              return;
            }

            if (redirectUri == "/auth/sign-in")
              navigate("/");
            else {
              navigate(redirectUri ?? "/");
            }
          }

        } catch (error: any) {
          const message = error.message || "Something went wrong";

          setStatus({ success: false });
          setErrors({ submit: message });
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <>
          <Form onSubmit={handleSubmit}>
            {errors.submit && (
              <Alert className="my-3" variant="danger">
                <div className="alert-message">{errors.submit}</div>
              </Alert>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                size="lg"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={values.email}
                isInvalid={Boolean(touched.email && errors.email)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {!!touched.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                size="lg"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={values.password}
                isInvalid={Boolean(touched.password && errors.password)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {!!touched.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              )}
              <small>
                <Link to="/auth/reset-password">Esqueceu a senha?</Link>
              </small>
            </Form.Group>


            <div className="d-grid gap-2 mt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader /> : "Login"}
              </Button>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}

export default SignIn;
