import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container";
import ProfileInfo from "./ProfileInfo";
import ProfilePlaceholder from "./ProfilePlaceholder";
import axios, { AxiosError } from "axios";
import { host } from "../../backendHost";
import { useEffect, useState } from "react";
import { logout } from "../../redux/slice/authSlice.ts";
import {useAppDispatch} from "../../redux/hooks/hook.ts";

export default function ProfilePage() {
    const { mail } = useParams<{ mail: string }>();
    const [userName, setUserName] = useState<string>("");
    const dispatch = useAppDispatch();

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    useEffect(() => {
        if (!mail) return;

        const fetchProfile = async () => {
            try {
                await loadProfileWithAccessToken(accessToken, mail, setUserName);
            } catch (error) {
                const axiosError = error as AxiosError;

                // only try refresh on 401
                if (axiosError.response?.status === 401 && refreshToken) {
                    try {
                        const newAccessToken = await refreshAccessToken(refreshToken);
                        localStorage.setItem("accessToken", newAccessToken);

                        await loadProfileWithAccessToken(newAccessToken, mail, setUserName);
                    } catch {
                        dispatch(logout());
                    }
                } else {
                    dispatch(logout());
                }
            }
        };

        fetchProfile();
    }, [mail, accessToken, refreshToken, dispatch]);

    if (!mail) {
        return <ProfilePlaceholder />;
    }

    return (
        <Container>
            <ProfileInfo email={decodeURIComponent(mail)} userName={userName} />
        </Container>
    );
}

async function loadProfileWithAccessToken(
    token: string | null,
    mail: string,
    setUserName: (name: string) => void
) {
    if (!token) {
        throw new Error("No access token");
    }

    const response = await axios.get(`${host}/users/info?email=${decodeURIComponent(mail)}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    setUserName(response.data.name);
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await axios.post(`${host}/auth/refresh`, {
        refreshToken,
    });

    return response.data.accessToken;
}
