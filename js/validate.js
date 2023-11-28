function validate(formSelector) {
  let _this = this;
  let formRules = {};

  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  let validateRules = {
    required: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập họ tên";
    },
    checkName: function (value) {
      let regex = /^[\p{L} ]+$/u;
      return regex.test(value)
        ? undefined
        : "Họ tên không được chứa số, các kí tự đặc biệt";
    },
    email: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập email";
    },
    checkEmail: function (value) {
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "Cú pháp email không đúng";
    },
    min: function (min) {
      return function (value) {
        return value.trim().length >= min
          ? undefined
          : `Vui lòng nhập ít nhất ${min} kí tự`;
      };
    },
    optional: function (value) {
      return value.trim() ? undefined : "";
    },
    phone: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập số điện thoại";
    },
    checkPhone: function (value) {
      let regex = /[a-zA-Z0-9]/g;
      return regex.test(value)
        ? undefined
        : "Bao gồm số và chữ, không chứa kí tự đặc biệt";
    },
    province: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập Tỉnh/TP";
    },
    district: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập Quận/Huyện";
    },
    ward: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập Phường/Xã";
    },
    home: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập Số nhà";
    },
  };
  let formElement = document.querySelector(formSelector);

  if (formElement) {
    let inputs = formElement.querySelectorAll("[name][rules]");

    for (let input of inputs) {
      let rules = input.getAttribute("rules").split("|");

      for (let rule of rules) {
        let isRuleHasValue = rule.includes(":");
        let ruleInfo;

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        let ruleFunc = validateRules[rule];

        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }
      }

      input.onblur = handleValidate;
      input.oninput = handClearError;
    }

    function handleValidate(e) {
      let rules = formRules[e.target.name];
      let errorMessage;

      for (let rule of rules) {
        errorMessage = rule(e.target.value);
        if (errorMessage) break;
      }

      if (errorMessage) {
        let formGroup = getParent(e.target, ".form__group");
        if (formGroup) {
          formGroup.classList.add("Invalid");
          let formMessage = formGroup.querySelector(".erro-message");
          if (formMessage) {
            formMessage.innerHTML = errorMessage;
          }
        }
      }

      return !errorMessage;
    }

    function handClearError(e) {
      let formGroup = getParent(e.target, ".form__group");
      if (formGroup.classList.contains("Invalid")) {
        formGroup.classList.remove("Invalid");
        let formMessage = formGroup.querySelector(".erro-message");

        if (formMessage) {
          formMessage.innerHTML = "";
        }
      }
    }
  }

  formElement.onsubmit = function (e) {
    e.preventDefault();
    let inputs = formElement.querySelectorAll("[name][rules]");
    let isValid = true;
    for (let input of inputs) {
      if (!handleValidate({ target: input })) {
        isValid = false;
      }
    }
    if (isValid) {
      if (typeof _this.onsubmit === "function") {
        let formValues = Array.from(formElement.querySelectorAll("[name]")).reduce(
          function (values, input) {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = "";
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
          },
          {}
        );
        _this.onsubmit(formValues);
      } else {
        formElement.submit();
      }
    }
  };
}
