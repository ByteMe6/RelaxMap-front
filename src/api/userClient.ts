import { authorizedRequest } from "./authClient";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export async function getUserInfo(email: string): Promise<UserInfo> {
  return authorizedRequest<UserInfo>({
    url: "/users/info",
    method: "GET",
    params: { email },
  });
}

export async function changeUserName(newName: string): Promise<void> {
  await authorizedRequest({
    url: "/auth/change-name",
    method: "PATCH",
    data: { newName },
  });
}