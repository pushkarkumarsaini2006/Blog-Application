import {
  LuLayoutDashboard,
  LuGalleryVerticalEnd,
  LuMessageSquareQuote,
  LuLayoutTemplate,
  LuTag,
} from "react-icons/lu";


export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },

  {
    id: "02",
    label: "Create Post",
    icon: LuGalleryVerticalEnd,
    path: "/admin/posts",
  },

  {
    id: "03",
    label: "Comments",
    icon: LuMessageSquareQuote,
    path: "/admin/comments",
  },
];

export const BLOG_NAVBAR_DATA = [
  {
    id: "01",
    label: "Home",
    icon: LuLayoutTemplate,
    path: "/",
  },
  {
    id: "02",
    label: "Development",
    icon: LuTag,
    path: "/tag/Development",
  },
  {
    id: "03",
    label: "DSA",
    icon: LuTag,
    path: "/tag/DSA",
  },
]
