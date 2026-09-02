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
        Schema::create('monthly_cost_summaries', function (Blueprint $table) {
            $table->id();
            $table->string('month'); // 2024-01
            $table->string('category'); // installation, maintenance, logistics, collection
            $table->decimal('total_cost', 15, 2)->default(0);
            $table->integer('total_count')->default(0);
            $table->json('breakdown')->nullable();
            $table->timestamps();

            $table->unique(['month', 'category']);
            $table->index('month');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('monthly_cost_summaries');
    }
};
