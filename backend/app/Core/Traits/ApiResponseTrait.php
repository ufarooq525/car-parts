<?php

namespace App\Core\Traits;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponseTrait
{
    /**
     * Success response
     */
    protected function successResponse(mixed $data = null, string $message = 'success', int $code = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => __($message),
            'data'    => $data,
        ], $code);
    }

    /**
     * Created response (201)
     */
    protected function createdResponse(mixed $data = null, string $message = 'messages.resource_created'): JsonResponse
    {
        return $this->successResponse($data, $message, Response::HTTP_CREATED);
    }

    /**
     * No content response (204)
     */
    protected function noContentResponse(string $message = 'messages.resource_deleted'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => __($message),
        ], Response::HTTP_OK);
    }

    /**
     * Error response
     */
    protected function errorResponse(string $message = 'messages.error_occurred', int $code = Response::HTTP_BAD_REQUEST, mixed $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => __($message),
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Not found response (404)
     */
    protected function notFoundResponse(string $message = 'messages.resource_not_found'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_NOT_FOUND);
    }

    /**
     * Unauthorized response (401)
     */
    protected function unauthorizedResponse(string $message = 'messages.unauthorized'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_UNAUTHORIZED);
    }

    /**
     * Forbidden response (403)
     */
    protected function forbiddenResponse(string $message = 'messages.forbidden'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_FORBIDDEN);
    }

    /**
     * Validation error response (422)
     */
    protected function validationErrorResponse(mixed $errors, string $message = 'messages.validation_failed'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_UNPROCESSABLE_ENTITY, $errors);
    }

    /**
     * Paginated response
     */
    protected function paginatedResponse(mixed $resource, string $message = 'success'): JsonResponse
    {
        $paginated = $resource->resource->toArray();

        return response()->json([
            'success' => true,
            'message' => __($message),
            'data'    => $resource->resolve(request()),
            'meta'    => [
                'current_page' => $paginated['current_page'],
                'last_page'    => $paginated['last_page'],
                'per_page'     => $paginated['per_page'],
                'total'        => $paginated['total'],
                'from'         => $paginated['from'],
                'to'           => $paginated['to'],
            ],
            'links' => [
                'first' => $paginated['first_page_url'],
                'last'  => $paginated['last_page_url'],
                'prev'  => $paginated['prev_page_url'],
                'next'  => $paginated['next_page_url'],
            ],
        ], Response::HTTP_OK);
    }
}
