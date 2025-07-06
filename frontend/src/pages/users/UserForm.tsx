import React, { lazy, Suspense, useEffect, useState } from "react";
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";

import { Formik } from "formik";

import yup from "@/utils/yup";
import { toastr } from "@/utils/toastr";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { NAVIGATION_PATH } from "@/constants";
import { User } from "@/types/api/User";
import { UserService } from "@/services/UserService";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ReactQueryKeys } from "@/constants/ReactQueryKeys";
import { getBadgeColorByUserStatus } from "@/types/api/enums/UserStatus";
import { UserProfile, userProfileOptions } from "@/types/api/enums/UserProfile";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { TextFormField } from "@/components/form/TextFormField/TextFormField";
import Loader from "@/components/Loader";
import { mountRoute } from "@/utils/mountRoute";
import Swal from "sweetalert2";
import { AuthService } from "@/services/AuthService";
import { handlePhoneNumberChange } from "@/helpers/handlePhoneNumberChange";
import { isAdmin, isBackoffice } from "@/helpers/profileHelpers";
import useAppSelector from "@/hooks/useAppSelector";
import { AuthState } from "@/redux/slices/auth.slice";
import EnumCheckboxList, { EnumType } from "@/components/EnumCheckboxList";
import FormTabs from "@/components/FormTabs";

//@ts-ignore
const INITIAL_VALUES: User = {
    name: "",
    email: "",
    phoneNumber: "",
    profileId: UserProfile.ADMIN,
}

const schemaValidation = yup.object().shape({
    name: yup.string().required().label("Nome"),
    email: yup.string().required().email().label("Email"),
    phoneNumber: yup.string().optional().label("Número de telefone"),
    profileId: yup.string().required().label("Perfil"),
})

