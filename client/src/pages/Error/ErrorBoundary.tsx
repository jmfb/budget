import { ReactNode, PureComponent, ErrorInfo } from "react";
import { connect } from "react-redux";
import { ErrorView } from "./ErrorView";
import { IErrorReport } from "~/models";
import { IState, errorSlice } from "~/redux";

export interface IErrorBoundaryOwnProps {
	children?: ReactNode;
}

export interface IErrorBoundaryStateProps {
	showError: boolean;
	action?: string;
	context?: string;
	message?: string;
}

export interface IErrorBoundaryDispatchProps {
	dismissError(): void;
	reportError(errorReport: IErrorReport): void;
}

export type IErrorBoundaryProps = IErrorBoundaryOwnProps &
	IErrorBoundaryStateProps &
	IErrorBoundaryDispatchProps;

export interface IErrorBoundaryState {
	hasBoundaryError: boolean;
}

function mapStateToProps(state: IState): IErrorBoundaryStateProps {
	const {
		error: { showError, action, context, message },
	} = state;
	return {
		showError,
		action,
		context,
		message,
	};
}

const mapDispatchToProps: IErrorBoundaryDispatchProps = {
	...errorSlice.actions,
};

export class ErrorBoundary extends PureComponent<
	IErrorBoundaryProps,
	IErrorBoundaryState
> {
	constructor(props: IErrorBoundaryProps) {
		super(props);
		this.state = {
			hasBoundaryError: false,
		};
	}

	static getDerivedStateFromError(error: Error) {
		void error;
		return {
			hasBoundaryError: true,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		const { reportError } = this.props;
		reportError({
			action: "componentDidCatch",
			context: errorInfo.componentStack ?? "",
			message: error.message,
		});
	}

	render() {
		const { showError, action, context, message, children } = this.props;
		const { hasBoundaryError } = this.state;
		if (showError || hasBoundaryError) {
			return (
				<ErrorView
					action={action}
					context={context}
					message={message}
					onClickDismiss={this.handleDismissClicked}
				/>
			);
		}
		return children;
	}

	handleDismissClicked = () => {
		const { dismissError } = this.props;
		dismissError();
		this.setState({
			hasBoundaryError: false,
		});
	};
}

export const ErrorBoundaryContainer = connect(
	mapStateToProps,
	mapDispatchToProps,
)(ErrorBoundary);
