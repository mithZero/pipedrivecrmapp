import { useEffect } from "react";
import styles from "./App.module.css";
import AppExtensionsSDK from "@pipedrive/app-extensions-sdk";
import { useForm } from "react-hook-form"

function App() {
	useEffect(() => {
		(async () => {
			const sdk = new AppExtensionsSDK();

			await sdk.initialize({ height: 300, width: 400 });
		})();
	}, []);

  const { register, handleSubmit } = useForm()
  const onSubmit = (data) => alert(JSON.stringify(data))

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <fieldset className={styles.group}>
        <legend>Client details</legend>
        <input {...register("firstName")} placeholder="First name" />
        <input {...register("lastName")} placeholder="Last name" />
        <input {...register("phone")} placeholder="Phone" type="tel"/>
        <input {...register("email")} placeholder="Email" type="email"/>
      </fieldset>
      <fieldset className={styles.group}>
        <legend>Job details</legend>
        <select {...register("jobType")}>
          <option value="Area">Job type</option>
        </select>
        <select {...register("jobSource")}>
          <option value="Job source">Job source</option>
        </select>
        <textarea {...register("jobDescription")} placeholder="Job description"   />
      </fieldset>
      <fieldset className={styles.group}>
        <legend>Service location</legend>
        <input {...register("address")} placeholder="Address" />
        <input {...register("city")} placeholder="City" />
        <input {...register("state")} placeholder="State" />
        <input {...register("zipCode")} placeholder="Zip code" type="number"/>
        <select {...register("area")}>
          <option value="area">Area</option>
        </select>
      </fieldset>
      <fieldset className={styles.group}>
        <legend>Scheduled</legend>
        <input {...register("startDate")} placeholder="Start date" type="date" />
        <input {...register("startTime")} placeholder="Start time" type="time"/>
        <input {...register("endTime")} placeholder="End time" type="time"/>
        <select {...register("testSelect")} >
          <option value="testSelect">Test select</option>
        </select>
      </fieldset>
      <button type="submit">Save job</button>
    </form>
	);
}

export default App;
