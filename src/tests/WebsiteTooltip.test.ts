import { describe, expect, test } from 'vitest'
import { act, getByTestId, getByText, render, screen } from '@testing-library/svelte';
import '@testing-library/jest-dom'

// import HelloWorld from '../src/HelloWorld.svelte'
import WebsiteTooltip from '../components/tooltips/WebsiteTooltip.svelte';
import { createRawSnippet } from 'svelte';
import { toggleHideTooltipsKeydown, tooltip } from '$src/appstate/ui/tooltips.svelte';

const testSnippet = createRawSnippet(() => {
	return {
		render: () => `<p>tooltiptest</p>`,
	};
});


test('should render', async () => {
	const component = render(WebsiteTooltip, { props: {} });

	const websiteTooltip = component.component;
	tooltip.component = websiteTooltip; // setup tooltip global state

	const tooltipDiv = component.baseElement.querySelector('.hover-tooltip')!;
	expect(tooltipDiv).not.toBeNull();

	websiteTooltip.setContentSnippet(testSnippet);
	websiteTooltip.show(0, 0, true);

	await act();

	// visible
	expect(tooltipDiv.getAttribute('style')).toContain('display: block');
	// has text
	expect(component.baseElement.textContent).toContain('tooltiptest');
	// can be hidden
	expect(component.baseElement.textContent).toContain('T to hide');

	// hide with keyboard event
	toggleHideTooltipsKeydown(new KeyboardEvent('keydowm', { key: 't' }));
	await act();

	// now invisible
	expect(tooltipDiv.getAttribute('style')).toContain('display: none');
});



// const r = getByText(component.container, 'T to hide')

// component.
// expect(screen.queryByText('T to hide')).toBeInTheDocument();
// expect(() => results.getByLabelText('a button')).not.toThrow();
// const e = screen.queryByText('Increment');
// console.log('screen.queryByText', screen.queryByText('Increment'));

// test('renders name', async () => {
//   // const { getByText, getByRole } = render(HelloWorld as any, { name: 'Vitest' })

//   // const element = getByText('Hello Vitest x1!')
//   // await expect.element(element).toBeInTheDocument()

//   // await getByRole('button', { name: 'Increment '}).click()

//   // await expect.element(getByText('Hello Vitest x2!')).toBeInTheDocument()
// })
