import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button, Card, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg"
import ReCAPTCHA from "react-google-recaptcha";

import Yup from "@/utils/yup";

import { Formik, FormikValues } from "formik";
import { NAVIGATION_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { toastr } from "@/utils/toastr";
import useAppDispatch from "@/hooks/useAppDispatch";
import { clearSessionToken } from "@/redux/slices/auth.slice";

const INITIAL_VALUES = {
    email: "",
    newPassword: "",
    confirmPassword: ""
}

const schemaValidation = Yup.object().shape({
    email: Yup.string().optional(),
    newPassword: Yup.string().required().label("Senha"),
    confirmPassword: Yup.string().required().oneOf([Yup.ref("newPassword")], "As senhas devem ser iguais").label("Confirmação de senha")
})

interface LocationState {
    email: string;
    oldPassword: string;
}

const SetNewPassword = () => {
    const navigate = useNavigate();
    const { forceChangePassword } = useAuth();

    const dispatch = useAppDispatch();
    const location = useLocation();
    const state = location.state as LocationState;

    async function onSubmit(values: FormikValues) {
        try {
            await forceChangePassword(state.email, values.newPassword)
            void toastr({ title: "Sucesso", text: "Senha cadastrada com sucesso", icon: "success" })
            dispatch(clearSessionToken());
            navigate(NAVIGATION_PATH.DASHBOARD.ROOT, { replace: true });
        } catch (error: any) {
            const message = error.message || "Ocorreu um erro inesperado";
            await toastr({ title: "Erro", text: message, icon: "error" })
        }
    }

    return (
        <React.Fragment>
            <Helmet title="Cadastrar senha" />
            <div className="text-center mt-4">
                <img src={Logo} height={70} className="mb-3" />
                <h1 className="h2">Primeiro acesso</h1>
                <p className="lead">Identificamos que você é novo(a) na plataforma, cadastre sua nova senha para
                    continuar</p>
            </div>
            <Card>
                <Card.Body>
                    <div className="m-sm-3">
                        <Formik
                            initialValues={INITIAL_VALUES}
                            validationSchema={schemaValidation}
                            onSubmit={onSubmit}
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
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Senha</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            name="newPassword"
                                            placeholder="Digita a nova senha"
                                            type="password"
                                            value={values.newPassword}
                                            isInvalid={Boolean(touched.newPassword && errors.newPassword)}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {!!touched.newPassword && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.newPassword}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Confirmar senha</Form.Label>
                                        <Form.Control
                                            size="lg"
                                            name="confirmPassword"
                                            placeholder="Digita a confirmação da senha"
                                            type="password"
                                            value={values.confirmPassword}
                                            isInvalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        {!!touched.confirmPassword && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <div className="text-center mt-3">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={isSubmitting}
                                        >
                                            Cadastrar senha
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}
export default SetNewPassword;
