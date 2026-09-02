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
        Schema::create('pop_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->string('pop_id')->nullable();
            $table->string('pop_name')->nullable();
            $table->string('pop_location')->nullable();
            $table->string('site_id')->nullable();
            $table->string('site_name')->nullable();
            $table->string('rack_position')->nullable();
            $table->string('slot_position')->nullable();
            $table->string('port_assignment')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('mac_address')->nullable();
            $table->string('firmware_version')->nullable();
            $table->timestamp('installation_date')->nullable();
            $table->string('installed_by')->nullable();
            $table->text('configuration_notes')->nullable();
            $table->boolean('is_operational')->default(true);
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['pop_id', 'site_id']);
            $table->index(['asset_id', 'is_operational']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pop_equipment');
    }
};
