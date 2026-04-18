import { fetchFooterMenus, fetchCommonData } from "@/lib/api";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const [columns, common] = await Promise.all([
    fetchFooterMenus(),
    fetchCommonData(),
  ]);
  return <FooterClient columns={columns} common={common} />;
}
