import SidebarNavSection from "./SidebarNavSection";
import { SIDEBAR } from "@/components/sidebar/dashboardItems";
import useAppSelector from "@/hooks/useAppSelector";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

const SidebarNav = () => {
  const { groups: roles } = useAppSelector(state => state.auth);
  const index = roles.findIndex((role: string) => role.endsWith("Master"));
  
  // @ts-ignore
  const sidebar = SIDEBAR[roles.at(index > -1 ? index : 0)];
  return (
    <ul className="sidebar-nav">
      {sidebar && sidebar.map((item: any) => (
        <SidebarNavSection
          key={item.title}
          pages={item.pages}
          title={item.title}
        />
      ))}
    </ul>
  );
};

export default SidebarNav;
