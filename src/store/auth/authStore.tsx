import { create } from "zustand";
interface TokenData {
  accessToken: string;
  refreshToken: string;
}

interface UserApiResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  expireAt: string;
  tokenData: TokenData;
}

interface UserInfoStore {
  accessToken: string;
  refreshToken: string;
  role: string;
  id: string;
  name: string;
  email: string;
  expireAt: string;
  storeUserData: (user: UserApiResponse) => void;
}

const userInfoStore = create<UserInfoStore>((set) => ({
  accessToken: "",
  refreshToken: "",
  role: "",
  id: "",
  name: "",
  email: "",
  expireAt: "",
  storeUserData: (user) =>
    set(() => ({
      accessToken: user?.tokenData.accessToken,
      refreshToken: user?.tokenData.refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
      expireAt: user.expireAt,
      role: user.role,
    })),
}));

export default userInfoStore;
