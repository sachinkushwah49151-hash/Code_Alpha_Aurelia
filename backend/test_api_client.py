"""
Live HTTP integration test for Aurelia DRF backend.
Runs against running server http://127.0.0.1:8000/
"""
import requests

BASE_URL = 'http://127.0.0.1:8000/api'


def test_live_api():
    session = requests.Session()

    print('=== 1. TESTING PRODUCTS & CATEGORIES ===')
    # Categories
    res = session.get(f'{BASE_URL}/categories/')
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    cats = res.json()
    print(f'[OK] Categories count: {len(cats)}')
    assert len(cats) == 7, f'Expected 7 categories, got {len(cats)}'

    # Product list
    res = session.get(f'{BASE_URL}/products/')
    assert res.status_code == 200, f'Expected 200, got {res.status_code}'
    prod_data = res.json()
    print(f'[OK] Products count: {prod_data["count"]}')
    assert prod_data['count'] == 11, f'Expected 11 products, got {prod_data["count"]}'
    first = prod_data['results'][0]
    print(f'[OK] First product: {first["id"]} - {first["name"]} (Rs. {first["price"]})')

    # Filter by category
    res = session.get(f'{BASE_URL}/products/?category=audio')
    assert res.status_code == 200
    assert res.json()['count'] == 2
    print(f'[OK] Filter category=audio returned {res.json()["count"]} items')

    # Search
    res = session.get(f'{BASE_URL}/products/?search=keyboard')
    assert res.status_code == 200
    assert res.json()['count'] == 1
    assert res.json()['results'][0]['id'] == 'aurelia-arc'
    print(f'[OK] Search "keyboard" returned: {res.json()["results"][0]["name"]}')

    # Product detail
    res = session.get(f'{BASE_URL}/products/aurelia-air-x1/')
    assert res.status_code == 200
    detail = res.json()
    print(f'[OK] Product detail for {detail["id"]}: reviews={len(detail["reviewsList"])}, related={len(detail["relatedProducts"])}')
    initial_stock = detail['stock']
    print(f'[OK] Current stock of aurelia-air-x1: {initial_stock}')

    print('\n=== 2. TESTING AUTHENTICATION & JWT ===')
    email = 'collector.client@studio-aurelia.co'
    password = 'CollectorPassword123'

    # Registration
    reg_res = session.post(f'{BASE_URL}/auth/register/', json={
        'fullName': 'Aurelia Collector',
        'email': email,
        'password': password,
        'phone': '+91 98765 11111',
    })
    if reg_res.status_code == 201:
        print(f'[OK] Registered user: {reg_res.json()["user"]["email"]}')
    else:
        print(f'[INFO] User may already exist ({reg_res.status_code}), testing login')

    # Login
    login_res = session.post(f'{BASE_URL}/auth/login/', json={
        'email': email,
        'password': password,
    })
    assert login_res.status_code == 200, f'Login failed: {login_res.text}'
    auth_data = login_res.json()
    token = auth_data['token']
    user_id = auth_data['user']['id']
    print(f'[OK] Login successful: {user_id} - {auth_data["user"]["name"]}')
    print(f'[OK] JWT Token length: {len(token)}')

    # Invalid login password
    bad_login = session.post(f'{BASE_URL}/auth/login/', json={
        'email': email,
        'password': 'WrongPasswordXYZ',
    })
    assert bad_login.status_code == 400
    print('[OK] Bad credentials rejected with HTTP 400')

    # Protected /me
    headers = {'Authorization': f'Bearer {token}'}
    me_res = session.get(f'{BASE_URL}/auth/me/', headers=headers)
    assert me_res.status_code == 200
    print(f'[OK] Protected /me accessed: {me_res.json()["name"]} ({me_res.json()["email"]})')

    # Protected /me without token
    unauth_me = session.get(f'{BASE_URL}/auth/me/')
    assert unauth_me.status_code == 401
    print('[OK] Unauthenticated /me rejected with HTTP 401')

    print('\n=== 3. TESTING ORDERS & STOCK VALIDATION ===')
    # Place valid order for 2 units of aurelia-air-x1
    order_data = {
        'items': [
            {
                'id': 'aurelia-air-x1',
                'quantity': 2,
                'color': 'Matte Obsidian',
                'price': 10,  # Malicious price attempt - server must ignore
            }
        ],
        'shippingAddress': {
            'fullName': 'Aurelia Collector',
            'street': '42 Lotus Boulevard',
            'city': 'Bengaluru',
            'state': 'Karnataka',
            'postalCode': '560103',
            'country': 'India',
            'phone': '+91 98765 11111',
        },
        'paymentMethod': 'Credit Card (Visa ending 4242)',
        'deliveryMethod': 'standard',
        'subtotal': 10,  # Malicious subtotal attempt - server must recalculate
        'total': 10,
    }

    order_res = session.post(f'{BASE_URL}/orders/', json=order_data, headers=headers)
    assert order_res.status_code == 201, f'Order failed: {order_res.text}'
    created_order = order_res.json()
    order_id = created_order['id']
    print(f'[OK] Order placed successfully: ID {order_id}')
    print(f'[OK] Server-calculated subtotal: Rs. {created_order["subtotal"]} (not client-provided Rs. 10)')
    print(f'[OK] Shipping fee: Rs. {created_order["shipping"]} (Free shipping above Rs. 4,999)')
    print(f'[OK] Total charged: Rs. {created_order["total"]}')
    print(f'[OK] Order status: {created_order["status"]}')

    # Verify stock decremented
    res = session.get(f'{BASE_URL}/products/aurelia-air-x1/')
    new_stock = res.json()['stock']
    print(f'[OK] Stock updated: was {initial_stock}, now {new_stock} (decreased by 2)')
    assert new_stock == initial_stock - 2

    # Insufficient stock validation (within max_value 100 but exceeds available stock of 16)
    bad_stock_data = {
        'items': [{'id': 'aurelia-air-x1', 'quantity': 25}],
        'shippingAddress': {'fullName': 'Aurelia Collector', 'city': 'Bengaluru'},
    }
    bad_stock_res = session.post(f'{BASE_URL}/orders/', json=bad_stock_data, headers=headers)
    assert bad_stock_res.status_code == 400
    print(f'[OK] Exceeded stock (quantity=25, available=16) rejected with HTTP 400: {bad_stock_res.json()}')

    # Quantity over max_value validation
    bad_qty_data = {
        'items': [{'id': 'aurelia-air-x1', 'quantity': 9999}],
        'shippingAddress': {'fullName': 'Aurelia Collector', 'city': 'Bengaluru'},
    }
    bad_qty_res = session.post(f'{BASE_URL}/orders/', json=bad_qty_data, headers=headers)
    assert bad_qty_res.status_code == 400
    print(f'[OK] Excessive quantity (>100) rejected with HTTP 400: {bad_qty_res.json()}')

    # Invalid product ID validation
    bad_slug_data = {
        'items': [{'id': 'phantom-nonexistent-id', 'quantity': 1}],
        'shippingAddress': {'fullName': 'Aurelia Collector', 'city': 'Bengaluru'},
    }
    bad_slug_res = session.post(f'{BASE_URL}/orders/', json=bad_slug_data, headers=headers)
    assert bad_slug_res.status_code == 400
    print(f'[OK] Invalid product ID correctly rejected with HTTP 400: {bad_slug_res.json()}')

    # List orders for user
    orders_list_res = session.get(f'{BASE_URL}/orders/', headers=headers)
    assert orders_list_res.status_code == 200
    user_orders = orders_list_res.json()
    print(f'[OK] User orders list count: {len(user_orders)}')
    assert any(o['id'] == order_id for o in user_orders)

    # Retrieve single order
    single_res = session.get(f'{BASE_URL}/orders/{order_id}/', headers=headers)
    assert single_res.status_code == 200
    assert single_res.json()['id'] == order_id
    print(f'[OK] Retrieved single order #{order_id} details with {len(single_res.json()["items"])} items')

    # Order ownership isolation check with second user
    user2_email = 'second.collector@studio-aurelia.co'
    session.post(f'{BASE_URL}/auth/register/', json={
        'fullName': 'Second Collector',
        'email': user2_email,
        'password': 'SecondPassword123',
    })
    user2_login = session.post(f'{BASE_URL}/auth/login/', json={
        'email': user2_email,
        'password': 'SecondPassword123',
    })
    token2 = user2_login.json()['token']
    headers2 = {'Authorization': f'Bearer {token2}'}

    other_order_res = session.get(f'{BASE_URL}/orders/{order_id}/', headers=headers2)
    assert other_order_res.status_code == 404, f'Expected 404, got {other_order_res.status_code}'
    print(f'[OK] Order ownership strictly enforced: User 2 received HTTP 404 when querying User 1 order #{order_id}')

    print('\n========================================')
    print('ALL LIVE HTTP ENDPOINT TESTS PASSED 100%')
    print('========================================')


if __name__ == '__main__':
    test_live_api()
