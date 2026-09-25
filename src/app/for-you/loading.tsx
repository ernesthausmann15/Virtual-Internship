import { ViewTransition } from "react";
import { ForYouSkeleton } from "@/components/books/BookSkeletons";

export default function Loading() {
  return (
    <ViewTransition exit="slide-down" default="none">
      <ForYouSkeleton />
    </ViewTransition>
  );
}
