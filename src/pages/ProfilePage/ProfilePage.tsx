import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "../../components/Container/Container";
import ProfileInfo from "./ProfileInfo";
import ProfilePlaceholder from "./ProfilePlaceholder";
import { useAppDispatch } from "../../redux/hooks/hook";
import { logout } from "../../redux/slice/authSlice";
import { authorizedRequest } from "../../api/authClient";

interface UserInfoResponse {
  name: string;
}

export default function ProfilePage() {
  const { mail } = useParams<{ mail: string }>();
  const [userName, setUserName] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!mail) return;

    const emailDecoded = decodeURIComponent(mail);

    authorizedRequest<UserInfoResponse>({
      method: "GET",
      url: "/users/info",
      params: { email: emailDecoded },
    })
      .then((data) => setUserName(data.name))
      .catch(() => dispatch(logout()));
  }, [mail, dispatch]);

  if (!mail) return <ProfilePlaceholder />;

  const email = decodeURIComponent(mail);

  return (
    <Container>
      <ProfileInfo
        email={email}
        userName={userName}
        onChangeName={async (newName: string) => {
          await authorizedRequest<void>({
            method: "PATCH",
            url: "/auth/change-name",
            data: { newName },
          });
          setUserName(newName);
        }}
        onChangePassword={async (oldPass: string, newPass: string) => {
          await authorizedRequest<void>({
            method: "PATCH",
            url: "/auth/change-password",
            data: { oldPassword: oldPass, newPassword: newPass },
          });
        }}
      />
    </Container>
  );
}
