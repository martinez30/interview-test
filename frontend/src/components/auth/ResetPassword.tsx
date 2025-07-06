import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, FormikHelpers, FormikValues } from "formik";
import { Alert, Button, Form } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";
import { NAVIGATION_PATH } from "@/constants";
import { toastr } from "@/utils/toastr";
import ReCAPTCHA from "react-google-recaptcha";

const step1Schema = Yup.object().shape({
    email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
});

const step2Schema = Yup.object().shape({
    code: Yup.string()
        .length(6)
        .matches(/^[0-9]+$/, "Código deve conter apenas números")
        .required("Código é obrigatório"),
    password: Yup.string()
        .min(8, "Senha deve conter no mínimo 8 caracteres")
        .max(255)
        .required("Senha é obrigatória"),
});

const INITIAL_VALUES = {
    email: "",
    submit: false,
    code: "",
    password: "",
};

function ResetPassword({ step, setStep }: { step: 1 | 2, setStep: (step: 1 | 2) => void }) {
    const navigate = useNavigate();
    const { resetPassword, confirmResetPassword } = useAuth();

    const onSubmit = async (values: FormikValues, { setErrors, setStatus, setSubmitting }: FormikHelpers<any>) => {
        try {
            if (step === 1) {
                await resetPassword(values.email);
                setStep(2);
                return;
            }
            else if (step === 2) {
                await confirmResetPassword(values.email, values.code, values.password);
                void toastr({ title: "Sucesso", text: "Senha alterada com sucesso", icon: "success" });
                navigate(NAVIGATION_PATH.AUTH.SIGN_IN.ABSOLUTE);
                return;
            }
            throw new Error("Something went wrong");
        } catch (error: any) {
            const message =
                error.__type && error.__type == "LimitExceededException"
                    ? "Você estouro a quantidade limite de solicitações. Por favor tente novamente mais tarde"
                    : error.message || "Something went wrong";

            setStatus({ success: false });
            setErrors({ submit: message });
            setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={step === 1 ? step1Schema : step2Schema}
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
                    {errors.submit && (
                        <Alert className="my-3" variant="danger">
                            <div className="alert-message">{errors.submit}</div>
                        </Alert>
                    )}
                    {
                        step === 1 && (
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    size="lg"
                                    type="email"
                                    name="email"
                                    placeholder="Entre com o seu email"
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
                        )
                    }
                    {
                        step === 2 && (
                            <React.Fragment>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="type"
                                        name="code"
                                        placeholder="Entre com o código"
                                        value={values.code}
                                        isInvalid={Boolean(touched.code && errors.code)}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {!!touched.code && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.code}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nova Senha</Form.Label>
                                    <Form.Control
                                        size="lg"
                                        type="password"
                                        name="password"
                                        placeholder="Entre com a nova senha"
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
                                </Form.Group>
                            </React.Fragment>
                        )
                    }
                    <div className="text-center mt-3" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {step === 1 ? "Enviar e-mail de recuperação de senha" : "Redefinir senha"}
                        </Button>
                        <Button variant="link" onClick={() => navigate(NAVIGATION_PATH.AUTH.SIGN_IN.ABSOLUTE)}>Voltar</Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}

export default ResetPassword;
