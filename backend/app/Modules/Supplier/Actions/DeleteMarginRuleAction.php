<?php

namespace App\Modules\Supplier\Actions;

use App\Modules\Supplier\Models\MarginRule;

class DeleteMarginRuleAction
{
    /**
     * Delete a margin rule.
     */
    public function execute(MarginRule $rule): bool
    {
        return $rule->delete();
    }
}
