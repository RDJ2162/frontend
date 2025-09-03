/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
// define(['../accUtils',
//   "knockout",
//   "ojs/ojmutablearraydataprovider",
//   "ojs/ojdataprovider",
//   "ojs/ojlistdataproviderview",
//   "ojs/ojpagingdataproviderview",
//   "ojs/ojarraydataprovider",
//   "ojs/ojtable",
//   "oj-c/input-text",
//   "ojs/ojpagingcontrol"
// ],
// function(accUtils,
//   ko,
//   MutableArrayDataProvider,
//   ojdataprovider_1,
//   ListDataProviderView,
//   PagingDataProviderView,
//   ArrayDataProvider
// ) {
//   function TransactionByIdViewModel(params) {
//     console.log("TransactionByIdViewModel params:", params.params.id);
    
//     const self = this;

//     self.data = ko.observableArray([]);

//     self.mutableArrayDataProvider = new MutableArrayDataProvider(self.data(), {
//       keyAttributes: "transaction_id",
//     });
//     self.dataProvider = new ListDataProviderView(self.mutableArrayDataProvider);

//     // Extracts last part from hash: e.g. #/transactions/10 → 10
//     function getCustomerIdFromURL() {
//       let parts = window.location.hash.split("/");
//       return parts.length >= 3 ? parts[2] : null;
//     }

//     // Filter handler
//     self.handleRawValueChanged = (event) => {
//       let rawValue = event.detail.value;

//       if (!rawValue) {
//         self.dataProvider.filterCriterion = undefined;
//         return;
//       }

//       const filter = ojdataprovider_1.FilterFactory.getFilter({
//         filterDef: {
//           op: "$or",
//           criteria: [
//             { attribute: "transaction_id", op: "$co", value: rawValue },
//             { attribute: "billamount", op: "$co", value: rawValue },
//             { attribute: "transactionDate", op: "$co", value: rawValue },
//             { attribute: "customer_name", op: "$co", value: rawValue },
//             { attribute: "product_code", op: "$co", value: rawValue },
//           ],
//         },
//       });

//       self.dataProvider.filterCriterion = filter;
//     };

//     // Fetch transactions by customerId on route load
//     this.connected = async () => {
//       const customerId = params.params.id || getCustomerIdFromURL();

//       if (!customerId) {
//         console.error("No customer ID provided in URL.");
//         return;
//       }

//       try {
//         const url = `http://localhost:8080/transactions/customer/${customerId}`; // corrected URL
//         let response = await fetch(url);
//         let result = await response.json();
//         console.log("Transactions for customer", customerId, result);

//         // Flatten nested fields for easier filtering and display
//         const flatData = result.map(item => ({
//           ...item,
//           customer_name: item.customer?.customer_name || "",
//           product_code: item.product?.product_code || "",
//         }));

//         self.data(flatData);

//         // Re-create data providers to update the binding
//         self.mutableArrayDataProvider = new MutableArrayDataProvider(self.data(), {
//           keyAttributes: "transaction_id",
//         });
//         self.dataProvider = new ListDataProviderView(self.mutableArrayDataProvider);

//       } catch (error) {
//         console.error("Failed to fetch transaction data:", error);
//       }
//     };

//     this.disconnected = () => {};
//     this.transitionCompleted = () => {};
//   }
//   return TransactionByIdViewModel;
// });


