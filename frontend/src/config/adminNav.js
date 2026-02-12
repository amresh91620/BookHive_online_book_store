import {
  LayoutDashboard,
  BookText,
  Users,
  MessageSquare,
} from "lucide-react";

export const ADMIN_NAV_META = {
  title: "Dashboard",
  subtitle: "Management Portal",
};

export const ADMIN_NAV_ITEMS = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Books",
    path: "/admin/books",
    subPaths: ["/admin/books", "/admin/add-book", "/admin/edit-book"],
    icon: BookText,
  },
  {
    name: "Manage Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Manage Reviews",
    path: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    name: "Manage Messages",
    path: "/admin/messages",
    icon: MessageSquare,
  },
];
