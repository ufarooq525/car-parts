<?php

namespace App\Modules\Product\Actions;

use App\Modules\Supplier\Models\MarginRule;

class CalculatePriceAction
{
    /**
     * Calculate the sell price based on cost price and applicable margin rules
     */
    public function __invoke(float $costPrice, ?int $supplierId = null, ?int $categoryId = null): float
    {
        $rule = $this->findApplicableRule($supplierId, $categoryId);

        if (! $rule) {
            return $costPrice;
        }

        return $this->applyMargin($costPrice, $rule);
    }

    /**
     * Find the most applicable margin rule by priority
     */
    protected function findApplicableRule(?int $supplierId, ?int $categoryId): ?MarginRule
    {
        $query = MarginRule::where('is_active', true)
            ->orderBy('priority', 'desc');

        // Try to find the most specific rule first
        // 1. Category + Supplier specific
        if ($supplierId && $categoryId) {
            $rule = (clone $query)
                ->where('supplier_id', $supplierId)
                ->where('category_id', $categoryId)
                ->first();

            if ($rule) {
                return $rule;
            }
        }

        // 2. Category specific
        if ($categoryId) {
            $rule = (clone $query)
                ->where('category_id', $categoryId)
                ->whereNull('supplier_id')
                ->first();

            if ($rule) {
                return $rule;
            }
        }

        // 3. Supplier specific
        if ($supplierId) {
            $rule = (clone $query)
                ->where('supplier_id', $supplierId)
                ->whereNull('category_id')
                ->first();

            if ($rule) {
                return $rule;
            }
        }

        // 4. Global rule (no supplier, no category)
        return (clone $query)
            ->whereNull('supplier_id')
            ->whereNull('category_id')
            ->first();
    }

    /**
     * Apply margin to cost price based on rule type
     */
    protected function applyMargin(float $costPrice, MarginRule $rule): float
    {
        if ($rule->type === 'percentage') {
            return round($costPrice * (1 + $rule->value / 100), 2);
        }

        // Fixed margin
        return round($costPrice + $rule->value, 2);
    }
}
