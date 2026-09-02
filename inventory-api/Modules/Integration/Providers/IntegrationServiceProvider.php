<?php

namespace Modules\Integration\Providers;

use Illuminate\Console\Scheduling\Schedule;
use Modules\Integration\app\Services\CrmApiClient;
use Modules\Integration\app\Services\CrmUserService;
use Modules\Integration\app\Services\JobOrderService;
use Modules\Integration\app\Services\TicketService;
use Nwidart\Modules\Support\ModuleServiceProvider;

class IntegrationServiceProvider extends ModuleServiceProvider
{
    /**
     * The name of the module.
     */
    protected string $name = 'Integration';

    /**
     * The lowercase version of the module name.
     */
    protected string $nameLower = 'integration';

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

        // Register services
        $this->app->singleton(CrmApiClient::class, function ($app) {
            return new CrmApiClient();
        });

        $this->app->singleton(JobOrderService::class, function ($app) {
            return new JobOrderService($app->make(CrmApiClient::class));
        });

        $this->app->singleton(TicketService::class, function ($app) {
            return new TicketService($app->make(CrmApiClient::class));
        });

        $this->app->singleton(CrmUserService::class, function ($app) {
            return new CrmUserService($app->make(CrmApiClient::class));
        });
    }

    public function boot(): void
    {
        parent::boot();

        // Merge config
        $this->mergeConfigFrom(
            module_path($this->nameLower, 'config/crm.php'),
            'crm'
        );
    }
}
