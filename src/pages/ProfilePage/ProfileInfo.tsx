interface Props {
  email: string;
}

export default function ProfileInfo({ email }: Props) {
  return (
    <div>
      <h2>Профіль користувача</h2>
      <p>Email: {email}</p>
    </div>
  );
}