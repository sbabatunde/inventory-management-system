<?php
// tests/Feature/Auth/AuthenticationTest.php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
  use RefreshDatabase, WithFaker;

  /** @test */
  public function user_can_login_with_valid_credentials()
  {
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'local',
      'email' => 'test@example.com',
      'password' => 'password123',
    ]);

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'message',
        'data' => [
          'user',
          'token',
          'token_type',
        ],
      ]);
  }

  /** @test */
  public function user_cannot_login_with_invalid_credentials()
  {
    $user = User::factory()->create([
      'email' => 'test@example.com',
      'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/v1/auth/login', [
      'method' => 'local',
      'email' => 'test@example.com',
      'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422)
      ->assertJson([
        'success' => false,
      ]);
  }

  /** @test */
  public function user_can_logout()
  {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $token,
    ])->postJson('/api/v1/auth/logout');

    $response->assertStatus(200)
      ->assertJson([
        'success' => true,
      ]);
  }

  /** @test */
  public function user_can_get_their_profile()
  {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
      'Authorization' => 'Bearer ' . $token,
    ])->getJson('/api/v1/auth/user');

    $response->assertStatus(200)
      ->assertJsonStructure([
        'success',
        'data' => [
          'user' => [
            'id',
            'name',
            'email',
          ],
        ],
      ]);
  }
}
