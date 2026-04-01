<?php

namespace App\Core\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

abstract class ModuleServiceProvider extends ServiceProvider
{
    /**
     * The module name (e.g., 'Product', 'Order')
     */
    abstract protected function getModuleName(): string;

    /**
     * Get the module's base path
     */
    protected function getModulePath(): string
    {
        return app_path('Modules/' . $this->getModuleName());
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        $this->registerRepositories();
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->loadRoutes();
        $this->loadTranslations();
    }

    /**
     * Load module routes
     */
    protected function loadRoutes(): void
    {
        $routesPath = $this->getModulePath() . '/Routes';

        if (file_exists($routesPath . '/api.php')) {
            Route::prefix('api')
                ->middleware('api')
                ->group($routesPath . '/api.php');
        }

        if (file_exists($routesPath . '/web.php')) {
            Route::middleware('web')
                ->group($routesPath . '/web.php');
        }
    }

    /**
     * Load module translations
     */
    protected function loadTranslations(): void
    {
        $translationsPath = $this->getModulePath() . '/Translations';

        if (is_dir($translationsPath)) {
            $moduleName = strtolower($this->getModuleName());
            $this->loadTranslationsFrom($translationsPath, $moduleName);
        }
    }

    /**
     * Register module repositories (override in child)
     */
    protected function registerRepositories(): void
    {
        // Override in module service provider
    }
}
