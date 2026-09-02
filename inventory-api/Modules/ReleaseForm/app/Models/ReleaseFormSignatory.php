<?php
// Modules/ReleaseForm/app/Models/ReleaseFormSignatory.php

namespace Modules\ReleaseForm\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Modules\ReleaseForm\app\Enums\SignatoryRole;

class ReleaseFormSignatory extends Model
{
    protected $fillable = [
        'release_form_id',
        'user_id',
        'crm_user_id',
        'name',
        'role',
        'signature_ref',
        'signed_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'role' => SignatoryRole::class,
        'signed_at' => 'datetime',
    ];

    public function releaseForm(): BelongsTo
    {
        return $this->belongsTo(ReleaseForm::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function hasSigned(): bool
    {
        return $this->signed_at !== null;
    }
}
