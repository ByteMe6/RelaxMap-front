import { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import type { LocationInfo } from "../../../redux/slice/locationSlice";
import LocationCard from "../LocationCard/LocationCards";
import styles from "./LocationGrid.module.scss";
import { api } from "../../../api/axiosInstance";

type Props = {
  locations?: LocationInfo[];
};

function LocationsGrid({ locations: initialLocations }: Props) {
  const [locations, setLocations] = useState<LocationInfo[]>(initialLocations || []);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const pageSize = 6;

  const fetchPage = async (p: number) => {
    try {
      const res = await api.get(`/places/all`, { params: { page: p, size: pageSize } });
      const data = res.data;
      setLocations(data.content || []);
      setTotalPages(data.totalPages ?? 0);
    } catch (e) {
      console.error(e);
      setLocations([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page]);

  return (
    <Container>
      <p></p>
      <ul className={styles.wrapperLocationCards}>
        {locations.map((location) => (
          <LocationCard key={location.id} info={location} />
        ))}
      </ul>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`${styles.pageBtn} ${idx === page ? styles.active : ""}`}
              onClick={() => setPage(idx)}
            >
              {idx + 1}
            </button>
          ))}

          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
    </Container>
  );
}

export default LocationsGrid;
