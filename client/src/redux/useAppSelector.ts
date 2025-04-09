import { useSelector, TypedUseSelectorHook } from "react-redux";
import { IState } from "./IState";

export const useAppSelector: TypedUseSelectorHook<IState> = useSelector;
