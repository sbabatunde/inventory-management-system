<?php

namespace Modules\Assets\Providers;

use Illuminate\Console\Scheduling\Schedule;
use Modules\Assets\app\Repositories\AssetRepository;
use Modules\Assets\app\Repositories\Contracts\AssetRepositoryInterface;
use Modules\Assets\app\Services\AssetService;
use Nwidart\Modules\Support\ModuleServiceProvider;

class AssetsServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Assets';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'assets';

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

        // Bind repositories
        $this->app->bind(AssetRepositoryInterface::class, AssetRepository::class);

        // Register services
        $this->app->singleton(AssetService::class, function ($app) {
            return new AssetService($app->make(AssetRepositoryInterface::class));
        });
    }

    public function boot(): void
    {
        parent::boot();

        $this->loadMigrationsFrom(module_path($this->nameLower, 'database/migrations'));
    }
}
