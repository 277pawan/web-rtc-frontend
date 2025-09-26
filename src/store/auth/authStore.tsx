import { create } from "zustand";

interface UserApiResponse {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserInfoStore {
  role: string;
  id: string;
  name: string;
  email: string;
  storeUserData: (user: UserApiResponse) => void;
}

const userInfoStore = create<UserInfoStore>((set) => ({
  role: "",
  id: "",
  name: "",
  email: "",
  storeUserData: (user) =>
    set(() => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })),
}));

export default userInfoStore;
