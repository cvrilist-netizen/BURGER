# CHORSU BURGER — Firestore Security Spec

## 1. Data Invariants

- **Product Integrity**: Fast food product pricing, descriptions, and catalog items can ONLY be created, edited, or deleted by authenticated administrators (`isAdmin`). Customers have read-only access.
- **Price Tampering Prevention**: Client cannot order products with unconfirmed prices (`isPriceConfirmed == false`). Order creation verifies prices against current Firestore catalog prices.
- **Order Immutability & Status Transition**:
  - Any customer can create an order (`status == 'pending'`).
  - Total price and required order fields cannot be omitted or corrupted.
  - Only kitchen cooks (`isCook()`) or administrators (`isAdmin()`) can transition order status (`pending` -> `accepted` -> `preparing` -> `ready` -> `completed` / `cancelled`).
  - Cooks can only update `status` and `updatedAt` (`affectedKeys().hasOnly(['status', 'updatedAt'])`).
- **PII & Order Privacy**:
  - Unauthenticated users cannot scrape the full list of orders (`allow list: if isAdmin() || isCook() || (isSignedIn() && resource.data.customerId == request.auth.uid)`).
  - Individual orders can be tracked by matching ID.
- **Role Elevation Guard**:
  - Users cannot assign themselves `admin` or `cook` roles. Self-registration is restricted strictly to `customer`.

---

## 2. The "Dirty Dozen" Payloads (Adversarial Tests)

1. **Self-Escalation Attack**: Customer creates user role document with `role: "admin"`. -> *EXPECTED: PERMISSION_DENIED*
2. **Product Price Deflation Attack**: Unauthenticated user updates `Gamburger` price from 25000 to 100 UZS. -> *EXPECTED: PERMISSION_DENIED*
3. **Negative Price Order Attack**: Attacker attempts to create an order with `totalPrice: -50000`. -> *EXPECTED: PERMISSION_DENIED*
4. **Order Status Hijack Attack**: Unauthenticated customer directly updates order status to `completed`. -> *EXPECTED: PERMISSION_DENIED*
5. **Kitchen Data Corruption**: Cook attempts to modify `totalPrice` or `items` during status transition instead of only `status`. -> *EXPECTED: PERMISSION_DENIED*
6. **Admin Impersonation Attack**: User sends write to `/admins/{uid}` without admin authorization. -> *EXPECTED: PERMISSION_DENIED*
7. **Document ID Poisoning Attack**: Attacker injects a 50KB junk character string as `orderId`. -> *EXPECTED: PERMISSION_DENIED*
8. **Settings Vandalism Attack**: Customer updates restaurant phone number or delivery fee. -> *EXPECTED: PERMISSION_DENIED*
9. **Order Deletion Attack**: Cook attempts to delete order records instead of updating status. -> *EXPECTED: PERMISSION_DENIED*
10. **Order Bulk List Scrape**: Unauthenticated user requests full `orders` collection query without staff privileges. -> *EXPECTED: PERMISSION_DENIED*
11. **Shadow Field Injection**: User creates product with ghost field `__shadow_admin: true`. -> *EXPECTED: PERMISSION_DENIED*
12. **Status Shortcut Bypass**: Customer updates status of an order that has not been accepted. -> *EXPECTED: PERMISSION_DENIED*
