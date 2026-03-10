import { fetchFooterMenus } from "@/lib/api";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const columns = await fetchFooterMenus();
  return <FooterClient columns={columns} />;
}
