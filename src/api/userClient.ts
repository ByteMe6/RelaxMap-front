// src/api/userClient.ts
import { authorizedRequest } from "../api/authClient";

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

export async function changeUserName(name: string): Promise<void> {
  await authorizedRequest({
    url: "/auth/change-name",
    method: "PATCH",
    data: { name },          // было { newName }
  });
}

export async function changePassword(password: string): Promise<void> {
  await authorizedRequest({
    url: "/auth/change-password",
    method: "PATCH",
    data: { password },      // было { newPassword }
  });
}

export async function deleteAccount(): Promise<void> {
  await authorizedRequest({
    url: "/users/delete-account",
    method: "DELETE",
  });
}
