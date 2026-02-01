import { authorizedRequest } from "../api/authClient";
import type { AxiosRequestConfig } from "axios";

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
      "pageable.page": page,
      "pageable.size": size,
    },
  };
  return authorizedRequest<UserPlacesResponse>(config);
}

export async function getPlacesByEmail(
  email: string,
  page = 0,
  size = 10,
): Promise<UserPlacesResponse> {
  const config: AxiosRequestConfig = {
    url: "/places/by-user",
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
  await authorizedRequest({
    url: `/places/${placeId}`,
    method: "DELETE",
  });
}

export async function updatePlace(
  placeId: number,
  data: {
    name: string;
    placeType: string;
    region: string;
    description: string;
    imageName?: string;
  }
): Promise<UserPlace> {
  return authorizedRequest<UserPlace>({
    url: `/places/${placeId}`,
    method: "PUT",
    data,
  });
}