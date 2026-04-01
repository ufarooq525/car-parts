<?php

namespace App\Modules\User\Controllers;

use App\Core\Controllers\BaseController;
use App\Modules\User\Repositories\UserRepository;
use App\Modules\User\Requests\UpdateUserRequest;
use App\Modules\User\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    public function __construct(
        protected UserRepository $repository,
    ) {}

    /**
     * List users (admin, filtered + paginated).
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'role', 'is_active', 'sort_by', 'sort_order']);
        $perPage = (int) $request->get('per_page', 15);

        $users = $this->repository->getFilteredUsers($filters, $perPage);

        return $this->paginatedResponse(
            UserResource::collection($users),
            'user::messages.users_listed',
        );
    }

    /**
     * Show a single user.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->repository->findByIdOrFail($id, ['*'], []);

        return $this->successResponse(
            new UserResource($user->loadCount('orders')),
            'user::messages.user_found',
        );
    }

    /**
     * Update a user.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->repository->findByIdOrFail($id);

        $user->update($request->validated());

        return $this->successResponse(
            new UserResource($user->fresh()),
            'user::messages.user_updated',
        );
    }

    /**
     * Delete a user.
     */
    public function destroy(int $id): JsonResponse
    {
        $user = $this->repository->findByIdOrFail($id);

        $user->delete();

        return $this->noContentResponse('user::messages.user_deleted');
    }
}
