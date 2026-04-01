<?php

namespace App\Modules\Product\Models;

use App\Modules\Supplier\Models\Supplier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductSupplier extends Model
{
    protected $table = 'product_supplier';

    protected $fillable = [
        'product_id',
        'supplier_id',
        'supplier_sku',
        'cost_price',
        'stock_quantity',
        'is_preferred',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'cost_price' => 'decimal:2',
            'is_preferred' => 'boolean',
            'last_synced_at' => 'datetime',
        ];
    }

    // ──────────────────────────────────────────────
    // Relations
    // ──────────────────────────────────────────────

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
