import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";
import Container from "../../components/Container/Container";
import { selectLocations } from "../../redux/slice/locationSlice";
import EditLocationForm from "./EditLocationForm";

export default function EditLocation() {
  const { id } = useParams<{ id: string }>();
  const locations = useAppSelector(selectLocations);
  
  // Шукаємо локацію в сторі. 
  // Якщо її немає (наприклад, після F5), форма повинна вміти робити власний запрос або отримувати null
  const location = locations.find((loc) => loc.id === Number(id));

  return (
    <Container>
      {location ? (
        <EditLocationForm location={location} />
      ) : (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Локацію не знайдено або завантаження...
        </p>
      )}
    </Container>
  );
}