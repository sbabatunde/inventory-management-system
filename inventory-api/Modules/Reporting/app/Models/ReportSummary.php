<?php
// Modules/Reporting/app/Models/ReportSummary.php

namespace Modules\Reporting\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReportSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_type',
        'period',
        'period_value',
        'summary_data',
        'generated_at',
    ];

    protected $casts = [
        'summary_data' => 'array',
        'generated_at' => 'datetime',
    ];

    /**
     * Scope by report type
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('report_type', $type);
    }

    /**
     * Scope by period
     */
    public function scopeByPeriod($query, string $period, string $periodValue)
    {
        return $query->where('period', $period)
            ->where('period_value', $periodValue);
    }
}
