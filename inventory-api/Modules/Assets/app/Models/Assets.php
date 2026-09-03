<?php
// Modules/Assets/app/Models/Asset.php

namespace Modules\Assets\app\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\Assets\app\Enums\AssetStatus;
use Modules\Assets\app\Enums\AssetType;
use Modules\Assets\app\Enums\DepreciationMethod;

class Assets extends Model
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'asset_code',
        'name',
        'description',
        'type',
        'stock_item_id',
        'serial_no',
        'status',
        'current_store_id',
        'current_location_type',
        'current_location_id',
        'assigned_to',
        'assigned_at',
        'installed_at',
        'last_maintenance_at',
        'next_maintenance_due',
        'purchase_cost',
        'purchase_date',
        'current_value',
        'salvage_value',
        'useful_life_months',
        'depreciation_method',
        'is_active',
    ];

    protected $casts = [
        'type' => AssetType::class,
        'status' => AssetStatus::class,
        'depreciation_method' => DepreciationMethod::class,
        'purchase_cost' => 'decimal:2',
        'current_value' => 'decimal:2',
        'salvage_value' => 'decimal:2',
        'is_active' => 'boolean',
        'assigned_at' => 'datetime',
        'installed_at' => 'datetime',
        'last_maintenance_at' => 'datetime',
        'next_maintenance_due' => 'datetime',
        'purchase_date' => 'date',
    ];

    public function stockItem(): BelongsTo
    {
        return $this->belongsTo(\Modules\Inventory\app\Models\StockItem::class);
    }

    public function currentStore(): BelongsTo
    {
        return $this->belongsTo(\Modules\Inventory\app\Models\Store::class, 'current_store_id');
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(\app\Models\User::class, 'assigned_to');
    }

    public function popEquipment(): HasOne
    {
        return $this->hasOne(PopEquipment::class);
    }

    public function clientEquipment(): HasOne
    {
        return $this->hasOne(ClientEquipment::class);
    }

    public function scopeByType($query, AssetType $type)
    {
        return $query->where('type', $type->value);
    }

    public function scopeByStatus($query, AssetStatus $status)
    {
        return $query->where('status', $status->value);
    }

    public function scopeOperational($query)
    {
        return $query->where('is_active', true)
            ->whereNotIn('status', [AssetStatus::RETIRED->value]);
    }

    public function calculateDepreciation(): float
    {
        if ($this->purchase_cost <= 0) {
            return 0;
        }

        $monthsUsed = $this->purchase_date
            ? $this->purchase_date->diffInMonths(now())
            : 0;

        if ($monthsUsed >= $this->useful_life_months) {
            return $this->salvage_value;
        }

        $depreciableAmount = $this->purchase_cost - $this->salvage_value;

        switch ($this->depreciation_method) {
            case DepreciationMethod::STRAIGHT_LINE:
                $monthlyDepreciation = $depreciableAmount / $this->useful_life_months;
                $currentValue = $this->purchase_cost - ($monthlyDepreciation * $monthsUsed);
                break;

            case DepreciationMethod::DECLINING_BALANCE:
                $rate = 2 / $this->useful_life_months;
                $currentValue = $this->purchase_cost * pow(1 - $rate, $monthsUsed);
                $currentValue = max($currentValue, $this->salvage_value);
                break;

            case DepreciationMethod::SUM_OF_YEARS:
                $sumOfYears = ($this->useful_life_months * ($this->useful_life_months + 1)) / 2;
                $remainingLife = $this->useful_life_months - $monthsUsed;
                $accumulatedDepreciation = $depreciableAmount *
                    (($this->useful_life_months * ($this->useful_life_months + 1) / 2) -
                        ($remainingLife * ($remainingLife + 1) / 2)) / $sumOfYears;
                $currentValue = $this->purchase_cost - $accumulatedDepreciation;
                break;

            default:
                $currentValue = $this->purchase_cost;
        }

        return max($currentValue, $this->salvage_value);
    }
}
