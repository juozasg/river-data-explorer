import { roundTickValue } from "./chart";
import { varCategoryKeys, varCatIndexLegend, varMax, varRange, varunits } from "./varHelpers";

export const legendFmtVarnameVal = (varname: string, v: number) =>
	varCategoryKeys(varname)
		? varCatIndexLegend(varname, Math.round(v))
		: roundTickValue(v, varRange(varname), false);


export const maxLegendTextWidth = (varname: string) => {
	if (varCategoryKeys(varname)) {
		const labels = varCategoryKeys(varname)?.map((v, i) => varCatIndexLegend(varname, i));
		if (!labels || labels.length === 0) return 30;
		const longestLabel = labels.reduce((a, b) => (a.length > b.length ? a : b));
		// console.log('longestLabel', longestLabel, longestLabel.length);
		return (longestLabel.length + 3) * 12;
	}
	const maxValueNumChars = varMax(varname).toString().length;
	const unitNumChars = varunits(varname).length;
	return (maxValueNumChars + unitNumChars + 3) * 8;
};