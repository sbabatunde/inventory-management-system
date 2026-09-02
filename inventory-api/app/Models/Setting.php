<?php
// app/Models/Setting.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'group',
        'type',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    /**
     * Get setting value
     */
    public static function get(string $key, $default = null)
    {
        return Cache::remember("setting:{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();

            if (!$setting) {
                return $default;
            }

            return $setting->castValue();
        });
    }

    /**
     * Set setting value
     */
    public static function set(string $key, $value, string $group = 'general', string $type = 'string', bool $isPublic = false): void
    {
        static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) ? json_encode($value) : $value,
                'group' => $group,
                'type' => $type,
                'is_public' => $isPublic,
            ]
        );

        Cache::forget("setting:{$key}");
    }

    /**
     * Cast value based on type
     */
    public function castValue()
    {
        switch ($this->type) {
            case 'integer':
                return (int) $this->value;
            case 'boolean':
                return (bool) $this->value;
            case 'json':
            case 'array':
                return json_decode($this->value, true);
            default:
                return $this->value;
        }
    }
}
