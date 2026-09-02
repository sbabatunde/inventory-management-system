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
        Schema::create('stock_balances', function (Blueprint $table) {
             $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('stock_item_id')->constrained()->onDelete('cascade');
            $table->integer('quantity_on_hand')->default(0);
            $table->integer('quantity_reserved')->default(0);
            $table->integer('quantity_available')->default(0);
            $table->timestamp('last_counted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Unique constraint for one balance per item per store
            $table->unique(['store_id', 'stock_item_id']);
            $table->index(['store_id', 'quantity_on_hand']);
            $table->index(['stock_item_id', 'quantity_on_hand']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_balances');
    }
};
