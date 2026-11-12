# Loki_QuoteAddressExtendedExample

<!-- badges.specs.start -->
![Magento version](https://img.shields.io/badge/Magento-2.4.6%20%7C%202.4.9-orange)
![PHP version](https://img.shields.io/badge/PHP-8.2%E2%80%938.5-777BB4)
![License](https://img.shields.io/badge/License-OSL--3.0-blue)
![Latest Version](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/-/badges/release.svg)
<!-- badges.specs.end -->


## Installation
Install this package via composer:
```bash
composer require loki-checkout/magento2-quote-address-extended-example
```

Next, enable this module:
```bash
bin/magento module:enable Loki_QuoteAddressExtendedExample
```


## Usage
Example module for `Loki_QuoteAddressExtended`. It adds a column `example_address_field` to the tables `loki_quote_address_extended` and `loki_customer_address_extended` and shows it:

- as an optional field in the Loki Checkout, below the customer gender; the value is stored with the shipping address (or the billing address for virtual quotes), using the block argument `address_type` set to `auto`;
- in the checkout sidebar (when filled in);
- in the order, invoice, shipment and credit memo emails (this module overrides the 8 core templates `sales_email_order_template`, `sales_email_order_guest_template`, `sales_email_invoice_template`, `sales_email_invoice_guest_template`, `sales_email_shipment_template`, `sales_email_shipment_guest_template`, `sales_email_creditmemo_template` and `sales_email_creditmemo_guest_template`; these are copies of the Magento 2.4.9 templates, so they need to be kept in sync on upgrades and they replace any theme overrides of these templates);
- on the admin order, invoice, shipment and credit memo pages;
- as an editable field on the admin order address edit page (declared in `etc/di.xml` via `Loki\QuoteAddressExtended\Config\AdminFields`).

Because the column also exists in `loki_customer_address_extended`, its value is copied between the customer address book and the checkout.

Note that `Loki_QuoteExtendedExample` overrides the same order and invoice email templates. When both example modules are enabled, only one of the overrides is used.


## Current status

<!-- badges.test.start -->
[![Static Tests](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/badges/main/pipeline.svg?job=static-tests)](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/-/pipelines)
[![Unit Tests](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/badges/main/pipeline.svg?job=unit-tests)](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/-/pipelines)
[![Integration Tests](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/badges/main/pipeline.svg?job=integration-tests)](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/-/pipelines)
[![Playwright](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/badges/main/pipeline.svg?job=playwright)](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/-/pipelines)
[![DI Compilation](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/badges/main/pipeline.svg?job=compile)](https://gitlab.yireo.com/loki-checkout/Loki_QuoteAddressExtendedExample/-/pipelines)
<!-- badges.test.end -->
