<?php

namespace Modules\Assets\app\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Assets\Database\Factories\ClientEquipmentFactory;

class ClientEquipment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [];

    // protected static function newFactory(): ClientEquipmentFactory
    // {
    //     // return ClientEquipmentFactory::new();
    // }
}
