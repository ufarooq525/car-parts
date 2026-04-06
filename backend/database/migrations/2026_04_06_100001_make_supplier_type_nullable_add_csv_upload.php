<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Change enum type to allow null + add 'none' option for suppliers who skip feed setup
        DB::statement("ALTER TABLE suppliers MODIFY COLUMN type ENUM('api','xml','csv','none') DEFAULT 'none'");

        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('csv_file_path')->nullable()->after('feed_url');
            $table->string('csv_original_name')->nullable()->after('csv_file_path');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['csv_file_path', 'csv_original_name']);
        });

        DB::statement("ALTER TABLE suppliers MODIFY COLUMN type ENUM('api','xml','csv') NOT NULL");
    }
};
