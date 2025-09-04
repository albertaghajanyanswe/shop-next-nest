import { Metadata } from "next";
import { NO_INDEX_PAGE } from "../../meta/constants";
import Auth from "./Auth";

export const metadata: Metadata = {
  title: '',
  ...NO_INDEX_PAGE
}

export default function AuthPage() {
  return (
    <Auth />
  )
}