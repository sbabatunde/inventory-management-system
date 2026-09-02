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
        Schema::create('stock_serials', function (Blueprint $table) {
              $table->id();
            $table->foreignId('stock_item_id')->constrained()->onDelete('cascade');
            $table->string('serial_no');
            $table->enum('current_status', ['in_stock', 'issued', 'in_transit', 'maintenance', 'retired'])->default('in_stock');
            $table->foreignId('current_store_id')->nullable()->constrained('stores')->nullOnDelete();
            $table->string('current_location_type')->nullable();
            $table->unsignedBigInteger('current_location_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['stock_item_id', 'serial_no']);
            $table->index(['serial_no', 'current_status']);
            $table->index(['current_store_id', 'current_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_serials');
    }
};
