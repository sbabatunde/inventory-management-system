<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmToken extends Model
{
  use SoftDeletes;

  protected $fillable = [
    'user_id',
    'token_hash',
    'expires_at',
    'last_used_at',
    'ip_address',
    'user_agent',
    'is_active',
  ];

  protected $casts = [
    'expires_at' => 'datetime',
    'last_used_at' => 'datetime',
    'is_active' => 'boolean',
  ];

  protected $hidden = [
    'token_hash',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function isExpired(): bool
  {
    return $this->expires_at && $this->expires_at->isPast();
  }

  public function scopeActive($query)
  {
    return $query->where('is_active', true)
      ->where(function ($q) {
        $q->whereNull('expires_at')
          ->orWhere('expires_at', '>', now());
      });
  }
}
