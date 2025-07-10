import React, { lazy, Suspense, useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";

import { Formik } from "formik";

import yup from "@/utils/yup";
import { toastr } from "@/utils/toastr";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { NAVIGATION_PATH } from "@/constants";
import { User } from "@/types/api/User";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ReactQueryKeys } from "@/constants/ReactQueryKeys";
import { UserProfile, userProfileOptions } from "@/types/api/enums/UserProfile";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { TextFormField } from "@/components/form/TextFormField/TextFormField";
import Loader from "@/components/Loader";
import { mountRoute } from "@/utils/mountRoute";
import FormTabs from "@/components/FormTabs";
import UserService from "@/services/UserService";

//@ts-ignore
const INITIAL_VALUES: User = {
    username: "",
    password: "",
    profile: UserProfile.Administrator,
}

export default function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const schemaValidation = yup.object().shape({
        username: yup.string().required().label("Username"),
        password: !isEdit
            ? yup.string().required().label("Senha")
            : yup.string().label("Senha"),
        profile: yup.string().required().label("Perfil"),
    })

    const { data } = useSuspenseQuery<User>({
        queryKey: [ReactQueryKeys.USER, id],
        meta: {
            fetchFn: async () => {
                if (!!id) {
                    const user = await UserService.getById<User>(id ?? "");
                    return { ...user, profile: UserProfile[user.profile] }
                }

                return Promise.resolve(INITIAL_VALUES);
            }
        }
    })

    async function onSubmit(values: User) {
        try {
            if (!isEdit) {
                const user = await UserService.create<User, User>(values);
                navigate(NAVIGATION_PATH.USERS.LISTING.ABSOLUTE)
            }
            else {
                await UserService.update(id ?? "", values);
            }

            void toastr({ title: `Usuário ${isEdit ? "atualizado" : "criado"} com sucesso`, icon: "success" })
            queryClient.removeQueries({ queryKey: [ReactQueryKeys.USER] })
        }
        catch (err: any) {
            void toastr({ title: "Erro", text: err.message, icon: "error" })
        }
    }

    const title = isEdit
        ? "Editando usuário"
        : "Novo usuário";

    return (
        <React.Fragment>
            <Helmet title={title} />
            <Suspense fallback={<><Loader /><br /><br /></>}>
                <FormTabs
                    tabs={[
                        {
                            title: 'Usuário', element: (
                                <Card>
                                    <Card.Header>
                                        <Card.Title>{title}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Formik
                                            initialValues={{ ...data }}
                                            enableReinitialize={isEdit}
                                            validationSchema={schemaValidation}
                                            onSubmit={onSubmit}
                                        >
                                            {({
                                                handleSubmit,
                                                handleChange,
                                                handleBlur,
                                                errors,
                                                values,
                                                isSubmitting,
                                                isValid
                                            }) => (
                                                <>
                                                    <Row>
                                                        <Col md={9}>
                                                            <Form noValidate onSubmit={handleSubmit}>
                                                                <Row>
                                                                    <Col md={4}>
                                                                        <TextFormField
                                                                            componentType={TextFormFieldType.INPUT}
                                                                            name="username"
                                                                            label="Username"
                                                                            required
                                                                            placeholder="Username"
                                                                            handleBlur={handleBlur}
                                                                            handleChange={handleChange}
                                                                            value={values.username}
                                                                            formikError={errors.username}
                                                                        />
                                                                    </Col>
                                                                    {isEdit ? null : (
                                                                        <Col md={4}>
                                                                            <TextFormField
                                                                                componentType={TextFormFieldType.INPUT}
                                                                                name="password"
                                                                                label="Senha"
                                                                                password
                                                                                handleBlur={handleBlur}
                                                                                handleChange={handleChange}
                                                                                value={values.password}
                                                                                disabled={isEdit}
                                                                            />
                                                                        </Col>
                                                                    )}
                                                                    <Col md={4}>
                                                                        <TextFormField
                                                                            componentType={TextFormFieldType.SELECT}
                                                                            name="profile"
                                                                            label="Perfil"
                                                                            required
                                                                            handleBlur={handleBlur}
                                                                            handleChange={handleChange}
                                                                            value={values.profile}
                                                                            options={userProfileOptions()}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <br />
                                                                <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar"}</Button>
                                                                <Button variant="secondary" style={{ marginLeft: 5 }} onClick={() => navigate(NAVIGATION_PATH.USERS.LISTING.ABSOLUTE)}>Voltar</Button>
                                                            </Form>
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}
                                        </Formik>
                                    </Card.Body>
                                </Card>
                            )
                        }
                    ]}
                />
            </Suspense>
        </React.Fragment>
    )
}