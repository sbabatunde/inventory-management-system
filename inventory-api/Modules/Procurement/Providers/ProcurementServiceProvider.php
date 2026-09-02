<?php

namespace Modules\Procurement\Providers;

use Illuminate\Console\Scheduling\Schedule;
use Modules\Procurement\app\Repositories\Contracts\GoodsReceiptRepositoryInterface;
use Modules\Procurement\app\Repositories\Contracts\PurchaseOrderRepositoryInterface;
use Modules\Procurement\app\Repositories\Contracts\PurchaseRequisitionRepositoryInterface;
use Modules\Procurement\App\Repositories\Contracts\SupplierRepositoryInterface;
use Modules\Procurement\app\Repositories\GoodsReceiptRepository;
use Modules\Procurement\App\Repositories\PurchaseOrderRepository;
use Modules\Procurement\App\Repositories\PurchaseRequisitionRepository;
use Modules\Procurement\App\Repositories\SupplierRepository;
use Modules\Procurement\app\Services\GoodsReceiptService;
use Modules\Procurement\app\Services\PurchaseOrderService;
use Modules\Procurement\App\Services\PurchaseRequisitionService;
use Modules\Procurement\app\Services\SupplierService;
use Nwidart\Modules\Support\ModuleServiceProvider;

class ProcurementServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Procurement';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'procurement';

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
        $this->app->bind(SupplierRepositoryInterface::class, SupplierRepository::class);
        $this->app->bind(PurchaseRequisitionRepositoryInterface::class, PurchaseRequisitionRepository::class);
        $this->app->bind(PurchaseOrderRepositoryInterface::class, PurchaseOrderRepository::class);
        $this->app->bind(GoodsReceiptRepositoryInterface::class, GoodsReceiptRepository::class);

        // Register services
        $this->app->singleton(SupplierService::class, function ($app) {
            return new SupplierService($app->make(SupplierRepositoryInterface::class));
        });

        $this->app->singleton(PurchaseRequisitionService::class, function ($app) {
            return new PurchaseRequisitionService(
                $app->make(PurchaseRequisitionRepositoryInterface::class)
            );
        });

        $this->app->singleton(PurchaseOrderService::class, function ($app) {
            return new PurchaseOrderService(
                $app->make(PurchaseOrderRepositoryInterface::class),
                $app->make(\Modules\Inventory\App\Services\StockBalanceService::class)
            );
        });

        $this->app->singleton(GoodsReceiptService::class, function ($app) {
            return new GoodsReceiptService(
                $app->make(GoodsReceiptRepositoryInterface::class),
                $app->make(\Modules\Inventory\App\Services\StockBalanceService::class)
            );
        });
    }

    public function boot(): void
    {
        parent::boot();

        $this->loadMigrationsFrom(module_path($this->nameLower, 'database/migrations'));
    }
}
