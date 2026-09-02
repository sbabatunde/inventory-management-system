<?php

namespace Modules\Reporting\Providers;

use Illuminate\Console\Scheduling\Schedule;
use Modules\Reporting\App\Services\CostBreakdownService;
use Modules\Reporting\app\Services\ExportService;
use Modules\Reporting\app\Services\InventoryReportService;
use Modules\Reporting\app\Services\SupplierPerformanceService;
use Nwidart\Modules\Support\ModuleServiceProvider;

class ReportingServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Reporting';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'reporting';

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

    public function register(): void
    {
        parent::register();

        $this->app->singleton(CostBreakdownService::class);
        $this->app->singleton(InventoryReportService::class);
        $this->app->singleton(SupplierPerformanceService::class);
        $this->app->singleton(ExportService::class);
    }

    public function boot(): void
    {
        parent::boot();

        $this->loadMigrationsFrom(module_path($this->nameLower, 'database/migrations'));
    }
}
