import { ViewTransition } from "react";
import { ForYouView } from "@/components/books/ForYouView";
import { getBooksByStatus } from "@/lib/books";

export const revalidate = 60;

export default async function ForYouPage() {
  const [selected, recommended, suggested] = await Promise.all([
    getBooksByStatus("selected"),
    getBooksByStatus("recommended"),
    getBooksByStatus("suggested"),
  ]);

  return (
    <ViewTransition enter="slide-up" default="none">
      <ForYouView selected={selected} recommended={recommended} suggested={suggested} />
    </ViewTransition>
  );
}
