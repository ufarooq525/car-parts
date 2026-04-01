<?php

return [
    // Supplier messages
    'suppliers_listed'       => 'Suppliers retrieved successfully.',
    'supplier_found'         => 'Supplier retrieved successfully.',
    'supplier_not_found'     => 'Supplier not found.',
    'supplier_created'       => 'Supplier created successfully.',
    'supplier_updated'       => 'Supplier updated successfully.',
    'supplier_deleted'       => 'Supplier deleted successfully.',
    'supplier_has_products'  => 'Cannot delete supplier because it has linked products.',
    'sync_triggered'         => 'Supplier sync triggered successfully.',

    // Margin rule messages
    'margin_rules_listed'    => 'Margin rules retrieved successfully.',
    'margin_rule_created'    => 'Margin rule created successfully.',
    'margin_rule_updated'    => 'Margin rule updated successfully.',
    'margin_rule_deleted'    => 'Margin rule deleted successfully.',

    // Validation messages
    'validation_name_required'          => 'The supplier name is required.',
    'validation_name_max'               => 'The supplier name must not exceed 255 characters.',
    'validation_code_required'          => 'The supplier code is required.',
    'validation_code_unique'            => 'The supplier code has already been taken.',
    'validation_type_required'          => 'The supplier type is required.',
    'validation_type_in'                => 'The supplier type must be one of: api, xml, csv.',
    'validation_api_endpoint_url'       => 'The API endpoint must be a valid URL.',
    'validation_feed_url_url'           => 'The feed URL must be a valid URL.',
    'validation_sync_interval_min'      => 'The sync interval must be at least 15 minutes.',
    'validation_supplier_id_exists'     => 'The selected supplier does not exist.',
    'validation_category_id_exists'     => 'The selected category does not exist.',
    'validation_margin_type_required'   => 'The margin type is required.',
    'validation_margin_type_in'         => 'The margin type must be either percentage or fixed.',
    'validation_margin_value_required'  => 'The margin value is required.',
    'validation_margin_value_min'       => 'The margin value must be at least 0.',
];
