
function validateNameInput(input, required, placeholder="שם") {

    if (!input.length && !required) return '';
    else if (!input.length) return `אנא הכנס ${placeholder}`;
    else if (input.length > 20) return `חייב להכיל פחות מ20 תווים`;
    else {
        let res = /[\u0590-\u05FF a-zA-Z]*/i.exec(input);
        if (res[0] !== input) return `חייב להכיל רק אותיות`;
    }

    return '';
}

function validateUsernameInput(input, required, placeholder="שם משתמש") {

    if (!input.length && !required) return '';
    else if (!input.length) return `אנא הכנס ${placeholder}`;
    else if (input.length > 20) return `${placeholder} חייב להכיל פחות מ20 תווים`;
    else {
        let res = /[a-z0-9\u0590-\u05FF_.-]*/i.exec(input);
        if (res[0] !== input)
            return `${placeholder} חייב להכיל רק אותיות ומספרים`;
    }

    return '';
}
function validateFullNameInput(input, required) {

    if (!input.length && !required) return '';
    else if (!input.length || !/\s/.test(input)) return 'אנא הכנס שם פרטי ושם משפחה';
    else if (input.length > 30) return 'השם חייב להכיל פחות מ30 תווים';
    //TODO make sure that the following regex is only hebrew letters and at least one space between leters
    else {
        let res = /[\u0590-\u05FF  a-zA-Z]*/i.exec(input);
        if (res[0] !== input) return `השם חייב להכיל רק אותיות`;
    }
    return '';
}

function validatePhoneInput(input, required) {
    if (!input.length && !required) return '';
    else if (!input.length) return 'אנא הכנס מספר טלפון';
    else if (input.length !== 10) return 'מספר הטלפון חייב להכיל בדיוק 10 תווים';
    else if (!/^0[0-9]{9}$/.test(input)) return 'מספר הטלפון לא תקין';
    // else if(/^\d+$/.test(input)) return 'Must include only numbers';
    return '';
}

function validateEmailInput(input, required) {
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    if (!input.length && !required) return '';
    else if (!input.length) return 'אנא הכנס כתובת מייל';
    else if (!regex.test(input)) return 'כתובת המייל שגויה';

    return '';
}

function validatePasswordInput(input, required) {
    let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
    if (!input.length && !required) return '';
    else if (!input.length) return 'אנא הכנס סיסמא';
    else if (input.length < 6) return 'הסיסמא חייבת להכיל לפחות 6 תווים';
    else if (!regex.test(input)) return 'הסיסמא חייבת להכיל מספר, אות גדולה ואות קטנה באנגלית';

    return '';
}

function validateConfirmPasswordInput(input, required, pw) {
    if (!input.length && !required) return '';
    else if (!input.length) return 'אנא הכנס אימות סיסמא';
    if (input !== pw) return 'הסיסמאות אינן תואמות';

    return '';
}

function validateSelectInput(input, required, placeholder) {
    if (input && !input.length && !required) return '';
    else if (input && !input.length) return `אנא בחר ${placeholder}`;

    return '';
}

function validateStringInput(input, required, placeholder, length) {
    if (!input.length && !required) return '';
    else if (!input.length) return `אנא הכנס ${placeholder}`;
    else if (input.length > length) return `חייב להכיל פחות מ${length} תווים`;
    // else if (/\d/.test(input)) return 'לא יכול להכיל מספרים';

    return '';
}

function validateAddressInput(input, required) {
    if (!input.length && !required) return '';
    else if (!input.length) return 'אנא הכנס כתובת ומספר בית';
    else if (!/\d/.test(input) || !/[\u0590-\u05FF]/.test(input)) return 'חייב להכיל כתובת ומספר בעברית';
    else if (!/\s/.test(input)) return 'כתובת המגורים שהזנת שגויה';

    return '';
}

function validateNumberInput(input, required, placeholder) {
    if (!input.length && !required) return '';
    else if (!input.length) return `אנא הכנס ${placeholder}`;
    else if (input <= 0) return `על ה${placeholder} להיות גדול מ-0`;

    return '';
}

export default {
    validateFullNameInput,
    validateNameInput,
    validatePhoneInput,
    validateEmailInput,
    validatePasswordInput,
    validateConfirmPasswordInput,
    validateSelectInput,
    validateStringInput,
    validateAddressInput,
    validateNumberInput,
    validateUsernameInput
}
