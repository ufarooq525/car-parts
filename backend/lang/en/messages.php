<?php

return [
    // Generic
    'success'              => 'Operation completed successfully.',
    'error_occurred'       => 'An error occurred.',
    'resource_created'     => 'Resource created successfully.',
    'resource_updated'     => 'Resource updated successfully.',
    'resource_deleted'     => 'Resource deleted successfully.',
    'resource_not_found'   => 'Resource not found.',
    'validation_failed'    => 'The given data was invalid.',
    'unauthorized'         => 'Unauthorized.',
    'unauthenticated'      => 'You are not authenticated.',
    'forbidden'            => 'You do not have permission to perform this action.',
    'server_error'         => 'Internal server error. Please try again later.',
    'route_not_found'      => 'The requested URL was not found.',
    'method_not_allowed'   => 'The HTTP method is not allowed for this route.',
    'model_not_found'      => 'The requested record was not found.',
    'business_error'       => 'A business logic error occurred.',
    'too_many_requests'    => 'Too many requests. Please try again later.',

    // Auth
    'login_success'        => 'Logged in successfully.',
    'login_failed'         => 'Invalid credentials.',
    'logout_success'       => 'Logged out successfully.',
    'register_success'     => 'Account created successfully.',
    'password_reset_sent'  => 'Password reset link has been sent to your email.',
    'password_reset_success' => 'Password has been reset successfully.',
    'email_verified'       => 'Email verified successfully.',
    'token_refreshed'      => 'Token refreshed successfully.',

    // Products
    'product_created'      => 'Product created successfully.',
    'product_updated'      => 'Product updated successfully.',
    'product_deleted'      => 'Product deleted successfully.',
    'product_not_found'    => 'Product not found.',
    'product_out_of_stock' => 'Product is out of stock.',
    'product_hidden'       => 'Product has been hidden.',
    'product_visible'      => 'Product is now visible.',

    // Categories
    'category_created'     => 'Category created successfully.',
    'category_updated'     => 'Category updated successfully.',
    'category_deleted'     => 'Category deleted successfully.',
    'category_not_found'   => 'Category not found.',
    'category_has_children' => 'Cannot delete a category that has subcategories.',
    'category_has_products' => 'Cannot delete a category that has products.',

    // Suppliers
    'supplier_created'     => 'Supplier created successfully.',
    'supplier_updated'     => 'Supplier updated successfully.',
    'supplier_deleted'     => 'Supplier deleted successfully.',
    'supplier_not_found'   => 'Supplier not found.',
    'supplier_sync_started' => 'Supplier synchronization has started.',
    'supplier_sync_completed' => 'Supplier synchronization completed successfully.',
    'supplier_sync_failed' => 'Supplier synchronization failed.',

    // Orders
    'order_created'        => 'Order placed successfully.',
    'order_updated'        => 'Order updated successfully.',
    'order_cancelled'      => 'Order cancelled successfully.',
    'order_not_found'      => 'Order not found.',
    'order_status_updated' => 'Order status updated successfully.',
    'order_cannot_cancel'  => 'This order cannot be cancelled.',

    // Vehicles
    'vehicle_created'      => 'Vehicle created successfully.',
    'vehicle_updated'      => 'Vehicle updated successfully.',
    'vehicle_deleted'      => 'Vehicle deleted successfully.',
    'vehicle_not_found'    => 'Vehicle not found.',

    // Cart
    'cart_item_added'      => 'Item added to cart.',
    'cart_item_updated'    => 'Cart item updated.',
    'cart_item_removed'    => 'Item removed from cart.',
    'cart_cleared'         => 'Cart cleared.',
    'cart_empty'           => 'Your cart is empty.',

    // Margin Rules
    'margin_rule_created'  => 'Margin rule created successfully.',
    'margin_rule_updated'  => 'Margin rule updated successfully.',
    'margin_rule_deleted'  => 'Margin rule deleted successfully.',

    // Stock
    'stock_updated'        => 'Stock updated successfully.',
    'low_stock_alert'      => 'Low stock alert for :product.',

    // Sync
    'sync_in_progress'     => 'Synchronization is already in progress.',
    'sync_queued'          => 'Synchronization has been queued.',
];
