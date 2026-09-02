<?php

namespace Modules\Inventory\Providers;

use Illuminate\Console\Scheduling\Schedule;
use Modules\Inventory\app\Repositories\Contracts\StockAdjustmentRepositoryInterface;
use Modules\Inventory\app\Repositories\Contracts\StockItemRepositoryInterface;
use Modules\Inventory\app\Repositories\Contracts\StockMovementRepositoryInterface;
use Modules\Inventory\app\Repositories\Contracts\StockSerialRepositoryInterface;
use Modules\Inventory\app\Repositories\Contracts\StockTransferRepositoryInterface;
use Modules\Inventory\app\Repositories\Contracts\StoreRepositoryInterface;
use Modules\Inventory\app\Repositories\StockAdjustmentRepository;
use Modules\Inventory\app\Repositories\StockItemRepository;
use Modules\Inventory\app\Repositories\StockTransferRepository;
use Modules\Inventory\app\Repositories\StoreRepository;
use Modules\Inventory\app\Services\StockAdjustmentService;
use Modules\Inventory\app\Services\StockBalanceService;
use Modules\Inventory\app\Services\StockItemService;
use Modules\Inventory\app\Services\StockMovementService;
use Modules\Inventory\app\Services\StockSerialService;
use Modules\Inventory\app\Services\StockTransferService;
use Modules\Inventory\app\Services\StoreService;
use Nwidart\Modules\Support\ModuleServiceProvider;

class InventoryServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Inventory';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'inventory';

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
        $this->app->bind(StoreRepositoryInterface::class, StoreRepository::class);
        $this->app->bind(StockItemRepositoryInterface::class, StockItemRepository::class);
        $this->app->bind(StockTransferRepositoryInterface::class, StockTransferRepository::class);
        $this->app->bind(StockAdjustmentRepositoryInterface::class, StockAdjustmentRepository::class);

        // Register services
        $this->app->singleton(StoreService::class, function ($app) {
            return new StoreService(
                $app->make(StoreRepositoryInterface::class),
                $app->make(StockItemRepositoryInterface::class)
            );
        });

        $this->app->singleton(StockItemService::class, function ($app) {
            return new StockItemService($app->make(StockItemRepositoryInterface::class));
        });

        $this->app->singleton(StockBalanceService::class, function ($app) {
            return new StockBalanceService();
        });

        $this->app->singleton(StockTransferService::class, function ($app) {
            return new StockTransferService(
                $app->make(StockTransferRepositoryInterface::class),
                $app->make(StockBalanceService::class)
            );
        });

        $this->app->singleton(StockAdjustmentService::class, function ($app) {
            return new StockAdjustmentService(
                $app->make(StockAdjustmentRepositoryInterface::class),
                $app->make(StockBalanceService::class)
            );
        });

        $this->app->singleton(StockSerialService::class, function ($app) {
            return new StockSerialService($app->make(StockSerialRepositoryInterface::class));
        });

        $this->app->singleton(StockMovementService::class, function ($app) {
            return new StockMovementService($app->make(StockMovementRepositoryInterface::class));
        });
    }

    public function boot(): void
    {
        parent::boot();

        $this->loadMigrationsFrom(module_path($this->nameLower, 'database/migrations'));
    }
}
