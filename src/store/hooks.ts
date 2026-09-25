import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

/** Typed hooks so selectors know the slice shape without a manual cast. */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
