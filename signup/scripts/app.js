// SELECTED ELEMENTS
const globalSelection = {
  enterFirstname: document.querySelector("#enter-firstname"),
  enterLastname: document.querySelector("#enter-lastname"),
  enterDOB: document.querySelectorAll(".enter-dob"),
  enterEmail: document.querySelector("#enter-email"),
  enterPassword: document.querySelector("#enter-password"),
  checkBox: document.querySelector("#t-and-c"),
  submitButton: document.querySelector("#submit-button"),
  showPassword: document.querySelector(".show-password"),
  hidePassword: document.querySelector(".hide-password"),
  entries: {
    firstName: false,
    lastName: false,
    DOB: false,
    email: false,
    password: false,
    checkBox: false,
  },
  criteria: {
    firstName: /./,
    lastName: /.*/,
    email: /^\w(([\w\.-]+)\w)?@(\w+)(\.\w+)(\.\w+)?$/,
    password: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{10,}$/,
  },
  passwordLevel: 0,
  passwordStrength: {
    caps: false,
    low: false,
    num: false,
    spec: false,
    length: false,
    whitespace: false,
  },
  userDetails: new Object(),
};

// INPUT ONFOCUS UI
(() => {
  const { enterFirstname, enterLastname, enterEmail, enterPassword } =
    globalSelection;

  const inputOnFocusUI = inputField => {
    inputField.addEventListener("focus", () => {
      inputField.parentElement.classList.add("input-onfocus");
      inputField.parentElement.classList.remove("invalid-syntax");
    });
  };
  inputOnFocusUI(enterFirstname);
  inputOnFocusUI(enterLastname);
  inputOnFocusUI(enterEmail);
  inputOnFocusUI(enterPassword);
})();

// INPUT VALIDATION
const inputValidation = (criteria1, enterValue, entry, inputField) => {
  const { entries } = globalSelection;
  if (criteria1.test(enterValue)) {
    entries[entry] = true;
    inputField.parentElement.classList.add("valid-syntax");
    inputField.nextElementSibling.classList.remove("input-directive-active");
  } else {
    entries[entry] = false;
    inputField.parentElement.classList.remove("valid-syntax");
    inputField.parentElement.classList.add("invalid-syntax");
    inputField.parentElement.lastElementChild.classList.add(
      "input-directive-active"
    );
    if (inputField.classList.contains("enter-password")) {
      document.querySelector(".password-rule").style.color = "#fc4d4d";
    }
  }
};
const validateDOB = dob => {
  const { entries, enterDOB } = globalSelection;
  entries.DOB = true;
  enterDOB[0].classList.add("valid-syntax");
  enterDOB[1].classList.add("valid-syntax");
  enterDOB[2].classList.add("valid-syntax");
  dob.parentElement.lastElementChild.classList.remove("input-directive-active");
};

// validate First Name, Last Name, Email, Password
(() => {
  const {
    enterFirstname,
    enterLastname,
    enterEmail,
    enterPassword,
    criteria: { firstName, lastName, email, password },
  } = globalSelection;

  const listenBlur = (
    inputField,
    inputValidation,
    criteria,
    entry,
    extraCondition
  ) => {
    inputField.addEventListener("blur", () => {
      inputValidation(criteria, inputField.value, entry, inputField);
      extraCondition && extraCondition();
    });
  };

  listenBlur(enterFirstname, inputValidation, firstName, "firstName");

  listenBlur(enterLastname, inputValidation, lastName, "lastName", () => {
    if (enterLastname.value === "") {
      enterLastname.parentElement.classList.remove("valid-syntax");
      enterLastname.parentElement.classList.remove("input-onfocus");
    }
  });

  listenBlur(enterEmail, inputValidation, email, "email", () => {
    if (enterEmail.value === "") {
      enterEmail.parentElement.lastElementChild.innerText =
        "field cannot be empty";
    } else {
      enterEmail.parentElement.lastElementChild.innerText =
        "invalid email syntax";
    }
  });

  listenBlur(enterPassword, inputValidation, password, "password", () => {
    if (/\s/.test(enterPassword.value)) {
      entries.password = false;
      document.querySelector(".password-rule").style.color = "#fc4d4d";
      enterPassword.parentElement.classList.remove("valid-syntax");
      enterPassword.parentElement.classList.add("invalid-syntax");
    }
  });
})();

// Validate Checkbox
(() => {
  const { checkBox, entries, submitButton, enterFirstname, enterLastname } =
    globalSelection;
  checkBox.addEventListener("click", () => {
    if (checkBox.checked) {
      entries.checkBox = true;
      checkBox.parentElement.classList.remove("invalid-syntax");
      submitButton.classList.add("submit-button-active");
      checkBox.value = `I, ${enterFirstname.value} ${enterLastname.value} have read and accepted the terms and conditions`;
    } else {
      entries.checkBox = false;
      submitButton.classList.remove("submit-button-active");
    }
  });
})();

