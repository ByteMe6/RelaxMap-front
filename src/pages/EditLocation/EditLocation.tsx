import EditLocationForm from "./EditLocationForm";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";
import Container from "../../components/Container/Container";
export default function EditLocation() {
    const { id } = useParams<{ id?: string }>()
    const locations = useAppSelector((state) => state.location.locations.find((loc) => loc.id === Number(id)))
    console.log(locations)
  return (
    <Container>
      <EditLocationForm location={locations}/>
    </Container>
  );
}
