import { useContext } from "react";
import { AddressContext } from "../context/address/AddressContext";

export const useAddress = () => {
  return useContext(AddressContext);
};
