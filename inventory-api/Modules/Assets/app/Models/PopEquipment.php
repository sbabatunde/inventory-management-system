<?php
// Modules/Assets/app/Models/PopEquipment.php

namespace Modules\Assets\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PopEquipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pop_equipment';

    protected $fillable = [
        'asset_id',
        'pop_id',
        'pop_name',
        'pop_location',
        'site_id',
        'site_name',
        'rack_position',
        'slot_position',
        'port_assignment',
        'ip_address',
        'mac_address',
        'firmware_version',
        'installation_date',
        'installed_by',
        'configuration_notes',
        'is_operational',
        'last_checked_at',
    ];

    protected $casts = [
        'installation_date' => 'datetime',
        'last_checked_at' => 'datetime',
        'is_operational' => 'boolean',
    ];

    /**
     * Get the asset
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Assets::class);
    }

    /**
     * Scope for operational equipment
     */
    public function scopeOperational($query)
    {
        return $query->where('is_operational', true);
    }

    /**
     * Scope by POP
     */
    public function scopeByPop($query, string $popId)
    {
        return $query->where('pop_id', $popId);
    }

    /**
     * Scope by site
     */
    public function scopeBySite($query, string $siteId)
    {
        return $query->where('site_id', $siteId);
    }
}
