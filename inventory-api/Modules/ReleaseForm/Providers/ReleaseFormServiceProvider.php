<?php

namespace Modules\ReleaseForm\Providers;

use Illuminate\Console\Scheduling\Schedule;
use Modules\ReleaseForm\app\Repositories\Contracts\ReleaseFormRepositoryInterface;
use Modules\ReleaseForm\app\Repositories\ReleaseFormRepository;
use Modules\ReleaseForm\App\Services\ReleaseFormService;
use Modules\ReleaseForm\app\Services\SignatoryService;
use Nwidart\Modules\Support\ModuleServiceProvider;

class ReleaseFormServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'ReleaseForm';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'releaseform';

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
        $this->app->bind(ReleaseFormRepositoryInterface::class, ReleaseFormRepository::class);

        // Register services
        $this->app->singleton(ReleaseFormService::class, function ($app) {
            return new ReleaseFormService(
                $app->make(ReleaseFormRepositoryInterface::class),
                $app->make(\Modules\Inventory\app\Services\StockBalanceService::class),
                $app->make(\Modules\Integration\app\Services\JobOrderService::class),
                $app->make(\Modules\Integration\app\Services\TicketService::class)
            );
        });

        $this->app->singleton(SignatoryService::class, function ($app) {
            return new SignatoryService(
                $app->make(\Modules\Integration\app\Services\CrmUserService::class)
            );
        });
    }

    public function boot(): void
    {
        parent::boot();

        $this->loadMigrationsFrom(module_path($this->nameLower, 'database/migrations'));
    }
}
