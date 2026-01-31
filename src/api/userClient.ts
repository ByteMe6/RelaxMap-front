import { authorizedRequest } from "./authClient";

export async function changeUserName(newName: string): Promise<void> {
  await authorizedRequest({
    url: "/auth/change-name",
    method: "PATCH",
    data: { newName },
  });
}
