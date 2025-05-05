public with sharing class AgGridDataController {
    @AuraEnabled(cacheable=true)
    public static List<Map<String, Object>> getGridData() {
        List<Map<String, Object>> data = new List<Map<String, Object>>();

        // Fetch 5 Account records via SOQL
        List<Account> accounts = [SELECT Name, AccountNumber, Owner.Name, AnnualRevenue, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, Phone 
                                   FROM Account 
                                   LIMIT 5];

        for (Account acc : accounts) {
            Map<String, Object> accountData = new Map<String, Object>();
            accountData.put('Name', acc.Name);
            accountData.put('AccountNumber', acc.AccountNumber);
            accountData.put('OwnerName', acc.Owner.Name); // Access Owner Name
            accountData.put('AnnualRevenue', acc.AnnualRevenue);
            // Construct Billing Address String
            String billingAddress = '';
            if (acc.BillingStreet != null) billingAddress += acc.BillingStreet + ', ';
            if (acc.BillingCity != null) billingAddress += acc.BillingCity + ', ';
            if (acc.BillingState != null) billingAddress += acc.BillingState + ' ';
            if (acc.BillingPostalCode != null) billingAddress += acc.BillingPostalCode + ', ';
            if (acc.BillingCountry != null) billingAddress += acc.BillingCountry;
            // Remove trailing comma and space if present
            if (billingAddress.endsWith(', ')) {
                billingAddress = billingAddress.substring(0, billingAddress.length() - 2);
            }
            accountData.put('BillingAddress', billingAddress);
            accountData.put('Phone', acc.Phone);
            data.add(accountData);
        }

        // Create 10 static map entries
        for (Integer i = 1; i <= 10; i++) {
            data.add(new Map<String, Object>{
                'Name' => 'Static Account ' + i,
                'AccountNumber' => 'SA-' + String.valueOf(1000 + i),
                'OwnerName' => 'Static Owner ' + i,
                'AnnualRevenue' => 100000 * i,
                'BillingAddress' => i + ' Static St, Static City, ST 12345, USA',
                'Phone' => '555-01' + String.valueOf(i).leftPad(2, '0')
            });
        }

        return data;
    }
}