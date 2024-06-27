import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

const Group = styled(Paper)(({ theme }) => ({
	height: "100%",
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(3),
	color: theme.palette.text.primary,
}));

export default Group;
