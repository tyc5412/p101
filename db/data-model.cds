namespace demo.purchase;


entity Purchases {
key ID : UUID;
title : String(200);
amount : Decimal(13,2);
currency : String(3);
requester : String(100);
approver : String(100);
status : String(20); // CREATED, SUBMITTED, APPROVED, REJECTED
createdAt : Timestamp;
}
