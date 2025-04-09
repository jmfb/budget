import { useDispatch } from "react-redux";
import { bindActionCreators, ActionCreatorsMapObject } from "redux";

export function useActions<A, M extends ActionCreatorsMapObject<A>>(slice: {
	actions: M;
}) {
	return bindActionCreators(slice.actions, useDispatch());
}
