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

export async function getUserPlaces(
  page = 0,
  size = 10,
): Promise<UserPlacesResponse> {
  const config: AxiosRequestConfig = {
    url: "/places/for-user",
    method: "GET",
    params: {
      page,
      size,
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
    if (error.response?.status === 401) {
      console.error("Авторизація провалилася при видаленні. Спробуйте перелогінитися.");
      throw new Error("Не вдалося видалити локацію: проблема з авторизацією");
    } else {
      store.dispatch(logout()); 
      throw error;
    }
  }
}