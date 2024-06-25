import { useEffect, useState } from "react";
import styles from "./App.module.css";
import AppExtensionsSDK from "@pipedrive/app-extensions-sdk";
import { useForm } from "react-hook-form";

function App() {
	useEffect(() => {
		(async () => {
			const sdk = new AppExtensionsSDK();

			await sdk.initialize({ size: { height: 600, width: 800 } });
		})();
	}, []);

	const [isSaved, setIsSaved] = useState(false);

	const { register, handleSubmit, formState } = useForm();
	const onSubmit = (data) => {
		(async () => {
			let res;
			try {
				res = await fetch(
					"https://pipedrivecrmapp-production.up.railway.app/name",
					{
						method: "post",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(data),
					}
				);
				res = await res.json()
				console.log(res)
			} catch (error) {
				console.error(error);
			}
			if (res.success) setIsSaved(true);
		})();
	};

	if (isSaved)
		return (
			<h1>
				All info saved (reload page){" "}
				<button onSubmit="(async () => {const sdk = await new AppExtensionsSDK().initialize();await sdk.execute(Command.CLOSE_MODAL);})();">
					refresh or smth
				</button>
			</h1>
		);

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			<fieldset className={styles.group}>
				<legend>Client details</legend>
				<div className={styles.two}>
					<input {...register("firstName")} placeholder="First name" />
					<input {...register("lastName")} placeholder="Last name" />
				</div>
				<input {...register("phone")} placeholder="Phone" type="tel" />
				<input {...register("email")} placeholder="Email" type="email" />
			</fieldset>
			<fieldset className={styles.group}>
				<legend>Job details</legend>
				<div className={styles.two}>
					<select {...register("jobType")}>
						<option value="Job type">Job type</option>
					</select>
					<select {...register("jobSource")}>
						<option value="Job source">Job source</option>
					</select>
				</div>
				<textarea
					{...register("jobDescription")}
					placeholder="Job description"
					rows="3"
				/>
			</fieldset>
			<fieldset className={styles.group}>
				<legend>Service location</legend>
				<input {...register("address")} placeholder="Address" />
				<input {...register("city")} placeholder="City" />
				<input {...register("state")} placeholder="State" />
				<div className={styles.two}>
					<input
						{...register("zipCode")}
						placeholder="Zip code"
						type="number"
					/>
					<select {...register("area")}>
						<option value="area">Area</option>
					</select>
				</div>
			</fieldset>
			<fieldset className={styles.group}>
				<legend>Scheduled</legend>
				<label>
					Start date <input {...register("startDate")} type="date" />
				</label>
				<div className={styles.two}>
					<label>
						Start time <input {...register("startTime")} type="time" />
					</label>
					<label>
						End time <input {...register("endTime")} type="time" />
					</label>
				</div>
				<select {...register("testSelect")}>
					<option value="testSelect">Test select</option>
				</select>
			</fieldset>
			<button type="submit" disabled={formState.isSubmitting}>
				Save job
			</button>
		</form>
	);
}

export default App;
