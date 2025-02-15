import { varcategories } from '$src/lib/utils/varHelpers';
import { SvelteMap } from 'svelte/reactivity';


export type VariableName = string;
export type VariablesMetadata = Record<VariableName, {[key: string]: any}>;

// not reactive - instead set by load() in layout.ts to be globally available
// its loaded in during static site build
export const variablesMetadata: VariablesMetadata = {};

export const variablesBriefMarkdown = new SvelteMap<string, string>();

export function isCategoricalVar(varname: VariableName): boolean {
  return !!varcategories(varname)
}


export const variableBriefs: Record<VariableName, string> = {};
// from variables.yaml example
/*
do:
	label: Dissoved Oxygen
	units: mg/L
	gradient:
		colors:
			- "#FF0000"
			- "#00FF00"
		stops:
			- 0
			- 1
invertNarrative:
  label: Invertebrate Health
  units: ""
  categories:
    Poor:
      label: Poor
      color: "#FF0000"
    Low_Fair:
      label: Low Fair
    Fair:
      label: Fair
    Acceptable:
      label: Acceptable
    Marg_Good:
      label: Marginally Good
    Good:
      label: Good
    Very_Good:
      label: Very Good
    Excellent:
      label: Excellent
    Exceptional:
      label: Exceptional
      color: "#00FF00"
    default:
      label: Unknown
      color: "#777777"
*/