import AdvantagesBlock from "./AdvantagesBlock";
import HeroBlock from "./HeroBlock";
import LocationCard from "./LocationCard";
import PopularLocationsBlock from "./PopularLocationsBlock";
import ReviewsBlock from "./ReviewsBlock";


function HomePage() {
  return (
    <>
      <HeroBlock />
      <AdvantagesBlock />
      <PopularLocationsBlock />
      <LocationCard />
      <ReviewsBlock/>
    </>
  );
}

export default HomePage;