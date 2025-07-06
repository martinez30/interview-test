import { SidebarItemsType } from "@/types/sidebar";
import { NAVIGATION_PATH, ROLES } from "@/constants";
import { FiUsers } from "react-icons/fi";

// PAGES
const USERS_PAGE: SidebarItemsType = { href: NAVIGATION_PATH.USERS.LISTING.ABSOLUTE, title: "Usuários", icon: FiUsers }

const ADMIN_SIDEBAR = [
    USERS_PAGE,
];

export const SIDEBAR = {
    [ROLES.ADMIN]: [
        {
            title: "Gestão",
            pages: ADMIN_SIDEBAR
        }
    ],
}