import { fetchHeaderMenu, fetchCommonData } from "@/lib/api";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const [links, common] = await Promise.all([
    fetchHeaderMenu(),
    fetchCommonData(),
  ]);
  return (
    <NavbarClient
      links={links}
      logoUrl={common.headerLogo}
      testRideUrl={common.headerTestRideUrl}
    />
  );
}
