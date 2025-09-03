/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your about ViewModel code goes here
 */
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
    function AboutViewModel() {
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
      let response = await fetch(apiBaseUrl+"/transactions");
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

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return AboutViewModel;
  }
);
