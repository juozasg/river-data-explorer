import { roundTickValue } from "./chart";
import { varcategories, varcatilegend, varmax, varrange, varunits } from "./varHelpers";

export const legendFmtVarname = (varname: string, v: number) =>
	varcategories(varname)
		? varcatilegend(varname, Math.round(v))
		: roundTickValue(v, varrange(varname), false);


export const maxLegendTextWidth = (varname: string) => {
	if (varcategories(varname)) {
		const labels = varcategories(varname)?.map((v, i) => varcatilegend(varname, i));
		if (!labels || labels.length === 0) return 30;
		const longestLabel = labels.reduce((a, b) => (a.length > b.length ? a : b));
		// console.log('longestLabel', longestLabel, longestLabel.length);
		return (longestLabel.length + 3) * 12;
	}
	const maxValueNumChars = varmax(varname).toString().length;
	const unitNumChars = varunits(varname).length;
	return (maxValueNumChars + unitNumChars + 3) * 8;
};