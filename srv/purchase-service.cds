using {demo.purchase as purchase} from '../db/data-model';


service PurchaseService {
    entity Purchases as projection on purchase.Purchases;
    action submitForApproval(purchaseId: UUID) returns String;
}
