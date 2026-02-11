import { useState, useMemo, useEffect } from "react";
import Container from "../../../components/Container/Container";
import type { LocationInfo } from "../../../redux/slice/locationSlice";
import LocationCard from "../LocationCard/LocationCards";
import styles from "./LocationGrid.module.scss";

type Props = {
  locations?: LocationInfo[];
};

const PAGE_SIZE = 6;

function LocationsGrid({ locations: locationsProp = [] }: Props) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(locationsProp.length / PAGE_SIZE));

  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [locationsProp, page, totalPages]);
  const paginatedLocations = useMemo(() => {
    const start = page * PAGE_SIZE;
    return locationsProp.slice(start, start + PAGE_SIZE);
  }, [locationsProp, page]);

  return (
    <Container>
      <p></p>
      <ul className={styles.wrapperLocationCards}>
        {paginatedLocations.map((location) => (
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
