import {Field, PaymentMethod, PlaceOrderButton, ShippingMethod, SuccessPage} from '@loki-checkout/checkout-objects';
import {setupCheckout} from '@loki/setup-checkout';
import {test, expect} from '@loki/test';
import merge from '@loki/util/merge';
import type {Page} from '@playwright/test';
import moduleConfig, {FIELD_ID, FIELD_LABEL, themes, withTheme} from './config/config';

const adminConfig = merge(moduleConfig, {
    config: {
        'admin/security/use_form_key': 0,
    }
});

const addressFields = {
    'customer.email': 'quote-address-extended@example.com',
    'shipping.firstname': 'Jane',
    'shipping.lastname': 'Doe',
    'shipping.street0': 'Amalialaan',
    'shipping.street1': '126',
    'shipping.postcode': '1234 AB',
    'shipping.city': 'Baarn',
    'shipping.telephone': '0123456789',
};

const getAdminCredentials = () => ({
    username: process.env.MAGENTO_ADMIN_USER || process.env.ADMIN_USER || 'admin@loki-checkout.com',
    password: process.env.MAGENTO_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'P@ssw0rd1234',
});

async function placeOrder(page: Page, value: string): Promise<string> {
    for (const [fieldName, fieldValue] of Object.entries(addressFields)) {
        await new Field(page, fieldName).fill(fieldValue);
    }

    await new Field(page, FIELD_ID).fill(value);
    await new ShippingMethod(page, 'flatrate_flatrate').select();
    await new PaymentMethod(page, 'checkmo').select();
    await new PlaceOrderButton(page).click();

    const successPage = new SuccessPage(page);
    await successPage.expectToBeLoaded();

    const bodyText = await page.locator('body').innerText();
    const match = bodyText.match(/\b(\d{9,})\b/);
    expect(match, 'Order number on success page').not.toBeNull();

    return match[1];
}

async function loginAdmin(page: Page) {
    const {username, password} = getAdminCredentials();

    await page.goto('/admin');
    await page.locator('#username').fill(username);
    await page.locator('#login').fill(password);
    await page.locator('.action-login').click();
    await page.waitForLoadState('domcontentloaded');

    test.skip(/\/tfa\//.test(page.url()), 'Two-factor authentication is enabled for the Magento Admin');
    await expect(page.locator('.page-title')).toBeVisible();
}

async function getOrderId(page: Page, incrementId: string): Promise<number> {
    const tokenResponse = await page.request.post('/rest/V1/integration/admin/token', {
        data: getAdminCredentials(),
    });
    expect(tokenResponse.ok(), 'Admin token: ' + await tokenResponse.text()).toBeTruthy();
    const token = await tokenResponse.json();

    const ordersResponse = await page.request.get('/rest/V1/orders', {
        headers: {Authorization: 'Bearer ' + token},
        params: {
            'searchCriteria[filterGroups][0][filters][0][field]': 'increment_id',
            'searchCriteria[filterGroups][0][filters][0][value]': incrementId,
        },
    });
    expect(ordersResponse.ok(), 'Orders: ' + await ordersResponse.text()).toBeTruthy();

    const orders = await ordersResponse.json();
    expect(orders.items).toHaveLength(1);

    return orders.items[0].entity_id;
}

async function openAdminOrder(page: Page, incrementId: string) {
    const orderId = await getOrderId(page, incrementId);

    await page.goto('/admin/sales/order/view/order_id/' + orderId + '/');
    await expect(page.locator('.page-title')).toContainText(incrementId);
}

test.describe('Example address field in admin order view', () => {
    for (const theme of themes) {
        test(`should show the value on the admin order view (${theme.name})`, async ({page, context}) => {
            test.setTimeout(120000);

            await setupCheckout(page, context, withTheme(adminConfig, theme));

            const value = 'Admin value ' + theme.name;
            const incrementId = await placeOrder(page, value);

            page.setCatchErrors(false);
            await loginAdmin(page);
            await openAdminOrder(page, incrementId);

            const row = page.locator('tr', {has: page.locator('th', {hasText: FIELD_LABEL})});
            await expect(row).toHaveCount(1);
            await expect(row.locator('td')).toHaveText(value);
        });
    }
});
