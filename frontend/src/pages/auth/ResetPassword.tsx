import React, {useState} from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "react-bootstrap";

import Logo from "../../assets/logo.svg";
import ResetPassword from "@/components/auth/ResetPassword";

const ResetPasswordPage = () => {
    const [step, setStep] = useState<1 | 2>(1);

    return (
        <React.Fragment>
            <Helmet title="Reset Password" />
            <div className="text-center mt-4">
                <img src={Logo} height={70} className="mb-3" />
                {
                    step === 1 ? (
                        <>
                            <h1 className="h2">Resetar sua senha</h1>
                            <p className="lead">Entre com o seu e-mail para resetar a senha.</p>
                        </>
                    ) : step === 2 ? (
                        <>
                            <h1 className="h2">Informar código</h1>
                            <p className="lead">Enviamos um código de verificação para o email informado.</p>
                        </>
                    ) : null
                }
            </div>
            <Card>
                <Card.Body>
                    <div className="m-sm-3">
                        <ResetPassword step={step} setStep={setStep} />
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default ResetPasswordPage;
