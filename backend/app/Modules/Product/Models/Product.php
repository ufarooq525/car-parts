<?php

namespace App\Modules\Product\Models;

use App\Core\Traits\HasScopes;
use App\Core\Traits\HasSlug;
use App\Modules\Category\Models\Category;
use App\Modules\Order\Models\OrderItem;
use App\Modules\Supplier\Models\Supplier;
use App\Modules\Vehicle\Models\Vehicle;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasScopes, HasSlug, SoftDeletes;

    protected $table = 'products';

    protected $fillable = [
        'sku',
        'name',
        'slug',
        'description',
        'short_description',
        'brand',
        'oem_reference',
        'image',
        'images',
        'category_id',
        'cost_price',
        'sell_price',
        'stock_quantity',
        'low_stock_threshold',
        'is_visible',
        'is_active',
        'is_price_locked',
        'weight',
        'meta_title',
        'meta_description',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'cost_price' => 'decimal:2',
            'sell_price' => 'decimal:2',
            'is_visible' => 'boolean',
            'is_active' => 'boolean',
            'is_price_locked' => 'boolean',
            'weight' => 'decimal:3',
        ];
    }

    // ──────────────────────────────────────────────
    // Relations
    // ──────────────────────────────────────────────

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function suppliers(): BelongsToMany
    {
        return $this->belongsToMany(Supplier::class, 'product_supplier')
            ->withPivot('supplier_sku', 'cost_price', 'stock_quantity', 'is_preferred', 'last_synced_at')
            ->withTimestamps();
    }

    public function vehicles(): BelongsToMany
    {
        return $this->belongsToMany(Vehicle::class, 'product_vehicle')
            ->withTimestamps();
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // ──────────────────────────────────────────────
    // Scopes
    // ──────────────────────────────────────────────

    public function scopeByCategory(Builder $query, int $categoryId): Builder
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByBrand(Builder $query, string $brand): Builder
    {
        return $query->where('brand', $brand);
    }

    public function scopeByOem(Builder $query, string $oem): Builder
    {
        return $query->where('oem_reference', $oem);
    }

    public function scopePriceBetween(Builder $query, float $min, float $max): Builder
    {
        return $query->whereBetween('sell_price', [$min, $max]);
    }
}
