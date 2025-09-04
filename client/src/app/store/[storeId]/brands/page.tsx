import { NO_INDEX_PAGE } from "@/meta/constants";
import { Metadata } from "next";
import { Brands } from "./Brands";

export const metadata: Metadata = {
  title: 'Brands',
  ...NO_INDEX_PAGE,
};

export default function BrandsPage() {
  return <Brands />;
}