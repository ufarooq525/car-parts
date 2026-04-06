<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Update role enum to include 'supplier'
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','staff','customer','supplier') DEFAULT 'customer'");

        // Add supplier_id foreign key to users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('supplier_id')->nullable()->after('is_active')
                ->constrained('suppliers')->nullOnDelete();
        });

        // Add approval workflow fields to suppliers
        Schema::table('suppliers', function (Blueprint $table) {
            $table->enum('approval_status', ['pending', 'under_review', 'approved', 'rejected'])
                ->default('pending')->after('is_active');
            $table->text('rejection_reason')->nullable()->after('approval_status');
            $table->timestamp('approved_at')->nullable()->after('rejection_reason');
            $table->foreignId('approved_by')->nullable()->after('approved_at')
                ->constrained('users')->nullOnDelete();

            // Supplier registration info
            $table->string('contact_person')->nullable()->after('name');
            $table->string('email')->nullable()->after('contact_person');
            $table->string('phone')->nullable()->after('email');
            $table->string('website')->nullable()->after('phone');
            $table->string('business_license')->nullable()->after('website');
            $table->string('tax_id')->nullable()->after('business_license');
            $table->text('address')->nullable()->after('tax_id');
            $table->text('description')->nullable()->after('address');

            // Index for approval queue
            $table->index('approval_status');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropIndex(['approval_status']);
            $table->dropColumn([
                'approval_status', 'rejection_reason', 'approved_at', 'approved_by',
                'contact_person', 'email', 'phone', 'website',
                'business_license', 'tax_id', 'address', 'description',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']);
            $table->dropColumn('supplier_id');
        });

        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin','staff','customer') DEFAULT 'customer'");
    }
};
