// src/api/profileClient.ts
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
