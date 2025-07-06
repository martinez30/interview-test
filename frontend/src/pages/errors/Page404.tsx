import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { Button } from "react-bootstrap";
import { NAVIGATION_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { Roles } from "@/constants/Roles";

import Image from "@/assets/img/page404.svg"

const Page404 = () => {
    const { roles } = useAuth();
    let navigate: string = "";

    if (roles.includes(Roles.ADMINISTRATOR)) {
        navigate = NAVIGATION_PATH.DASHBOARD.ROOT;
    }
    else {
        navigate = NAVIGATION_PATH.DASHBOARD.ROOT
    }

    return (
        <React.Fragment>
            <Helmet title="Página não encontrada" />
            <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', maxWidth: '90vw', margin: 'auto' }}>
                <img src={Image} width={400} />
                <p className="h2">Página não encontrado</p>
                <p className="lead fw-normal mt-3 mb-4">
                    A página que voce está procurando não existe.
                </p>
                <Link to={navigate}>
                    <Button variant="primary" size="lg">
                        Retornar ao site
                    </Button>
                </Link>
            </div>
        </React.Fragment>
    );
}

export default Page404;
