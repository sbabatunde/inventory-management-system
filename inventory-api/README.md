# Inventory & Equipment Release Management API Documentation

## Base URL
http://localhost:8000/api/v1

text

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "method": "local", // or "crm"
  "email": "admin@inventory.com",
  "password": "password"
}
Response
json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@inventory.com",
      "roles": ["super-admin"],
      "permissions": ["view-users", "create-users"]
    },
    "token": "1|abcdef123456",
    "token_type": "Bearer"
  }
}
Authenticated Requests
http
GET /inventory/stores
Authorization: Bearer 1|abcdef123456
Available Endpoints
Core Module
Method	Endpoint	Description
GET	/dashboard/stats	Get dashboard statistics
GET	/users	List users
POST	/users	Create user
GET	/users/{id}	Get user details
PUT	/users/{id}	Update user
DELETE	/users/{id}	Delete user
GET	/profile	Get current user profile
PUT	/profile	Update profile
GET	/settings	Get settings
POST	/settings	Update settings
GET	/notifications	Get notifications
Inventory Module
Method	Endpoint	Description
GET	/inventory/stores	List stores
POST	/inventory/stores	Create store
GET	/inventory/stores/{id}	Get store
PUT	/inventory/stores/{id}	Update store
DELETE	/inventory/stores/{id}	Delete store
GET	/inventory/stock-items	List stock items
POST	/inventory/stock-items	Create stock item
GET	/inventory/stock-transfers	List transfers
POST	/inventory/stock-transfers	Create transfer
GET	/inventory/stock-adjustments	List adjustments
POST	/inventory/stock-adjustments	Create adjustment
GET	/inventory/stock-movements	List movements
Release Forms Module
Method	Endpoint	Description
GET	/release-forms	List forms
POST	/release-forms	Create form
GET	/release-forms/{id}	Get form
PUT	/release-forms/{id}	Update form
POST	/release-forms/{id}/submit	Submit for approval
POST	/release-forms/{id}/approve	Approve form
POST	/release-forms/{id}/dispatch	Dispatch form
POST	/release-forms/{id}/complete	Complete form
POST	/release-forms/{id}/reject	Reject form
POST	/release-forms/{id}/cancel	Cancel form
POST	/release-forms/manual/create	Create manual entry
POST	/release-forms/{id}/reconcile	Reconcile manual form
Assets Module
Method	Endpoint	Description
GET	/assets	List assets
POST	/assets	Create asset
GET	/assets/{id}	Get asset
PUT	/assets/{id}	Update asset
DELETE	/assets/{id}	Delete asset
POST	/assets/{id}/assign	Assign asset
POST	/assets/{id}/unassign	Unassign asset
POST	/assets/{id}/depreciation	Calculate depreciation
Procurement Module
Method	Endpoint	Description
GET	/procurement/suppliers	List suppliers
POST	/procurement/suppliers	Create supplier
GET	/procurement/purchase-requisitions	List requisitions
POST	/procurement/purchase-requisitions	Create requisition
GET	/procurement/purchase-orders	List orders
POST	/procurement/purchase-orders	Create order
POST	/procurement/purchase-orders/{id}/send	Send order
POST	/procurement/purchase-orders/{id}/receive	Receive goods
Reporting Module
Method	Endpoint	Description
GET	/reports/cost-breakdown	Cost breakdown report
GET	/reports/inventory	Inventory valuation
GET	/reports/stock-movement	Stock movement summary
GET	/reports/low-stock	Low stock items
GET	/reports/supplier-performance	Supplier performance
POST	/reports/export	Export report
Error Responses
Validation Error (422)
json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
Unauthorized (401)
json
{
  "success": false,
  "message": "Unauthenticated"
}
Not Found (404)
json
{
  "success": false,
  "message": "Resource not found"
}
Rate Limiting
60 requests per minute per user

Can be configured in .env

Pagination
All list endpoints support pagination:

text
GET /api/v1/inventory/stores?page=1&per_page=15
Filtering
Common filters available:

search - Search by name/code

status - Filter by status

type - Filter by type

date_from - Filter by start date

date_to - Filter by end date

text

### 8. Generate Swagger Documentation

```bash
# Generate Swagger docs
php artisan l5-swagger:generate

# Access Swagger UI
# http://localhost:8000/api/documentation
9. Postman Collection File
Save the Postman JSON above as postman_collection.json in your project root.

10. Update .env for Swagger
env
# Swagger Configuration
L5_SWAGGER_GENERATE_ALWAYS=true
L5_SWAGGER_UI_DARK_MODE=true
L5_SWAGGER_UI_DOC_EXPANSION=none
L5_SWAGGER_UI_FILTERS=true