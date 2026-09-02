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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('asset_code')->unique();
            $table->string('crm_reference_type')->nullable();
            $table->string('crm_reference_id')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['pop', 'client', 'fibre', 'radio', 'other']);
            $table->foreignId('stock_item_id')->nullable()->constrained('stock_items')->nullOnDelete();
            $table->string('serial_no')->nullable();
            $table->enum('status', ['in_stock', 'assigned', 'installed', 'maintenance', 'retired'])->default('in_stock');
            $table->foreignId('current_store_id')->nullable()->constrained('stores')->nullOnDelete();
            $table->string('current_location_type')->nullable();
            $table->unsignedBigInteger('current_location_id')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('assigned_at')->nullable();
            $table->timestamp('installed_at')->nullable();
            $table->timestamp('last_maintenance_at')->nullable();
            $table->timestamp('next_maintenance_due')->nullable();
            $table->decimal('purchase_cost', 15, 2)->default(0);
            $table->date('purchase_date')->nullable();
            $table->decimal('current_value', 15, 2)->default(0);
            $table->decimal('salvage_value', 15, 2)->default(0);
            $table->integer('useful_life_months')->default(36);
            $table->enum('depreciation_method', ['straight_line', 'declining_balance', 'sum_of_years'])->default('straight_line');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'status']);
            $table->index(['stock_item_id', 'serial_no']);
            $table->index(['current_store_id', 'status']);
            $table->index('asset_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
