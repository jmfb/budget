import { get } from './hub';
import { IHeartbeatModel } from '~/models';

export async function heartbeat(accessToken: string) {
	return await get<IHeartbeatModel>({
		endpoint: '/api/diagnostics/heartbeat',
		accessToken
	});
}
