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
        Schema::create('release_form_signatories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('release_form_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('crm_user_id')->nullable(); // For CRM users not in local system
            $table->string('name');
            $table->string('role'); // requester, storekeeper, engineer, approver, receiver
            $table->string('signature_ref')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index(['release_form_id', 'role']);
            $table->index(['release_form_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('release_form_signatories');
    }
};
