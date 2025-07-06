import React from "react";
import { Dropdown } from "react-bootstrap";
import { PieChart, Settings, User } from "react-feather";

import avatar1 from "../../assets/img/avatars/avatar.jpg";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { NAVIGATION_PATH } from "@/constants";
import { useQueryClient } from "@tanstack/react-query";
import { ReactQueryKeys } from "@/constants/ReactQueryKeys";
import useAppSelector from "@/hooks/useAppSelector";

const NavbarUser = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user } = useAppSelector((state) => state.auth);

  return (
    <Dropdown className="nav-item" align="end">
      <span className="d-inline-block d-sm-none">
        <Dropdown.Toggle as="a" className="nav-link">
          <Settings size={18} className="align-middle" />
        </Dropdown.Toggle>
      </span>
      <span className="d-none d-sm-inline-block">
        <Dropdown.Toggle as="a" className="nav-link">
          <span className="text-dark">{user?.name} </span>
        </Dropdown.Toggle>
      </span>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => {
          signOut();
          queryClient.removeQueries({ queryKey: [ReactQueryKeys.PROFILE] })
          navigate(NAVIGATION_PATH.AUTH.SIGN_IN.ABSOLUTE);
        }}>Sair</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NavbarUser;
