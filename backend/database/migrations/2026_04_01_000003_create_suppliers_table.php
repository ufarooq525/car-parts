<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('type', ['api', 'xml', 'csv']);
            $table->string('api_url')->nullable();
            $table->string('api_key')->nullable();
            $table->string('feed_url')->nullable();
            $table->json('config')->nullable();
            $table->enum('default_margin_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('default_margin_value', 8, 2)->default(0);
            $table->integer('sync_interval_minutes')->default(60);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
