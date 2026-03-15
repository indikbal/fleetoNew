import { fetchHeaderMenu } from "@/lib/api";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const links = await fetchHeaderMenu();
  return <NavbarClient links={links} />;
}
