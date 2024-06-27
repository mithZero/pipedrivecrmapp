import { useEffect, useState } from "react";
import AppExtensionsSDK, { Command } from "@pipedrive/app-extensions-sdk";
import { useForm, Controller } from "react-hook-form";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LoadingButton } from "@mui/lab";
import {
	Grid,
	Container,
	CssBaseline,
	Stack,
	TextField,
	Paper,
	FormControl,
	Select,
	InputLabel,
	MenuItem,
	Typography,
	Box,
} from "@mui/material";

const Group = styled(Paper)(({ theme }) => ({
	height: "100%",
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(3),
	color: theme.palette.text.primary,
}));

function App() {
	useEffect(() => {
		(async () => {
			const sdk = new AppExtensionsSDK();
			await sdk.initialize({ size: { height: 600, width: 800 } });
		})();
	}, []);

	const {
		register,
		handleSubmit,
		control,
		formState: { isSubmitting, errors },
	} = useForm({
		defaultValues: {
			jobType: "",
			jobSource: "",
			area: "",
			testSelect: "",
			startDate: null,
			startTime: null,
			endTime: null,
		},
	});

	const [isSaved, setIsSaved] = useState(false);

	const onSubmit = (values) => {
		(async () => {
			let res;
			try {
				res = await fetch(
					"https://pipedrivecrmapp-production.up.railway.app/save",
					{
						method: "post",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify(values),
					}
				);
				res = await res.json();
			} catch (error) {
				console.error(error);
			}

			if (res.success) setIsSaved(true);
		})();
	};

	const [isLoading, setIsLoading] = useState(false);
	if (isSaved)
		return (
			<Box textAlign={"center"} padding={3}>
				<Typography variant="h4">All data is saved</Typography>
				<LoadingButton
					sx={{ mt: 2 }}
					variant="contained"
					loading={isLoading}
					onClick={async () => {
						setIsLoading(true);
						const sdk = await new AppExtensionsSDK().initialize();
						await sdk.execute(Command.CLOSE_MODAL);
					}}
				>
					Close
				</LoadingButton>
			</Box>
		);

	return (
		<>
			<CssBaseline />
			<Container maxWidth="md" sx={{ padding: 3 }}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid
						container
						spacing={2}
						direction="row"
						justifyContent="center"
						alignItems="stretch"
					>
						<Grid item xs={12} md={6} sm={6}>
							<Group>
								<Stack spacing={2}>
									<Typography variant="h5">Client Details</Typography>
									<Stack direction="row" spacing={2}>
										<TextField
											fullWidth
											error={!!errors.firstName}
											size="small"
											id="firstName"
											label={errors.firstName ? "Required" : "First name"}
											{...register("firstName", { required: true })}
										/>
										<TextField
											fullWidth
											size="small"
											id="lastName"
											label="Last name"
											{...register("lastName")}
										/>
									</Stack>
									<TextField
										type="tel"
										size="small"
										id="phone"
										label="Phone"
										{...register("phone")}
									/>
									<TextField
										size="small"
										{...register("email")}
										label="Email (optional)"
										type="email"
									/>
								</Stack>
							</Group>
						</Grid>
						<Grid item xs={12} md={6} sm={6}>
							<Group>
								<Stack spacing={2}>
									<Typography variant="h5">Job Details</Typography>
									<Stack direction="row" spacing={2} alignItems={"flex-start"}>
										<FormControl fullWidth size="small">
											<InputLabel id="jobTypeLabel">Job type</InputLabel>
											<Controller
												name="jobType"
												control={control}
												render={({ field: { onChange, value } }) => (
													<Select
														labelId="jobTypeLabel"
														id="jobType"
														label="Job type"
														onChange={onChange}
														value={value}
													>
														<MenuItem value="option1">Option 1</MenuItem>
														<MenuItem value="option2">Option 2</MenuItem>
														<MenuItem value="option3">Option 3</MenuItem>
													</Select>
												)}
											/>
										</FormControl>
										<FormControl fullWidth size="small">
											<InputLabel id="jobSourceLabel">Job source</InputLabel>
											<Controller
												name="jobSource"
												control={control}
												render={({ field: { onChange, value } }) => (
													<Select
														labelId="jobSourceLabel"
														id="jobSource"
														label="Job source"
														onChange={onChange}
														value={value}
													>
														<MenuItem value="option1">Option 1</MenuItem>
														<MenuItem value="option2">Option 2</MenuItem>
														<MenuItem value="option3">Option 3</MenuItem>
													</Select>
												)}
											/>
										</FormControl>
									</Stack>
									<TextField
										size="small"
										id="jobDescription"
										label="Job description"
										multiline
										rows={4}
									/>
								</Stack>
							</Group>
						</Grid>
						<Grid item xs={12} md={6} sm={6}>
							<Group>
								<Stack spacing={2}>
									<Typography variant="h5">Service location</Typography>
									<TextField
										size="small"
										id="location"
										label="Location"
										{...register("location")}
									/>
									<TextField
										size="small"
										id="city"
										label="City"
										{...register("city")}
									/>
									<TextField
										size="small"
										id="state"
										label="State"
										{...register("state")}
									/>
									<Stack spacing={2} direction="row">
										<TextField
											size="small"
											fullWidth
											id="zipcode"
											label="Zip code"
											{...register("zipcode")}
										/>
										<FormControl fullWidth size="small">
											<InputLabel id="areaLabel">Area</InputLabel>
											<Controller
												name="area"
												control={control}
												render={({ field: { onChange, value } }) => (
													<Select
														id="area"
														labelId="areaLabel"
														label="Area"
														onChange={onChange}
														value={value}
													>
														<MenuItem value="option1">Option 1</MenuItem>
														<MenuItem value="option2">Option 2</MenuItem>
														<MenuItem value="option3">Option 3</MenuItem>
													</Select>
												)}
											/>
										</FormControl>
									</Stack>
								</Stack>
							</Group>
						</Grid>
						<Grid item xs={12} md={6} sm={6}>
							<Group>
								<Stack spacing={2}>
									<Typography variant="h5">Scheduled</Typography>
									<Controller
										name="startDate"
										control={control}
										render={({ field: { onChange, value } }) => (
											<DatePicker
												onChange={onChange}
												value={value}
												label="Start date"
												slotProps={{ textField: { size: "small" } }}
											/>
										)}
									/>
									<Stack spacing={2} direction="row">
										<Controller
											name="startTime"
											control={control}
											render={({ field: { onChange, value } }) => (
												<TimePicker
													onChange={onChange}
													value={value}
													label="Start time"
													slotProps={{ textField: { size: "small" } }}
												/>
											)}
										/>
										<Controller
											name="endTime"
											control={control}
											render={({ field: { onChange, value } }) => (
												<TimePicker
													label="End time"
													onChange={onChange}
													value={value}
													slotProps={{ textField: { size: "small" } }}
												/>
											)}
										/>
									</Stack>
									<FormControl size="small">
										<InputLabel id="testSelectLabel">Test Select</InputLabel>
										<Controller
											name="testSelect"
											control={control}
											render={({ field: { onChange, value } }) => (
												<Select
													id="testSelect"
													labelId="testSelectLabel"
													label="Test Select"
													onChange={onChange}
													value={value}
												>
													<MenuItem value="option1">Option 1</MenuItem>
													<MenuItem value="option2">Option 2</MenuItem>
													<MenuItem value="option3">Option 3</MenuItem>
												</Select>
											)}
										/>
									</FormControl>
								</Stack>
							</Group>
						</Grid>
						<Grid item xs={12} textAlign="end">
							<LoadingButton
								loading={isSubmitting}
								type="submit"
								variant="contained"
							>
								Save
							</LoadingButton>
						</Grid>
					</Grid>
				</form>
			</Container>
		</>
	);
}

export default App;
