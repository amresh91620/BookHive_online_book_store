import { useContext } from "react";
import { AdminContext } from "../context/admin/AdminContext";

export const useAdmin = () => {
  return useContext(AdminContext);
};