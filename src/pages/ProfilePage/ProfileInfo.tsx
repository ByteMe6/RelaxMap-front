interface Props {
  email: string;
  userName: string;
}

export default function ProfileInfo({ email, userName }: Props) {
  return (
    <div>
      <h2>Профіль користувача</h2>
      <p>Email: {email}</p>
      <p>Name: {userName}</p>
      {/* <button className="standart-btn">change password</button> */}
    </div>
  );
}