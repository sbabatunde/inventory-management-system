<?php

namespace Modules\Reporting\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Reporting\Database\Factories\MonthlyCostSummaryFactory;

class MonthlyCostSummary extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): MonthlyCostSummaryFactory
    // {
    //     // return MonthlyCostSummaryFactory::new();
    // }
}
