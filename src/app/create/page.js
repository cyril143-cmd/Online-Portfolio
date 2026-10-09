
import PortfolioForm from "../../components/PortfolioForm";

export default async function CreatePage({ searchParams }) {
  const params = await searchParams;
  return <PortfolioForm editing={params.edit === "1"} />;
}