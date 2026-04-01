<?php

namespace App\Modules\Vehicle\Models;

use App\Core\Traits\HasScopes;
use App\Core\Traits\HasSlug;
use App\Modules\Product\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Vehicle extends Model
{
    use HasScopes, HasSlug;

    protected $table = 'vehicles';

    protected $fillable = [
        'make',
        'model',
        'year_from',
        'year_to',
        'engine',
        'fuel_type',
        'slug',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Override slug source to use make-model-year_from combo.
     */
    protected function getSlugSource(): string
    {
        return "{$this->make}-{$this->model}-{$this->year_from}";
    }

    // ──────────────────────────────────────────────
    // Relations
    // ──────────────────────────────────────────────

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_vehicle')
            ->withTimestamps();
    }

    // ──────────────────────────────────────────────
    // Scopes
    // ──────────────────────────────────────────────

    public function scopeByMake(Builder $query, string $make): Builder
    {
        return $query->where('make', $make);
    }

    public function scopeByModel(Builder $query, string $model): Builder
    {
        return $query->where('model', $model);
    }

    public function scopeByYear(Builder $query, int $year): Builder
    {
        return $query->where('year_from', '<=', $year)
            ->where(function (Builder $q) use ($year) {
                $q->where('year_to', '>=', $year)
                    ->orWhereNull('year_to');
            });
    }
}
