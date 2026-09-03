<?php
// Modules/Reporting/app/Models/MonthlyCostSummary.php

namespace Modules\Reporting\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MonthlyCostSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'month',
        'category',
        'total_cost',
        'total_count',
        'breakdown',
    ];

    protected $casts = [
        'total_cost' => 'decimal:2',
        'total_count' => 'integer',
        'breakdown' => 'array',
    ];

    /**
     * Scope by month
     */
    public function scopeByMonth($query, string $month)
    {
        return $query->where('month', $month);
    }

    /**
     * Scope by category
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }
}
