import { useDispatch } from 'react-redux';
import { bindActionCreators, ActionCreatorsMapObject } from 'redux';

export function useActions<A, M extends ActionCreatorsMapObject<A>>(
	actions: M
) {
	return bindActionCreators(actions, useDispatch());
}
