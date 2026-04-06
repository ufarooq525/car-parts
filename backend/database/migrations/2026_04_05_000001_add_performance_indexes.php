<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Adds performance indexes for columns frequently used in WHERE clauses,
     * ORDER BY, and JOIN operations. Foreign key columns are excluded as they
     * already have indexes created by their foreign key constraints.
     */
    public function up(): void
    {
        // orders: status and created_at are used for filtering/sorting
        // user_id already indexed via foreign key
        Schema::table('orders', function (Blueprint $table) {
            $table->index('status');
            $table->index('created_at');
        });

        // categories: is_active and is_visible used for filtering visible categories
        // parent_id already indexed via foreign key
        Schema::table('categories', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('is_visible');
        });

        // vehicles: make and model used for search/filtering
        Schema::table('vehicles', function (Blueprint $table) {
            $table->index('make');
            $table->index('model');
            $table->index(['make', 'model'], 'vehicles_make_model_index');
        });

        // suppliers: is_active used to filter active suppliers
        Schema::table('suppliers', function (Blueprint $table) {
            $table->index('is_active');
        });

        // margin_rules: is_active and priority used for filtering and ordering
        // supplier_id and category_id already indexed via foreign keys
        Schema::table('margin_rules', function (Blueprint $table) {
            $table->index('is_active');
            $table->index('priority');
        });

        // products: compound index for common catalog query pattern
        // Individual indexes on category_id and is_visible already exist
        Schema::table('products', function (Blueprint $table) {
            $table->index(['category_id', 'is_visible', 'is_active'], 'products_category_visible_active_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['is_visible']);
        });

        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex(['make']);
            $table->dropIndex(['model']);
            $table->dropIndex('vehicles_make_model_index');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
        });

        Schema::table('margin_rules', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['priority']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex('products_category_visible_active_index');
        });
    }
};
