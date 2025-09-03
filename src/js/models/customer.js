define(["knockout"], (ko) => {
  class Customer {
    constructor() {
      this.customer_name = ko.observable("");
      this.email = ko.observable("");
      this.mobile = ko.observable("");
      this.address = ko.observable("");
      this.aadharcardno = ko.observable("");
      this.creditcardno = ko.observable("");
      this.balance = ko.observable(0);
      this.status = ko.observable("");
    }
  }

  return Customer;
});
