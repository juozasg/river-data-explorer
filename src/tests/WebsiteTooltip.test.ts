import './matchMedia.mock';

import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom'

// import HelloWorld from '../src/HelloWorld.svelte'
import WebsiteTooltip from '../components/tooltips/WebsiteTooltip.svelte';


test('should render', () => {1
	const results = render(WebsiteTooltip, { props: {  } });
	// console.log('render results', results);
	// console.log('-----');
	// console.log('screen.queryByText', screen.queryByText('Increment'));
	// const e = screen.queryByText('Increment');

	// expect(() => results.getByLabelText('a button')).not.toThrow();
	// expect(screen.queryByText('T to hide')).toBeInTheDocument(); // this works
});



// test('renders name', async () => {
//   // const { getByText, getByRole } = render(HelloWorld as any, { name: 'Vitest' })

//   // const element = getByText('Hello Vitest x1!')
//   // await expect.element(element).toBeInTheDocument()

//   // await getByRole('button', { name: 'Increment '}).click()

//   // await expect.element(getByText('Hello Vitest x2!')).toBeInTheDocument()
// })
