<?php

namespace App\Core\Exceptions;

use App\Core\Traits\ApiResponseTrait;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    use ApiResponseTrait;

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->renderable(function (Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return $this->handleApiException($e);
            }
        });
    }

    /**
     * Handle API exceptions and return consistent JSON responses.
     */
    protected function handleApiException(Throwable $e): JsonResponse
    {
        if ($e instanceof ValidationException) {
            return $this->validationErrorResponse(
                $e->errors(),
                'messages.validation_failed'
            );
        }

        if ($e instanceof ModelNotFoundException) {
            $modelName = class_basename($e->getModel());
            return $this->notFoundResponse("messages.model_not_found");
        }

        if ($e instanceof NotFoundHttpException) {
            return $this->notFoundResponse('messages.route_not_found');
        }

        if ($e instanceof MethodNotAllowedHttpException) {
            return $this->errorResponse(
                'messages.method_not_allowed',
                Response::HTTP_METHOD_NOT_ALLOWED
            );
        }

        if ($e instanceof AuthenticationException) {
            return $this->unauthorizedResponse('messages.unauthenticated');
        }

        if ($e instanceof AuthorizationException) {
            return $this->forbiddenResponse('messages.forbidden');
        }

        if ($e instanceof BusinessException) {
            return $this->errorResponse(
                $e->getMessage(),
                $e->getCode() ?: Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        if ($e instanceof HttpException) {
            return $this->errorResponse(
                $e->getMessage() ?: 'messages.http_error',
                $e->getStatusCode()
            );
        }

        // Unhandled exceptions
        if (config('app.debug')) {
            return response()->json([
                'success'   => false,
                'message'   => $e->getMessage(),
                'exception' => get_class($e),
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
                'trace'     => collect($e->getTrace())->take(5)->toArray(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->errorResponse(
            'messages.server_error',
            Response::HTTP_INTERNAL_SERVER_ERROR
        );
    }
}
