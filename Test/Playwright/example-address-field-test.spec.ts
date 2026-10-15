import {Field} from '@loki-checkout/checkout-objects';
import {setupCheckout} from '@loki/setup-checkout';
import {test, expect} from '@loki/test';
import moduleConfig, {FIELD_ID, FIELD_LABEL, PREVIEW_ID, themes, withTheme} from './config/config';

test.describe('Example address field test', () => {
    for (const theme of themes) {
        test.describe(theme.name, () => {
            test.beforeEach(async ({page, context}) => {
                await setupCheckout(page, context, withTheme(moduleConfig, theme));
            });

            test('should render the field in the customer section', async ({page}) => {
                const field = new Field(page, FIELD_ID);

                await expect(field.getLocator()).toBeVisible();
                await expect(field.getLocator()).toHaveValue('');
                await expect(field.getLocator()).toHaveAttribute('maxlength', '255');
                await expect(field.getLabelLocator()).toContainText(FIELD_LABEL);
                await expect(page.getById(PREVIEW_ID)).not.toContainText(FIELD_LABEL);
            });

            test('should show the saved value in the sidebar', async ({page}) => {
                const field = new Field(page, FIELD_ID);
                await field.fill('Example value');
                await field.expectValue('Example value');

                const preview = page.getById(PREVIEW_ID);
                await expect(preview).toContainText(FIELD_LABEL);
                await expect(preview).toContainText('Example value');
            });

            test('should hide the sidebar value after clearing the field', async ({page}) => {
                const field = new Field(page, FIELD_ID);
                await field.fill('Example value');

                const preview = page.getById(PREVIEW_ID);
                await expect(preview).toContainText('Example value');

                await field.fill('');

                await expect(preview).not.toContainText(FIELD_LABEL);
                await expect(preview).not.toContainText('Example value');
            });

            test('should keep the value after reloading the checkout', async ({page}) => {
                const field = new Field(page, FIELD_ID);
                await field.fill('Persistent value');

                await page.reload();
                await expect(page).toHaveTitle(/Checkout/);

                await field.expectValue('Persistent value');
                await expect(page.getById(PREVIEW_ID)).toContainText('Persistent value');
            });

            test('should not render HTML from the value in the sidebar', async ({page}) => {
                const field = new Field(page, FIELD_ID);
                await field.fill('<b>bold</b>');

                const preview = page.getById(PREVIEW_ID);
                await expect(preview).toContainText('bold');
                await expect(preview.locator('b')).toHaveCount(0);
            });
        });
    }
});
