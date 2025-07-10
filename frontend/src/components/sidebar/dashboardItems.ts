import { SidebarItemsType } from "@/types/sidebar";
import { NAVIGATION_PATH } from "@/constants";
import { FiUsers } from "react-icons/fi";
import { UserProfile } from "@/types/api/enums/UserProfile";
import { FaRegAddressBook } from "react-icons/fa";

// PAGES
const USERS_PAGE: SidebarItemsType = { href: NAVIGATION_PATH.USERS.LISTING.ABSOLUTE, title: "Usuários", icon: FiUsers }
const CLIENTS_PAGE: SidebarItemsType = { href: NAVIGATION_PATH.CLIENTS.LISTING.ABSOLUTE, title: "Clientes", icon: FaRegAddressBook }

export const SIDEBAR = {
    [UserProfile.Administrator]: [
        {
            title: "Gestão",
            pages: [USERS_PAGE, CLIENTS_PAGE]
        }
    ],
}