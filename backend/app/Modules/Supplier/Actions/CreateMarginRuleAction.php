<?php

namespace App\Modules\Supplier\Actions;

use App\Modules\Supplier\Models\MarginRule;

class CreateMarginRuleAction
{
    /**
     * Create a new margin rule.
     */
    public function execute(array $data): MarginRule
    {
        return MarginRule::create($data);
    }
}
