<?php

namespace App\Modules\Supplier\Models;

use App\Core\Traits\HasScopes;
use App\Models\User;
use App\Modules\Product\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasScopes, SoftDeletes;

    protected $table = 'suppliers';

    protected $fillable = [
        'name',
        'contact_person',
        'email',
        'phone',
        'website',
        'business_license',
        'tax_id',
        'address',
        'description',
        'code',
        'type',
        'api_url',
        'api_key',
        'feed_url',
        'csv_file_path',
        'csv_original_name',
        'config',
        'default_margin_type',
        'default_margin_value',
        'sync_interval_minutes',
        'is_active',
        'approval_status',
        'rejection_reason',
        'approved_at',
        'approved_by',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'config' => 'array',
            'is_active' => 'boolean',
            'default_margin_value' => 'decimal:2',
            'last_synced_at' => 'datetime',
            'approved_at' => 'datetime',
        ];
    }

    // ──────────────────────────────────────────────
    // Relations
    // ──────────────────────────────────────────────

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_supplier')
            ->withPivot('supplier_sku', 'cost_price', 'stock_quantity', 'is_preferred', 'last_synced_at')
            ->withTimestamps();
    }

    public function marginRules(): HasMany
    {
        return $this->hasMany(MarginRule::class);
    }

    public function syncLogs(): HasMany
    {
        return $this->hasMany(SyncLog::class);
    }

    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    public function isPending(): bool
    {
        return $this->approval_status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->approval_status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->approval_status === 'rejected';
    }
}
