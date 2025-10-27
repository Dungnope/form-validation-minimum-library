//Object "Validator"
const Validator = (options) => {

    const getParent = (element, selector) => {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            else{
                element = element.parentElement;
            }
        }
    }

    let selectorRules = {};
    // validate function
    const validate = (inputElement, rule) => {
        // value: input.value
        // test func: rule.test
        let errorMessage;
        let errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

        // pick up rules of selector
        let rules = selectorRules[rule.selector];
        //loop each rule and check
        for(let i = 0; i < rules.length; i++){
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            
            if(errorMessage) break;
        }
        if(errorMessage){
            errorElement.textContent = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add("invalid");
        }
        else
        {
            errorElement.textContent = "";
            getParent(inputElement, options.formGroupSelector).classList.remove("invalid");
        }
        return !errorMessage;
    }

    const formElement = document.querySelector(options.form);
    if(formElement){
        // Deminish submit form
        formElement.onsubmit = (e) => {
            e.preventDefault();

            let isFormValid = true;

            //loop each rule and validate
            options.rules.forEach((rule) => {
                const inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement, rule);
                if(!isValid){
                    isFormValid = false;
                }
            });

            if(isFormValid){
                if(typeof options.onSubmit === 'function'){
                    let enableInputs = document.querySelectorAll(`[name]`);
                    let formValues = Array.from(enableInputs).reduce((values, input) => {

                        switch(input.type){
                            case 'radio':
                                values[input.name] =   formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                };

                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    }, {});
                    options.onSubmit(formValues);
                }
                //no use js use html 
                else{
                    formElement.submit();
                }
            }
        }

        options.rules.forEach((rule) => {
            //save rules each input
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
            else{
                selectorRules[rule.selector] = [rule.test];
            }
            const inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach((inputElement) => {
                if(inputElement){
                    //When blur outside input
                    inputElement.addEventListener("blur", (e) => {
                        validate(inputElement, rule);
                    })
                    //When click on input
                    inputElement.addEventListener("input", (e) => {
                        validate(inputElement, rule);
                    })
                }
            })
            
        });
    }
}

//rules definited
// Principle of rules
//1. When error occur => return error message
//2. When validate => No return
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test : function(value) {
            return value ? undefined : message || "This field can not blanked";
        }
    };
}

Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test : function(value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Please put your email here';
        }
    };
}

Validator.minLength = (selector, min, message)=>  {
    return {
        selector: selector,
        test : function(value) {
            return value.length >= min ? undefined : message || `Password minimum is ${min} characters`;
        }
    };   
}

Validator.isConfirmed = (selector, getConfirmValue, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === getConfirmValue() ? undefined : message || 'Value not correct';
        }
    }
}