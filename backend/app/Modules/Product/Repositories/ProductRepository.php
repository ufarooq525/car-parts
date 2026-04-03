<?php

namespace App\Modules\Product\Repositories;

use App\Core\Repositories\BaseRepository;
use App\Modules\Product\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRepository extends BaseRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * Get filtered and paginated products
     */
    public function getFilteredProducts(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->query()->with('category');

        if (! empty($filters['category_id'])) {
            $query->byCategory($filters['category_id']);
        }

        if (! empty($filters['brand'])) {
            $query->byBrand($filters['brand']);
        }

        if (! empty($filters['search'])) {
            $this->applySearch($query, $filters['search'], [
                'name',
                'sku',
                'oem_reference',
                'description',
            ]);
        }

        if (isset($filters['min_price']) && isset($filters['max_price'])) {
            $query->priceBetween((float) $filters['min_price'], (float) $filters['max_price']);
        } elseif (isset($filters['min_price'])) {
            $query->where('sell_price', '>=', $filters['min_price']);
        } elseif (isset($filters['max_price'])) {
            $query->where('sell_price', '<=', $filters['max_price']);
        }

        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $query->inStock();
        }

        if (! empty($filters['supplier_id'])) {
            $query->whereHas('suppliers', function (Builder $q) use ($filters) {
                $q->where('suppliers.id', $filters['supplier_id']);
            });
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query = $this->applySorting($query, $sortBy, $sortOrder);

        return $query->paginate($perPage);
    }

    /**
     * Find a product by its slug with relations
     */
    public function findBySlug(string $slug): ?Product
    {
        return $this->query()
            ->with(['category', 'suppliers'])
            ->where('slug', $slug)
            ->first();
    }

    /**
     * Find a product by its SKU
     */
    public function findBySku(string $sku): ?Product
    {
        return $this->findByColumn('sku', $sku);
    }

    /**
     * Get products by category
     */
    public function getByCategory(int $categoryId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->with('category')
            ->byCategory($categoryId)
            ->visible()
            ->active()
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get products by vehicle
     */
    public function getByVehicle(int $vehicleId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->query()
            ->with('category')
            ->whereHas('vehicles', function (Builder $q) use ($vehicleId) {
                $q->where('vehicles.id', $vehicleId);
            })
            ->visible()
            ->active()
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Update stock quantity for a product
     */
    public function updateStock(int $productId, int $quantity): Product
    {
        $product = $this->findByIdOrFail($productId);
        $product->update(['stock_quantity' => $quantity]);

        return $product->fresh();
    }

    /**
     * Update cost and sell price for a product
     */
    public function updatePrice(int $productId, float $costPrice, float $sellPrice): Product
    {
        $product = $this->findByIdOrFail($productId);
        $product->update([
            'cost_price' => $costPrice,
            'sell_price' => $sellPrice,
        ]);

        return $product->fresh();
    }

    /**
     * Hide products that are out of stock and not price-locked
     */
    public function hideOutOfStock(): int
    {
        return $this->query()
            ->where('stock_quantity', '<=', 0)
            ->where('is_price_locked', false)
            ->where('is_visible', true)
            ->update(['is_visible' => false]);
    }

    /**
     * Show products that have been restocked
     */
    public function showRestocked(): int
    {
        return $this->query()
            ->where('stock_quantity', '>', 0)
            ->where('is_visible', false)
            ->update(['is_visible' => true]);
    }
}
