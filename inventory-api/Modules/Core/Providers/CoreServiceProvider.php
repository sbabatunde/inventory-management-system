<?php

namespace Modules\Core\Providers;

use Nwidart\Modules\Support\ModuleServiceProvider;
use Illuminate\Console\Scheduling\Schedule;

class CoreServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Core';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'core';

    /**
     * Command classes to register.
     *
     * @var string[]
     */
    // protected array $commands = [];

    /**
     * Provider classes to register.
     *
     * @var string[]
     */
    protected array $providers = [
        EventServiceProvider::class,
        RouteServiceProvider::class,
    ];

    /**
     * Define module schedules.
     * 
     * @param $schedule
     */
    // protected function configureSchedules(Schedule $schedule): void
    // {
    //     $schedule->command('inspire')->hourly();
    // }

    /**
     * Register any module services.
     */
    public function register(): void
    {
        parent::register();

        // Register module-specific services
        $this->app->register(EventServiceProvider::class);
    }

    /**
     * Boot the module services.
     */
    public function boot(): void
    {
        parent::boot();

        // Register module migrations
        $this->loadMigrationsFrom(module_path($this->nameLower, 'database/migrations'));

        // Register module views
        $this->loadViewsFrom(module_path($this->nameLower, 'resources/views'), $this->nameLower);
    }
}
