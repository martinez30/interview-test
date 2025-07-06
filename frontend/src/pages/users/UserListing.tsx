import React, { Suspense, useEffect, useState } from "react";


import { UserService } from "@/services/UserService";
import { Badge, Button, Card, Row } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import { User } from "@/types/api/User";
import { DataTableType } from "@/components/DataTable";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { ActionItemType, CrudActions } from "@/components/CrudActions";
import { Link, useNavigate } from "react-router-dom";
import { mountRoute } from "@/utils/mountRoute";
import { UserFilter } from "@/types/api/filters/UserFilter";
import Loader from "@/components/Loader";
import { getBadgeColorByUserProfile, userProfileOptions } from "@/types/api/enums/UserProfile";
import { UserStatus } from "@/types/api/enums/UserStatus";
import CustomTooltip from "@/components/Tooltip";
import { isBackoffice } from "@/helpers/profileHelpers";

const DataTable = React.lazy(() => import("../../components/DataTable")) as DataTableType;

const service = new UserService();

const UserListing = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        setDate(new Date());
    }, []);

    const iamBackoffice = isBackoffice();

    return <>
        <Row style={{ justifyContent: "end", margin: "10px 0" }}>
            <Link to={NAVIGATION_PATH.USERS.CREATE.ABSOLUTE}>
                <Button style={{ maxWidth: "fit-content", float: "right" }}>Adicionar</Button>
            </Link>
        </Row>
        <Card >
            <Card.Title></Card.Title>
            <Card.Header>
                <Card.Title>
                    Usuários
                </Card.Title>
            </Card.Header>
            <Suspense fallback={<><Loader /><br /><br /></>}>
                <DataTable<User, UserFilter>
                    thin
                    columns={[
                        {
                            Header: "Ações",
                            accessor: item => <CrudActions cell={item} actions={[
                                { type: ActionItemType.EDIT, handler: (item) => { window.open(mountRoute(NAVIGATION_PATH.USERS.EDIT.ABSOLUTE, { id: item.id }), '_blank') } },
                            ]} />
                        },
                        { Header: "Usuário", accessor: "name" },
                        {
                            Header: "Perfil",
                            accessor: item => (
                                item.profile && <Badge bg={getBadgeColorByUserProfile(item.profile.code)}>
                                    {item.profile.text}
                                </Badge>
                            )
                        },
                        { Header: "E-mail", accessor: item => <span>{item.email}</span> },
                        { Header: "Acesso", accessor: item => <span>{item.accessTo} {item.isBusinessGroupUser && <CustomTooltip text="Usuário de Grupo Econômico. Acessa todas as empresas do Grupo."></CustomTooltip>}</span> },
                        { Header: "Status", accessor: item => <><Badge bg={item.active ? "success" : "danger"}>{item.active ? "Habilitado" : "Bloqueado"}</Badge> {item.status && item.status.code !== UserStatus.CONFIRMED && <CustomTooltip text={item.status?.text}></CustomTooltip>}</> }
                    ]}
                    query={async (filters, pagination) => {
                        let params: any = {};
                        filters.forEach((item) => {
                            if (item.value && item.value !== "null" && item.value !== undefined && item.value !== "undefined") {
                                params[item.name] = item.value
                            }
                        });



                        return await service.paged(params, pagination)
                    }}
                    fetchButton
                    cleanButton
                    showRegisterCount
                    filters={[
                        { componentType: TextFormFieldType.INPUT, name: "email", label: "E-mail:" },
                        { componentType: TextFormFieldType.SELECT, name: "profile", label: "Perfil:", options: userProfileOptions(), placeholder: 'Selecione...', isClearable: true },
                    ]}
                    queryName={["user", "listing", date]}
                />
            </Suspense>
        </Card >
    </>
}

export default UserListing;