const service = new UserService();
const authService = new AuthService();

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const isEdit = !!id;
    const [date, setDate] = useState<Date>();

    const [selectedApprovalProfiles, setSelectedApprovalProfiles] = useState<number[]>([]);

    useEffect(() => {
        setDate(new Date());
    }, []);


    const { data } = useSuspenseQuery<User>({
        queryKey: [ReactQueryKeys.USER, id, date],
        meta: {
            fetchFn: async () => {
                if (!!id) {
                    const response = await service.getById(id ?? "") as User;

                    setSelectedApprovalProfiles(response.approvalProfiles?.map(x => x.code) ?? [])

                    return response;
                }
                return Promise.resolve(INITIAL_VALUES);
            }
        }
    })

    async function onSubmit(values: User) {
        try {
            if (!isEdit) {
                const userId = await service.create<User, string>(values);
                navigate(mountRoute(NAVIGATION_PATH.USERS.EDIT.ABSOLUTE, { id: userId }))
            }
            else {
                //@ts-ignore
                values.approvalProfiles = selectedApprovalProfiles;
                await service.update(id ?? "", values);
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

    async function blockUser(id: string) {
        await Swal.fire({
            title: `Bloquear usuário`,
            text: `Tem certeza que deseja Bloquear este usuário? Ele perderá o acesso ao sistema.`,
            icon: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await authService.disable(id);
                    setDate(new Date());
                    await toastr({ title: "Usuário Bloqueado com sucesso", icon: "success" })
                }
                catch (err: any) {
                    await toastr({ title: "Erro", text: err.message, icon: "error" })
                }
            }
        })
    }

    async function unblockUser(id: string) {
        await Swal.fire({
            title: `Desbloquear usuário`,
            text: `Tem certeza que deseja Desbloquear este usuário? Ele recuperará acesso ao sistema.`,
            icon: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                try {
                    await authService.enable(id);
                    setDate(new Date());
                    await toastr({ title: "Usuário Desbloqueado com sucesso", icon: "success" })
                }
                catch (err: any) {
                    await toastr({ title: "Erro", text: err.message, icon: "error" })
                }
            }
        })
    }

    const iamBackoffice = isBackoffice();

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
                                            initialValues={{
                                                ...data
                                            }}
                                            enableReinitialize={isEdit}
                                            validationSchema={schemaValidation}
                                            onSubmit={onSubmit}
                                        >
                                            {({
                                                handleSubmit,
                                                handleChange,
                                                handleBlur,
                                                touched,
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
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label>Nome <span style={{ color: "red" }}>*</span></Form.Label>
                                                                            <Form.Control type="text" value={values.name} name="name" placeholder="Nome" onChange={handleChange} isInvalid={touched.name && !!errors.name} onBlur={handleBlur} disabled={isEdit} />
                                                                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                                                        </Form.Group>
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <TextFormField
                                                                            componentType={TextFormFieldType.INPUT}
                                                                            name="email"
                                                                            label="Email"
                                                                            handleBlur={handleBlur}
                                                                            handleChange={handleChange}
                                                                            value={values.email}
                                                                            disabled={isEdit}
                                                                        />
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <TextFormField
                                                                            componentType={TextFormFieldType.INPUT}
                                                                            name="phoneNumber"
                                                                            label="Telefone"
                                                                            handleBlur={handleBlur}
                                                                            handleChange={(evnt) => handlePhoneNumberChange(evnt, handleChange)}
                                                                            value={values.phoneNumber}
                                                                        />
                                                                    </Col>
                                                                    <Col md={4}>
                                                                        <TextFormField
                                                                            componentType={TextFormFieldType.SELECT}
                                                                            name="profileId"
                                                                            label="Perfil"
                                                                            required
                                                                            handleBlur={handleBlur}
                                                                            handleChange={handleChange}
                                                                            value={values.profileId}
                                                                            // @ts-ignore
                                                                            isOptionDisabled={(item: any) => !iamBackoffice && (item.id === UserProfile.PARTNER_MASTER || item.id === UserProfile.TOLL_OPERATOR_MASTER)}
                                                                            options={userProfileOptions()}
                                                                        />
                                                                    </Col>
                                                                </Row>
                                                                <Row>
                                                                    {data.status &&
                                                                        <>
                                                                            <Col md={3}>
                                                                                <div>
                                                                                    <br />
                                                                                    <label className="form-label">Status de Confirmação:</label>
                                                                                    <br />
                                                                                    <Badge bg={getBadgeColorByUserStatus(data.status.code)}><span style={{ fontSize: "1rem" }}>{data.status.text}</span></Badge>
                                                                                </div>
                                                                            </Col>
                                                                            <Col md={3}>
                                                                                <br />
                                                                                <div>
                                                                                    <label className="form-label">Status de Acesso:</label>
                                                                                    <br />
                                                                                    <Badge bg={data.active ? "success" : "danger"}><span style={{ fontSize: "1rem" }}>{data.active ? "Habilidado" : "Bloqueado"}</span></Badge>
                                                                                </div>
                                                                            </Col>

                                                                        </>
                                                                    }
                                                                </Row>

                                                                <br />

                                                                <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar"}</Button>
                                                                <Button variant="secondary" style={{ marginLeft: 5 }} onClick={() => navigate(NAVIGATION_PATH.USERS.LISTING.ABSOLUTE)}>Voltar</Button>
                                                            </Form>
                                                        </Col>
                                                        {isEdit &&
                                                            <Col md={3} style={{ borderRadius: "5px", borderColor: "red", borderLeft: "1px solid grey" }}>
                                                                <Row>
                                                                    <h3>Gestão de Acesso</h3>
                                                                    <h5>Gerencie o acesso do usuário</h5>
                                                                </Row>
                                                                <Row>
                                                                    <Col md={10}>
                                                                        {data.active ? <>
                                                                            <Button type="submit" variant="primary" onClick={async () => await blockUser(data.id ?? "")} >Bloquear acesso</Button>
                                                                        </> : <>
                                                                            <Button type="submit" variant="primary" onClick={async () => await unblockUser(data.id ?? "")}>Desbloquear acesso</Button>
                                                                        </>}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        }

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

export default UserForm;