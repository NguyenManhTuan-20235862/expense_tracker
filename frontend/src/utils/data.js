import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "ダッシュボード",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "収入",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "支出 / 経費",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "06",
    label: "ログアウト",
    icon: LuLogOut,
    path: "logout",
  },
];