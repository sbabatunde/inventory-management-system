<?php

namespace Modules\Assets\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Assets\Database\Factories\PopEquipmentFactory;

class PopEquipment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): PopEquipmentFactory
    // {
    //     // return PopEquipmentFactory::new();
    // }
}
