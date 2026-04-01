<?php

namespace App\Core\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasScopes
{
    /**
     * Scope: filter by active status
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where($this->getTable() . '.is_active', true);
    }

    /**
     * Scope: filter by inactive status
     */
    public function scopeInactive(Builder $query): Builder
    {
        return $query->where($this->getTable() . '.is_active', false);
    }

    /**
     * Scope: filter by visible status
     */
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where($this->getTable() . '.is_visible', true);
    }

    /**
     * Scope: filter by hidden status
     */
    public function scopeHidden(Builder $query): Builder
    {
        return $query->where($this->getTable() . '.is_visible', false);
    }

    /**
     * Scope: filter by date range
     */
    public function scopeDateBetween(Builder $query, string $column, ?string $from, ?string $to): Builder
    {
        if ($from) {
            $query->where($column, '>=', $from);
        }

        if ($to) {
            $query->where($column, '<=', $to);
        }

        return $query;
    }

    /**
     * Scope: search across multiple columns
     */
    public function scopeSearch(Builder $query, ?string $term, array $columns): Builder
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where(function (Builder $q) use ($term, $columns) {
            foreach ($columns as $column) {
                $q->orWhere($column, 'LIKE', "%{$term}%");
            }
        });
    }

    /**
     * Scope: sort by column
     */
    public function scopeSortBy(Builder $query, string $column = 'created_at', string $direction = 'desc'): Builder
    {
        return $query->orderBy($column, $direction);
    }

    /**
     * Scope: filter by supplier
     */
    public function scopeBySupplier(Builder $query, int $supplierId): Builder
    {
        return $query->where($this->getTable() . '.supplier_id', $supplierId);
    }

    /**
     * Scope: in stock
     */
    public function scopeInStock(Builder $query): Builder
    {
        return $query->where($this->getTable() . '.stock_quantity', '>', 0);
    }

    /**
     * Scope: out of stock
     */
    public function scopeOutOfStock(Builder $query): Builder
    {
        return $query->where($this->getTable() . '.stock_quantity', '<=', 0);
    }
}
