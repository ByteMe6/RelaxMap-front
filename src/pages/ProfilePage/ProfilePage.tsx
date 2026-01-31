import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container";
import ProfileInfo from "./ProfileInfo";
import ProfilePlaceholder from "./ProfilePlaceholder";
import axios, { AxiosError } from "axios";
import { host } from "../../backendHost";
import { useEffect, useState } from "react";
import { logout } from "../../redux/slice/authSlice.ts";
import { useAppDispatch } from "../../redux/hooks/hook.ts";

export default function ProfilePage() {
  const { mail } = useParams<{ mail: string }>();
  const [userName, setUserName] = useState<string>("");

  const dispatch = useAppDispatch();

  async function loadProfileWithAccessToken(
    token: string,
    mail: string,
    setUserName: (name: string) => void,
  ) {
    const response = await axios.get(
      `${host}/users/info?email=${decodeURIComponent(mail)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setUserName(response.data.name);
  }

  async function refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await axios.post(`${host}/auth/refresh`, { refreshToken });
    return response.data.accessToken;
  }

  async function changePassword(
    token: string,
    oldPassword: string,
    newPassword: string,
  ) {
    await axios.patch(
      `${host}/auth/change-password`,
      { oldPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  async function changeName(token: string, newName: string) {
    await axios.patch(
      `${host}/auth/change-name`,
      { newName },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }

  const withAuthRetry = async (callback: (token: string) => Promise<void>) => {
    let token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!token) throw new Error("No access token");

    try {
      await callback(token);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401 && refreshToken) {
        try {
          token = await refreshAccessToken(refreshToken);
          localStorage.setItem("accessToken", token);
          await callback(token);
        } catch {
          dispatch(logout());
        }
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    if (!mail) return;
    withAuthRetry((token) =>
      loadProfileWithAccessToken(token, mail, setUserName),
    ).catch(() => dispatch(logout()));
  }, [mail]);

  if (!mail) return <ProfilePlaceholder />;

  return (
    <Container>
      <ProfileInfo
        email={decodeURIComponent(mail)}
        userName={userName}
        onChangeName={async (newName: string) =>
          withAuthRetry(async (token: string) => {
            await changeName(token, newName);
            setUserName(newName);
          })
        }
        onChangePassword={async (oldPass: string, newPass: string) =>
          withAuthRetry(async (token: string) => {
            await changePassword(token, oldPass, newPass);
          })
        }
      />
    </Container>
  );
}