define([
  '../utils/env',
  '../accUtils',
  "knockout",
  "ojs/ojmutablearraydataprovider",
  "ojs/ojdataprovider",
  "ojs/ojlistdataproviderview",
  "ojs/ojpagingdataproviderview",
  "ojs/ojarraydataprovider",
  "ojs/ojtable",
  "oj-c/input-text",
  "ojs/ojpagingcontrol"
],
function(
  env,
  accUtils,
  ko,
  MutableArrayDataProvider,
  ojdataprovider_1,
  ListDataProviderView,
  PagingDataProviderView,
  ArrayDataProvider
) {
//   function TransactionByIdViewModel(params) {
//     const self = this;

//     self.data = ko.observableArray([]);

//     self.mutableArrayDataProvider = new MutableArrayDataProvider(self.data(), {
//       keyAttributes: "transaction_id",
//     });
//     self.dataProvider = new ListDataProviderView(self.mutableArrayDataProvider);

//     // Optional fallback for URL parsing
//     function getCustomerIdFromURL() {
//       let parts = window.location.hash.split("/");
//       return parts.length >= 3 ? parts[2] : null;
//     }

//     // Filter logic
//     self.handleRawValueChanged = (event) => {
//       let rawValue = event.detail.value;

//       if (!rawValue) {
//         self.dataProvider.filterCriterion = undefined;
//         return;
//       }

//       const filter = ojdataprovider_1.FilterFactory.getFilter({
//         filterDef: {
//           op: "$or",
//           criteria: [
//             { attribute: "transaction_id", op: "$co", value: rawValue },
//             { attribute: "billamount", op: "$co", value: rawValue },
//             { attribute: "transactionDate", op: "$co", value: rawValue },
//             { attribute: "customer_name", op: "$co", value: rawValue },
//             { attribute: "product_name", op: "$co", value: rawValue },
//             { attribute: "product_code", op: "$co", value: rawValue },
//             { attribute: "brand_name", op: "$co", value: rawValue }
//           ],
//         },
//       });

//       self.dataProvider.filterCriterion = filter;
//     };

//     // Fetch transactions for customerId
//     this.connected = async () => {
//       const customerId = params?.params?.id || getCustomerIdFromURL();

//       if (!customerId) {
//         console.error("No customer ID provided.");
//         return;
//       }

//       try {
//         const url = `http://localhost:8080/transactions/customer/${customerId}`;
//         const response = await fetch(url);
//         const result = await response.json();
// console.log("Fetched transactions:", result);

//         // Flatten nested fields for display and filtering
//         const flatData = result.map(item => ({
//       transaction_id: item.transaction_id,
//       transactionDate: item.transactionDate,
//       billamount: item.billamount,
//       quantity: item.quantity,

//       // Flatten customer fields
//       customer_name: item.customer?.customer_name || "",
//       mobile: item.customer?.mobile || "",
//       email: item.customer?.email || "",
//       address: item.customer?.address || "",
//       status: item.customer?.status || "",

//       // Flatten product fields
//       product_code: item.product?.product_code || "",
//       product_name: item.product?.product_name || "",
//       brand_name: item.product?.brand_name || "",
//       unit_price: item.product?.unit_price || "",
//     }));
//         self.data(flatData);
//         console.log("Processed flat data:", flatData);
        

//         // Re-assign data provider
//         self.mutableArrayDataProvider = new MutableArrayDataProvider(self.data(), {
//           keyAttributes: "transaction_id",
//         });
//         self.dataProvider = new ListDataProviderView(self.mutableArrayDataProvider);
//       } catch (err) {
//         console.error("Failed to fetch data:", err);
//       }
//     };

//     this.disconnected = () => {};
//     this.transitionCompleted = () => {};
//   }

function TransactionByIdViewModel(params) {
  const apiBaseUrl =  env.apiBaseUrl;
      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      self.data = ko.observableArray([]);
    // self.dataprovider = ko.observable();

    // self.dataprovider=new MutableArrayDataProvider(self.data(), {
    //           keyAttributes: 'customerId' 
    //         });

    self.mutableArrayDataProvider = new MutableArrayDataProvider(self.data(), {
      keyAttributes: "transaction_id",
    });
    self.dataProvider = new ListDataProviderView(self.mutableArrayDataProvider);
    // self.pagingDataProvider =new PagingDataProviderView(new ArrayDataProvider(self.data(), {
    //   keyAttributes: "customerId",
    // }));
    // console.log( self.pagingDataProvider);
    self.handleRawValueChanged = (event) => {
  let rawValue = event.detail.value;

  console.log("Filter text:", rawValue);

  if (!rawValue) {
    self.dataProvider.filterCriterion = undefined;
    return;
  }

  const filter = ojdataprovider_1.FilterFactory.getFilter({
    filterDef: {
      op: "$or",
      criteria: [
        {
          attribute: "transaction_id",
          op: "$co", // contains
          value: rawValue,
        },
        {
          attribute: "billamount",
          op: "$co",
          value: rawValue,
        },
        {
          attribute: "transactionDate",
          op: "$co",
          value: rawValue,
        },
        {
          attribute: "customer.customer_name",
          op: "$co",
          value: rawValue,
        },
        {
          attribute: "product.product_code",
          op: "$co",
          value: rawValue,
        },
      ],
    },
  });

  self.dataProvider.filterCriterion = filter;
};


    this.connected = async () => {
      // accUtils.announce("Customers page loaded.", "assertive");
      // document.title = "Customers";
       const customerId = params?.params?.id || getCustomerIdFromURL();
      let response = await fetch(`${apiBaseUrl}/transactions/customer/${customerId}`);
      let data = await response.json();
      console.log(data);

      self.data(data); // Keep nested structure
      // self.dataprovider(new MutableArrayDataProvider(self.data(), {
      //   keyAttributes: 'customerId'
      // }));
      // self.dataprovider.data = self.data();
      self.mutableArrayDataProvider.data = self.data();
      
      // Implement further logic if needed
    };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }
  return TransactionByIdViewModel;
});


