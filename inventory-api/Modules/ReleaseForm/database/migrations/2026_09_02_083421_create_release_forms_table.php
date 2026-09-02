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
        Schema::create('release_forms', function (Blueprint $table) {
            $table->id();
            $table->string('form_no')->unique();
            $table->enum('category', ['installation', 'maintenance', 'others']);
            $table->string('reference_type')->nullable(); // job_order, ticket, other
            $table->string('reference_id')->nullable();
            $table->text('reference_description')->nullable();
            $table->foreignId('store_id')->constrained('stores')->onDelete('cascade');
            $table->enum('destination_type', ['CPE', 'NOC', 'POP', 'Other']);
            $table->string('destination_name')->nullable();
            $table->string('destination_address')->nullable();
            $table->enum('status', [
                'draft',
                'pending_approval',
                'approved',
                'dispatched',
                'completed',
                'rejected',
                'cancelled',
                'pending_reconciliation'
            ])->default('draft');
            $table->boolean('is_manual_entry')->default(false);
            $table->date('occurred_at')->nullable(); // Date on paper form
            $table->timestamp('recorded_at')->nullable(); // Date entered in system
            $table->text('notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('dispatched_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('completed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('dispatched_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['form_no', 'status']);
            $table->index(['category', 'status']);
            $table->index(['reference_type', 'reference_id']);
            $table->index(['store_id', 'status']);
            $table->index('is_manual_entry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('release_forms');
    }
};
