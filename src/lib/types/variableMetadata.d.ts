export type VariableName = string;
export type VariableMetadata = Record<VariableName, {[key: string]: any}>;


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