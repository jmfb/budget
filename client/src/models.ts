export interface IErrorReport {
	action: string;
	context: string;
	message: string;
}

export interface IIndexModel {
	bundleVersion: string;
}

export interface ISignedInModel {
	accessToken: string;
	email: string;
}

export interface IHeartbeatModel {
	bundleVersion: string;
}
