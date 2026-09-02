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
        Schema::create('release_form_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('release_form_id')->constrained()->onDelete('cascade');
            $table->foreignId('stock_item_id')->constrained()->onDelete('cascade');
            $table->string('serial_no')->nullable();
            $table->integer('qty_requested');
            $table->integer('qty_released')->default(0);
            $table->integer('qty_before')->nullable();
            $table->integer('qty_after')->nullable();
            $table->string('unit_of_measure');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['release_form_id', 'stock_item_id']);
            $table->index(['stock_item_id', 'serial_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('release_form_items');
    }
};
