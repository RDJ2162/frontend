define([  '../utils/env','knockout', 'ojs/ojarraydataprovider', '../models/customer', 'ojs/ojlabel', 'oj-c/input-text', 'oj-c/input-number', 'oj-c/form-layout', "oj-c/select-single", "oj-c/text-area", "ojs/ojbutton"],
    (env,ko, ArrayDataProvider, Customer) => {

        class HomeViewModel {
            constructor(params) {
                const apiBaseUrl =  env.apiBaseUrl;
                // Status options (you can adjust as needed)
                this.statusOptions = [
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" } 
                ];
                this.statusOptionsDP = new ArrayDataProvider(this.statusOptions, { keyAttributes: "value" });

                this.customer_name = ko.observable("");
                this.mobile = ko.observable("");
                this.email = ko.observable("");
                this.address = ko.observable("");
                this.aadharcardno = ko.observable("");
                this.creditcardno = ko.observable("");
                this.balance = ko.observable(0);
                this.status = ko.observable(this.statusOptionsDP.data[0].value);
                console.log("Status Observable Initialized:", this.status());
                // For displaying customer name in header
                this.fullName = ko.pureComputed(() => this.customer_name());

                this.handleSubmit = () => {
                    // Add any validation you want here, for example mobile length check
                    if (this.mobile().length !== 10 || !/^\d{10}$/.test(this.mobile())) {
                        console.error("Mobile number must be exactly 10 digits");
                        return;
                    }

                    const customerData = new Customer();
                    customerData.customer_name(this.customer_name());
                    customerData.mobile(this.mobile());
                    customerData.email(this.email());
                    customerData.address(this.address());
                    customerData.aadharcardno(this.aadharcardno());
                    customerData.creditcardno(this.creditcardno());
                    customerData.balance(this.balance());
                    customerData.status(this.status());

                    console.log("Customer Data Submitted:", ko.toJS(customerData));

                    // Async submit function
                    async function submitData(customerData){
                        try {
                            console.log("Submitting customer data..."+customerData);
                            const response = await fetch(apiBaseUrl+'/customers', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(ko.toJS(customerData))
                            });

                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }

                            const result = await response.json();
                            console.log("Customer Data Submitted Successfully:", result);
                        } catch (error) {
                            console.error("Error submitting customer data:", error);
                        }
                    };
                    submitData(customerData);
                }
            }
        }

        return new HomeViewModel();
    });
