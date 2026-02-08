import EditLocationForm from "./EditLocationForm";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";
import Container from "../../components/Container/Container";
import { selectLocations } from "../../redux/slice/locationSlice";

export default function EditLocation() {
  // const { id } = useParams<{ id?: string }>()
  // const locations = useAppSelector((state) => state.location.locations.find((loc) => loc.id === Number(id)))
  // console.log(locations)

  const { id } = useParams<{ id?: string }>();
  const locations = useAppSelector(selectLocations);
  const location = locations.find((loc) => loc.id === Number(id));

  return (
    <Container>
      <EditLocationForm location={location} />
    </Container>
  );
}
