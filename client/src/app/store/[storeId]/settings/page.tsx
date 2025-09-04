import { NO_INDEX_PAGE } from "@/meta/constants";
import { Metadata } from "next";
import { Settings } from "./Settings";

export const metadata: Metadata = {
  title: 'Store Settings',
  ...NO_INDEX_PAGE,
};

export default function SettingsPage() {
  return <Settings />;
}