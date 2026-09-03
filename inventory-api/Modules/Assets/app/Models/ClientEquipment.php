<?php
// Modules/Assets/app/Models/ClientEquipment.php

namespace Modules\Assets\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientEquipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'client_equipment';

    protected $fillable = [
        'asset_id',
        'client_id',
        'client_name',
        'client_address',
        'service_type',
        'circuit_id',
        'vlan_id',
        'ip_address',
        'mac_address',
        'device_model',
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
     * Scope by client
     */
    public function scopeByClient($query, string $clientId)
    {
        return $query->where('client_id', $clientId);
    }

    /**
     * Scope by circuit
     */
    public function scopeByCircuit($query, string $circuitId)
    {
        return $query->where('circuit_id', $circuitId);
    }
}
