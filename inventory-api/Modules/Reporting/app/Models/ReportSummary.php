<?php

namespace Modules\Reporting\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reporting\Database\Factories\ReportSummaryFactory;

class ReportSummary extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): ReportSummaryFactory
    // {
    //     // return ReportSummaryFactory::new();
    // }
}
