import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { PageLoading } from "~/components";
import { useActions, useAppSelector, authSlice } from "~/redux";

export function AuthenticateContainer() {
	const { authenticate } = useActions(authSlice);
	const email = useAppSelector((state) => state.auth.email);
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");

	useEffect(() => {
		authenticate(code ?? "");
	}, [code]);

	if (email !== undefined || !code) {
		return <Navigate to="/" />;
	}

	return (
		<main className="responsive">
			<section>
				<PageLoading message="Authenticating..." />
			</section>
		</main>
	);
}
