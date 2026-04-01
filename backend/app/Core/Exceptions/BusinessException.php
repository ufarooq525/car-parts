<?php

namespace App\Core\Exceptions;

use Exception;

class BusinessException extends Exception
{
    public function __construct(string $message = 'messages.business_error', int $code = 422)
    {
        parent::__construct(__($message), $code);
    }
}
