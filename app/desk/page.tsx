import { Suspense } from "react";
import { Desk } from "@/components/desk";
import { SiteHeader } from "@/components/site-header";

export default function DeskPage() {
  return (
    <>
      <SiteHeader current="desk" />
      <Suspense fallback={<main className="desk-main" />}>
        <Desk />
      </Suspense>
    </>
  );
}
