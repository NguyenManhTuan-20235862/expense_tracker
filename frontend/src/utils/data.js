import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";

// Function to get side menu data with translations
export const getSideMenuData = (t) => [
  {
    id: "01",
    label: t("Dashboard"),
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: t("Income"),
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: t("Expense"),
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "04",
    label: t("Setting"),
    icon: LuSettings,
    path: "/settings",
  },
  {
    id: "06",
    label: t("Logout"),
    icon: LuLogOut,
    path: "logout",
  },
];