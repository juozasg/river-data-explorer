export const vv = 14;

let count = $state(0);

export const counter = {
  get count() { return count },
  increment: () => count += 1
}


console.log(vv);