import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container";
import ProfileInfo from "./ProfileInfo";
import ProfilePlaceholder from "./ProfilePlaceholder";

export default function ProfilePage() {
  const { mail } = useParams<{ mail: string }>();

  if (!mail) {
    return <ProfilePlaceholder />;
  }

  return (
    <Container>
      <ProfileInfo email={decodeURIComponent(mail)} />
    </Container>
  );
}