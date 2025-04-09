import { clsx } from "clsx";
import styles from "./LoadingIcon.module.css";

export function LoadingIcon() {
	const axisValues = [5, 11.5, 27, 42.5, 49];
	const coordinates = [
		[2, 0],
		[3, 1],
		[4, 2],
		[3, 3],
		[2, 4],
		[1, 3],
		[0, 2],
		[1, 1],
	];
	return (
		<svg
			viewBox="0 0 58 58"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx(styles.loadingIcon, "loading-icon")}
		>
			<g
				fill="none"
				fillRule="evenodd"
				transform="translate(2 1)"
				stroke="currentColor"
				strokeWidth="1.5"
			>
				{coordinates.map(([indexX, indexY], index) => (
					<circle
						key={index}
						cx={axisValues[indexX]}
						cy={axisValues[indexY]}
						r={5}
						fillOpacity="0"
						fill="currentColor"
					>
						<animate
							attributeName="fill-opacity"
							begin="0s"
							dur="1s"
							values={coordinates
								.map((_, position) =>
									position === index ? 1 : 0,
								)
								.join(";")}
							calcMode="linear"
							repeatCount="indefinite"
						/>
					</circle>
				))}
			</g>
		</svg>
	);
}
