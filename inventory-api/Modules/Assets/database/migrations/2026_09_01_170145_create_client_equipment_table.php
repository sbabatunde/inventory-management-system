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
        Schema::create('client_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->string('client_id')->nullable();
            $table->string('client_name')->nullable();
            $table->string('client_address')->nullable();
            $table->string('service_type')->nullable();
            $table->string('circuit_id')->nullable();
            $table->string('vlan_id')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('mac_address')->nullable();
            $table->string('device_model')->nullable();
            $table->string('firmware_version')->nullable();
            $table->timestamp('installation_date')->nullable();
            $table->string('installed_by')->nullable();
            $table->text('configuration_notes')->nullable();
            $table->boolean('is_operational')->default(true);
            $table->timestamp('last_checked_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['client_id', 'circuit_id']);
            $table->index(['asset_id', 'is_operational']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('client_equipment');
    }
};