// CREATE DOB OPTIONS
(() => {
  let dayOption = false;
  let yearOption = false;
  const { enterDOB, entries } = globalSelection;
  function dateOfBirth(dob, selectedOption, clssName, specify, num, limit) {
    dob.addEventListener("click", () => {
      if (dob.classList.contains(clssName) && !selectedOption) {
        dob.innerHTML = `<option disabled selected>${specify}</option>`;
        for (let i = num; i <= limit; i++) {
          dob.innerHTML += `<option value="${i}">${i}</option>`;
        }
        selectedOption = true;
        return selectedOption;
      }
    });
  }
  enterDOB.forEach(dob => {
    dateOfBirth(dob, dayOption, "dob-day", "Day", 1, 31);
    dateOfBirth(dob, yearOption, "dob-year", "Year", 1934, 2024);
    dob.addEventListener("change", () => {
      const userDOB = new Date(
        `${enterDOB[0].value} ${enterDOB[1].value} ${enterDOB[2].value}`
      ).getTime();
      if (
        enterDOB[0].value != "Day" &&
        enterDOB[1].value != "Month" &&
        new Date(new Date() - 568080000000) > userDOB
      ) {
        validateDOB(dob);
      } else if (
        enterDOB[0].value != "Day" &&
        enterDOB[1].value != "Month" &&
        new Date(new Date() - 568080000000) < userDOB
      ) {
        entries.DOB = false;
        enterDOB[0].classList.remove("valid-syntax");
        enterDOB[1].classList.remove("valid-syntax");
        enterDOB[2].classList.remove("valid-syntax");
        enterDOB[0].classList.add("invalid-syntax");
        enterDOB[1].classList.add("invalid-syntax");
        enterDOB[2].classList.add("invalid-syntax");
        dob.parentElement.lastElementChild.classList.add(
          "input-directive-active"
        );
      } else {
        entries.DOB = false;
      }
      dob.style.color = "black";
    });
  });
})();

// PASSWORD ACCESSORIES (UX)
(() => {
  const { enterPassword, showPassword, hidePassword, passwordStrength } =
    globalSelection;
  let { passwordLevel } = globalSelection;

  // Password-Visibility
  const passwordVisibility = (icon, type, otherIcon) => {
    icon.addEventListener("click", () => {
      icon.classList.add("toggle-visibility-icon");
      enterPassword.setAttribute("type", type);
      otherIcon.classList.remove("toggle-visibility-icon");
    });
  };
  passwordVisibility(showPassword, "text", hidePassword);
  passwordVisibility(hidePassword, "password", showPassword);

  // Password Strength Gauge
  enterPassword.addEventListener("focus", () => {
    document.querySelector(".password-meter").classList.add("meter-gauge");
  });

  passwordStrength.count = function (criteria, check, num) {
    if (criteria.test(enterPassword.value) && this[check] === false) {
      passwordLevel += num;
      this[check] = true;
    } else if (!criteria.test(enterPassword.value) && this[check] === true) {
      passwordLevel -= num;
      this[check] = false;
    }
  };
  passwordStrength.meter = function (num, levelColor) {
    if (passwordLevel === num) {
      enterPassword.parentElement.lastElementChild.children[0].classList.add(
        levelColor
      );
    } else
      enterPassword.parentElement.lastElementChild.children[0].classList.remove(
        levelColor
      );
    if (passwordLevel === 5) {
      document.querySelector(".password-rule").style.color = "unset";
    }
  };
  enterPassword.addEventListener("input", () => {
    passwordStrength.count(/[A-Z]/, "caps", 1);
    passwordStrength.count(/[a-z]/, "low", 1);
    passwordStrength.count(/[0-9]/, "num", 1);
    passwordStrength.count(/\W/, "spec", 1);
    passwordStrength.count(/.{10,}/, "length", 1);
    passwordStrength.count(/\s/, "whitespace", -1);
    passwordStrength.meter(1, "level-one");
    passwordStrength.meter(2, "level-two");
    passwordStrength.meter(3, "level-three");
    passwordStrength.meter(4, "level-four");
    passwordStrength.meter(5, "level-five");
  });
})();

// SUBMIT FORM
(() => {
  const {
    entries,
    checkBox,
    submitButton,
    userDetails,
    enterFirstname,
    enterLastname,
    enterDOB,
    enterEmail,
    enterPassword,
  } = globalSelection;

  document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();

    if (
      entries.firstName &&
      entries.lastName &&
      entries.DOB &&
      entries.email &&
      entries.password &&
      entries.checkBox
    ) {
      userDetails.userFirstName = enterFirstname.value;
      userDetails.userLastName = enterLastname.value;
      userDetails.userDOB = `${enterDOB[0].value} ${enterDOB[1].value} ${enterDOB[2].value}`;
      userDetails.userEmail = enterEmail.value;
      userDetails.userPassword = enterPassword.value;
      userDetails.agreement = checkBox.value;
      // location.reload();
    } else {
      document.querySelector("#submit-error").classList.add("activate");
      setTimeout(() => {
        document.querySelector("#submit-error").classList.remove("activate");
      }, 3000);
      document.querySelectorAll(".submit-entry").forEach(holder => {
        if (!holder.classList.contains("valid-syntax")) {
          holder.classList.add("invalid-syntax");
        }
      });
    }
    checkBox.checked = false;
    submitButton.classList.remove("submit-button-active");
    console.log(userDetails);
  });
})();
