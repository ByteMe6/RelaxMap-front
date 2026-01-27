import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container";
import ProfileInfo from "./ProfileInfo";
import ProfilePlaceholder from "./ProfilePlaceholder";
import axios from "axios";
import { host } from "../../backendHost";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { mail } = useParams<{ mail: string }>();

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (!mail) return;

    axios.get(`${host}/users/${decodeURIComponent(mail)}`).then(res => setUserName(res.data.name)).catch(() => setUserName(""));
  }, [mail]);

  if (!mail) {
    return <ProfilePlaceholder />;
  }

  return (
    <Container>
      <ProfileInfo email={decodeURIComponent(mail)} userName={userName} />
    </Container>
  );
} 