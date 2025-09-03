define([
  "../utils/env",
  "knockout",
  "ojs/ojarraydataprovider",
  "../models/customer",
  "ojs/ojvalidator-required",
  "ojs/ojvalidator-length",
  "ojs/ojvalidator-regexp",
  "ojs/ojvalidator-datetimerange",
  "ojs/ojlabel",
  "oj-c/input-text",
  "oj-c/input-number",
  "oj-c/form-layout",
  "oj-c/select-single",
  "oj-c/text-area",
  "ojs/ojbutton",
  "ojs/ojmessages",
], function(
  env,
  ko,
  ArrayDataProvider,
  Customer,
  RequiredValidator,
  lengthValidator,
  regexp
)  {
  class HomeViewModel {
    constructor(params) {
      
      
      console.log("params in before addupdatecustomer", params.params);
      const apiBaseUrl = env.apiBaseUrl;
      let method = "POST";
      let url = `${apiBaseUrl}/customers`;

      if (params.params.customerId!= undefined ) {
        method = "PUT";
        url = `${apiBaseUrl}/customers/${params.params.customerId}`;
        console.log(url);
      }
      console.log("params in after addupdatecustomer", params);

      // Status options
      this.statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ];
      this.statusOptionsDP = new ArrayDataProvider(this.statusOptions, {
        keyAttributes: "value",
      });

      // Form observables
      if(params.params.customerId!= undefined)
      {
      this.customer_name = ko.observable(
        "" || (params?.params?.customer_name ?? "")
      );
      this.mobile = ko.observable("" || (params?.params?.mobile ?? ""));
      this.email = ko.observable("" || (params?.params?.email ?? ""));
      this.address = ko.observable("" || (params?.params?.address ?? ""));
      this.aadharcardno = ko.observable(
        "" || (params?.params?.aadharcardno ?? "")
      );
      this.creditcardno = ko.observable(
        "" || (params?.params?.creditcardno ?? "")
      );
      this.balance = ko.observable(0 || (Number(params?.params?.balance) ?? 0));
      this.status = ko.observable(
        this.statusOptions[0].value ||
          (params?.params?.status ?? this.statusOptions[0].value)
      );
    }
    else{
      this.customer_name = ko.observable(
        "" 
      );
      this.mobile = ko.observable("" );
      this.email = ko.observable("" );
      this.address = ko.observable("");
      this.aadharcardno = ko.observable(
        "" 
      );
      this.creditcardno = ko.observable(
        "" 
      );
      this.balance = ko.observable(0 );
      this.status = ko.observable(
        this.statusOptions[0].value 
      );
    }
      // Validation state observables
      this.isSubmitting = ko.observable(false);
      this.showValidationErrors = ko.observable(false);

      // Messages for user feedback
      this.messagesDataProvider = ko.observableArray([]);

      // For displaying customer name in header
      this.fullName = ko.pureComputed(() => this.customer_name());
      const formData = params?.params;

      // ---------------------------------------------------

      // Validation computed observables with detailed messages
      this.customerNameValid = ko.pureComputed(() => {
        const name = this.customer_name();
        if (!name || name.trim() === "") {
          return { valid: false, message: "Customer name is required" };
        }
        if (name.trim().length < 2) {
          return {
            valid: false,
            message: "Customer name must be at least 2 characters",
          };
        }
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
          return {
            valid: false,
            message: "Customer name can only contain letters and spaces",
          };
        }
        return { valid: true, message: "" };
      });

      this.mobileValid = ko.pureComputed(() => {
        const mobile = this.mobile();
        if (!mobile) {
          return { valid: false, message: "Mobile number is required" };
        }
        if (!/^\d{10}$/.test(mobile)) {
          return {
            valid: false,
            message: "Mobile number must be exactly 10 digits",
          };
        }
        // Check for valid Indian mobile number patterns
        if (!/^[6-9]\d{9}$/.test(mobile)) {
          return {
            valid: false,
            message: "Please enter a valid Indian mobile number",
          };
        }
        return { valid: true, message: "" };
      });

      this.emailValid = ko.pureComputed(() => {
        const email = this.email();
        if (!email || email.trim() === "") {
          return { valid: false, message: "Email address is required" };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            valid: false,
            message: "Please enter a valid email address",
          };
        }
        return { valid: true, message: "" };
      });

      this.addressValid = ko.pureComputed(() => {
        const address = this.address();
        if (!address || address.trim() === "") {
          return { valid: false, message: "Address is required" };
        }
        if (address.trim().length < 10) {
          return {
            valid: false,
            message: "Address must be at least 10 characters",
          };
        }
        return { valid: true, message: "" };
      });

      this.aadhaarValid = ko.pureComputed(() => {
        const aadhaar = this.aadharcardno();
        if (!aadhaar) {
          return { valid: false, message: "Aadhaar number is required" };
        }
        if (!/^\d{12}$/.test(aadhaar)) {
          return {
            valid: false,
            message: "Aadhaar number must be exactly 12 digits",
          };
        }
        // Basic Aadhaar validation (Verhoeff algorithm would be ideal but complex)
        // if (/^(\d)\1{11}$/.test(aadhaar)) {
        //   return { valid: false, message: "Invalid Aadhaar number format" };
        // }
        return { valid: true, message: "" };
      });

      this.creditCardValid = ko.pureComputed(() => {
        const cc = this.creditcardno();
        if (cc && cc.length > 0) {
          // Remove spaces and dashes
          const cleanCC = cc.replace(/[\s-]/g, "");
          if (!/^\d{13,19}$/.test(cleanCC)) {
            return {
              valid: false,
              message: "Credit card number must be 13-19 digits",
            };
          }
          // Basic Luhn algorithm check
          // if (!this.luhnCheck(cleanCC)) {
          //   return { valid: false, message: "Invalid credit card number" };
          // }
        }
        return { valid: true, message: "" };
      });

      this.balanceValid = ko.pureComputed(() => {
        const balance = this.balance();
        if (balance < 0) {
          return { valid: false, message: "Balance cannot be negative" };
        }
        if (balance > 10000000) {
          return { valid: false, message: "Balance cannot exceed 1 crore" };
        }
        return { valid: true, message: "" };
      });

      // Overall form validity
      this.formValid = ko.pureComputed(() => {
        return (
          this.customerNameValid().valid &&
          this.mobileValid().valid &&
          this.emailValid().valid &&
          this.addressValid().valid &&
          this.aadhaarValid().valid &&
          this.creditCardValid().valid &&
          this.balanceValid().valid
        );
      });

      // Submit button state
      this.submitButtonDisabled = ko.pureComputed(() => {
        return !this.formValid() || this.isSubmitting();
      });

      // Helper method for Luhn algorithm (credit card validation)
      this.luhnCheck = (num) => {
        let arr = (num + "")
          .split("")
          .reverse()
          .map((x) => parseInt(x));
        let lastDigit = arr.splice(0, 1)[0];
        let sum = arr.reduce(
          (acc, val, i) =>
            i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9,
          0
        );
        sum += lastDigit;
        return sum % 10 === 0;
      };

      // Clear messages
      this.clearMessages = () => {
        this.messagesDataProvider.removeAll();
      };

      // Add message
      this.addMessage = (type, summary, detail) => {
        this.messagesDataProvider.push([
          {
            severity: type,
            summary: summary,
            detail: detail,
            autoTimeout: type === "confirmation" ? 5000 : 0,
          },
        ]);
        
      };
      // this.latestMessage = ko.pureComputed(() => {
      //   const messages = this.messagesDataProvider();
      //   if (messages.length > 0) {
      //     return messages[messages.length - 1].detail; // or .summary
      //   }
      //   return ""; // No message
      // });

      // Get validation error message for a field
      // this.getValidationMessage = (validationResult) => {
      //   return this.showValidationErrors() && !validationResult.valid
      //     ? validationResult.message
      //     : "";
      // };

      // ----------------------------all validations------------------------------
      this.requiredValidator = new RequiredValidator({
        hint: `this is required field`,
      });
      this.lengthValidator = new lengthValidator({
        min: 2,
        max: 20,
        hint: `name lenght should between 2 to 20 `,
      });
      this.adharLengthValidator = new lengthValidator({
        min: 12,
        max: 12,
        hint: `name lenght should 12 `,
      });
      this.creditLengthValidator = new lengthValidator({
        min: 16,
        max: 16,
        hint: `name lenght should 16 `,
      });
      this.regexpEmail = new regexp({
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        messageDetail: "enter correct email",
        hint: `format@example.com`,
      });
      this.phoneTypeValidator = new regexp({
        pattern: "^[6-9]\\d{9}$",
        messageDetail: "Enter correct Mobile Number",
        hint: `valid Indian mobile starting digits`,
      });
      this.cardNumberValidation = new regexp({
        pattern: "^[1-9]\\d*$",
        messageDetail: "Enter correct Number",
        hint: `only positive number is allowed`,
      });
      this.balanceValidation = new regexp({
        pattern: "^[1-9]\\d*(\\.\\d+)?$", // Positive number, no leading zeros
        hint: "Enter a balance greater than 1000",
        messageDetail: "Enter a valid balance (only positive numbers allowed)",
      });

      this.phoneLengthValidator = new lengthValidator({
        min: 10,
        max: 10,
        hint: `phone lenght should 10 `,
      });

      
      // Enhanced submit handler
      this.handleSubmit = async () => {
        console.log("=== FORM SUBMISSION START ===");

        // Clear previous messages
        this.clearMessages();
        this.showValidationErrors(true);

        // Check form validity
        if (!this.formValid()) {
          console.log("Form validation failed");

          // Collect all validation errors
          const errors = [];
          if (!this.customerNameValid().valid)
            errors.push(this.customerNameValid().message);
          if (!this.mobileValid().valid)
            errors.push(this.mobileValid().message);
          if (!this.emailValid().valid) errors.push(this.emailValid().message);
          if (!this.addressValid().valid)
            errors.push(this.addressValid().message);
          if (!this.aadhaarValid().valid)
            errors.push(this.aadhaarValid().message);
          if (!this.creditCardValid().valid)
            errors.push(this.creditCardValid().message);
          if (!this.balanceValid().valid)
            errors.push(this.balanceValid().message);
          
          this.addMessage(
            "error",
            "Validation Failed",
            "Please correct the following errors:\n" + errors.join("\n")
          );
          
          return;
        }


        this.isSubmitting(true);

        try {
          // Prepare customer data
          const customerData = {
            customer_name: this.customer_name().trim(),
            mobile: this.mobile(),
            email: this.email().trim().toLowerCase(),
            address: this.address().trim(),
            aadharcardno: this.aadharcardno(),
            creditcardno: this.creditcardno().replace(/[\s-]/g, ""), // Clean credit card number
            balance: Number(this.balance()),
            status: this.status(),
          };

          console.log("Submitting customer data:", customerData);

          // if (params?.params?.customerId) {
          //   const response = await fetch(
          //     apiBaseUrl + `/customers/${params?.params?.customerId}`,
          //     {
          //       method: "PUT",
          //       headers: {
          //         Authorization: "Basic YWRtaW46YWRtaW4xMjM=",
          //         "Content-Type": "application/json",
          //       },
          //       body: JSON.stringify(customerData),
          //     }
          //   );
          // } else {
          //   const response = await fetch(apiBaseUrl + "/customers", {
          //     method: "POST",
          //     headers: {
          //       Authorization: "Basic YWRtaW46YWRtaW4xMjM=",
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify(customerData),
          //   });
          // }
          // Send data to server
          const response = await fetch(url, {
            method: method,
            headers: {
              Authorization: "Basic YWRtaW46YWRtaW4xMjM=",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(customerData),
          });
          // const response = await fetch(apiBaseUrl + "/customers", {
          //   method: "POST",
          //   headers: {
          //     Authorization: "Basic YWRtaW46YWRtaW4xMjM=",
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify(customerData),
          // });

          const responseText = await response.text();
          console.log("Server response:", response.status, responseText);

          if (!response.ok) {
            let errorMessage = `Server returned ${response.status}: ${response.statusText}`;

            try {
              const errorData = JSON.parse(responseText);
              if (errorData.message) {
                errorMessage = errorData.message;
              } else if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch (parseError) {
              if (responseText) {
                errorMessage = responseText;
              }
            }

            throw new Error(errorMessage);
          }

          // Parse successful response
          let result;
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            result = responseText;
          }

          console.log("Customer created successfully:", result);

          // Show success message
          this.addMessage(
            "confirmation",
            "Success!",
            `Customer "${customerData.customer_name}" has been created successfully.`
          );

          // Clear form after successful submission
          this.resetForm();
        } catch (error) {
          
          console.error("Submission error:", error);
          this.addMessage(
            "error",
            "Submission Failed",
            error.message ||
              "An unexpected error occurred while creating the customer."
          );
        } finally {
          this.isSubmitting(false);
        }
      };

      // Reset form
      this.resetForm = () => {
        this.customer_name("");
        this.mobile("");
        this.email("");
        this.address("");
        this.aadharcardno("");
        this.creditcardno("");
        this.balance(0);
        this.status(this.statusOptions[0].value);
        this.showValidationErrors(false);

        // Clear messages after a delay
        setTimeout(() => {
          this.clearMessages();
        }, 3000);
      };

      // Format credit card number as user types
      this.formatCreditCard = (event) => {
        let value = event.target.value.replace(/\s/g, "").replace(/\D/g, "");
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        this.creditcardno(value);
      };

      // Format Aadhaar number as user types
      this.formatAadhaar = (event) => {
        let value = event.target.value.replace(/\s/g, "").replace(/\D/g, "");
        if (value.length > 12) value = value.substr(0, 12);
        value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
        this.aadharcardno(value.replace(/\s/g, ""));
      };
    }
  }

  return  HomeViewModel;
});
