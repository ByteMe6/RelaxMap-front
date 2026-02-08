import type { AxiosRequestConfig } from "axios";
import { authorizedRequest } from "./authClient";
import store from "../redux/store";
import { logout } from "../redux/slice/authSlice";

export interface UserPlace {
  id: number;
  name: string;
  placeType: string;
  region: string;
  description: string;
  imageName: string;
}

export interface UserPlacesResponse {
  content: UserPlace[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export async function getPlacesForUser(
  email: string,
  page = 0,
  size = 50,
): Promise<UserPlacesResponse> {
  return authorizedRequest<UserPlacesResponse>({
    url: "/places/for-user",
    method: "GET",
    params: {
      email,
      "pageable.page": page,
      "pageable.size": size,
    },
  });
}

export async function getUserPlaces(
  page = 0,
  size = 50,
): Promise<UserPlacesResponse> {
  const state = store.getState();
  const email = state.auth.email;

  if (!email) {
    throw new Error("Email користувача відсутній у Redux стані");
  }

  const config: AxiosRequestConfig = {
    url: "/places/for-user",
    method: "GET",
    params: {
      email,              
      "pageable.page": page, 
      "pageable.size": size,
    },
  };

  return authorizedRequest<UserPlacesResponse>(config);
}

export async function deletePlace(placeId: number): Promise<void> {
  try {
    await authorizedRequest({
      url: `/places/${placeId}`,
      method: "DELETE",
    });
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 401) {
      store.dispatch(logout());
      throw new Error(
        "Сеанс завершено. Будь ласка, виконайте вхід ще раз та повторіть спробу видалення.",
      );
    }

    throw error;
  }
}
