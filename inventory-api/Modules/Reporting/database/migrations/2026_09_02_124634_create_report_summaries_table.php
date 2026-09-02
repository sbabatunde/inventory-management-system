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
        Schema::create('report_summaries', function (Blueprint $table) {
            $table->id();
            $table->string('report_type'); // cost, inventory, procurement, asset, release
            $table->string('period'); // daily, monthly, yearly
            $table->string('period_value'); // 2024-01, 2024-01-15, 2024
            $table->json('summary_data');
            $table->timestamp('generated_at');
            $table->timestamps();

            $table->unique(['report_type', 'period', 'period_value']);
            $table->index(['report_type', 'period_value']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_summaries');
    }
};
