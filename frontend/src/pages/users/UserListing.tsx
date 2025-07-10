import React, { Suspense } from "react";
import { Badge, Button, Card, Row } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import { User } from "@/types/api/User";
import { TextFormFieldType } from "@/components/form/TextFormField/TextFormFieldType";
import { ActionItemType, CrudActions } from "@/components/CrudActions";
import { Link, useNavigate } from "react-router-dom";
import { mountRoute } from "@/utils/mountRoute";
import { UserFilter } from "@/types/api/filters/UserFilter";
import Loader from "@/components/Loader";
import { getBadgeColorByUserProfile, userProfileOptions } from "@/types/api/enums/UserProfile";

import UserService from "@/services/UserService";
import DataTable from "@/components/DataTable";

export default function UserListing() {
    return (
        <>
            <Row style={{ justifyContent: "end", margin: "10px 0" }}>
                <Link to={NAVIGATION_PATH.USERS.CREATE.ABSOLUTE}>
                    <Button style={{ maxWidth: "fit-content", float: "right" }}>Adicionar</Button>
                </Link>
            </Row>
            <Card>
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
                            { Header: "Usuário", accessor: "username" },
                            {
                                Header: "Perfil",
                                accessor: item => (item.profile && (
                                    <Badge bg={getBadgeColorByUserProfile(item.profile as unknown as string)}>
                                        {item.profile}
                                    </Badge>
                                ))
                            }
                        ]}
                        query={async (filters, abortSignal) => {
                            let params: any = {};
                            filters.forEach((item) => {
                                if (item.value && item.value !== "null" && item.value !== undefined && item.value !== "undefined") {
                                    params[item.name] = item.value
                                }
                            });

                            return await UserService.getAll(params, abortSignal)
                        }}
                        fetchButton
                        cleanButton
                        filters={[
                            { componentType: TextFormFieldType.INPUT, name: "email", label: "E-mail:" },
                        ]}
                        queryName={["user", "listing"]}
                    />
                </Suspense>
            </Card>
        </>
    )
}
