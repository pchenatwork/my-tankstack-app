import { create } from "zustand";
import type { GetUserFilters } from "../apis/user";

type UserStore = {
  filters?: GetUserFilters;
  setFilters: (filters?: GetUserFilters) => void;
};

const useUserStore = create<UserStore>((set) => ({
  filters: undefined,
  setFilters: (filters) => set({ filters }),
}));

export default useUserStore;
