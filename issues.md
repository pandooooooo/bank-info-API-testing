# Bug List
* * *
### Enviornment
**URL: http://preview.airwallex.com:30001/bank**

### 1. The verification of character length on swift_code is incorrect.
#### Priority & Severity
- Priority: Major
- Severity: Normal
#### Affected Scope : Unknown
#### Description
> 「swift code should be either 8 or 11 characters」
- The length of swift_code should be either 8 nor 11 characters according to Business Requirements, not between them.
- The Http Response should be 400 when the upper condition is not met.
- When swift_code is 9 or 10 characters, now the request responded with 200, which should be 400.

#### Reproduce
Send request with following request body:
```json
{
	payment_method : 'SWIFT',
	bank_country_code: any valid input,
	account_name: any valid input,
	account_number: any valid input,
	swift_code: random string with 9 or 10 characters
}
```

- Expected & Actual
    - Expected : Return 400 http response with error message "Length of 'swift_code' should be either 8 or 11"
    - Actual : Request responded with code 200

### 2. When bank_country_code is US and aba filled with blank or null string, request responded with 200, which should be 400.
#### Priority & Severity
- Priority: Major
- Severity: Normal
#### Affected Scope : Unknown
#### Description
> 「aba: mandatory when bank country is US && 9 characters」
- When bank_country_code is US, aba must be filled with 9 characters.
- Thus, when bank_country_code is US and aba filled with blank or null string, request should be responded with 400.

#### Reproduce
Send request with following request body:
```json
{
	payment_method : any valid input,
	bank_country_code: 'US',
	account_name: any valid input,
	account_number: any valid input,
	swift_code: any valid input,
    aba: blank or ""
}
```

- Expected & Actual
    - Expected : Return 400 http response
    - Actual : Request responded with code 200

### 3. When bank_country_code is US, the validation on account number is incorrect.
#### Priority & Severity
- Priority: Major
- Severity: Urgent
#### Affected Scope : Unknown
#### Description
> 「account number: for US, account number is 1-17 character long, can be any character」
> 「account_number length error: "Length of account_number should be between 7 and 11 when bank_country_code is 'US'"」
1. The Error Message of account number is not correct, which should be "Length of account_number should be between 1 and 17 when bank_country_code is 'US'"
2. Back-end should check the valid length of account number is between 1 and 17, while now it is 7 to 11.

#### Reproduce
Send request with following request body:
```json
{
	payment_method : any valid input,
	bank_country_code: 'US',
	account_name: any valid input,
	account_number: random string with the length of characters outer range of  7 to 11,
	swift_code: any valid input,
    aba: any valid input
}
```

- Expected & Actual
    - Expected : 
      - Request responded with code
      - Error message should be "Length of account_number should be between 1 and 17 when bank_country_code is 'US'"
    - Actual : Return 200 http response with wrong error message

### 4. When bank_country_code is CN, the validation on account number is incorrect, seems like still using the verification for AU.
#### Priority & Severity
- Priority: Major
- Severity: Urgent
#### Affected Scope : Unknown
#### Description
> 「account number: for CN, account number is 8-20 character long, can be any character」
- Back-end should check the valid length of account number is between 8 and 20, while now the verification of length is between 6 and 9.

#### Reproduce
Send request with following request body:
```json
{
	payment_method : any valid input,
	bank_country_code: 'CN',
	account_name: any valid input,
	account_number: random string with the length of characters 6 or 7,
	swift_code: any valid input,
    aba: any valid input
}
```
```json
{
  payment_method : any valid input,
  bank_country_code: 'CN',
  account_name: any valid input,
  account_number: random string with the length of characters between 10 and 20,
  swift_code: any valid input,
  aba: any valid input
}
```

- Expected & Actual
    - Expected :
        - Return 400 http response with wrong error message "Length of account_number should be between 8 and 20 when bank_country_code is 'CN'"
        - Request responded with code 200
    - Actual : 
        - Request responded with code 200
        - Return 400 http response with wrong error message "Length of account_number should be between 7 and 11 when bank_country_code is 'US'"

### 5. The corresponding error message for inappropriate account number is always "Length of account_number should be between 7 and 11 when bank_country_code is 'US'".
#### Priority & Severity
- Priority: Major
- Severity: High
#### Affected Scope : Unknown
#### Description
> 「account number: for CN, account number is 8-20 character long, can be any character」
- Back-end should check the valid length of account number is between 8 and 20.
- The Error Message is the same with US,
- and the verification of length is between 7 and 11, which is wrong now (refer to Bug 3).

#### Reproduce
Send request with following request body:
1. bank_country_code is CN
```json
{
	payment_method : any valid input,
	bank_country_code: 'CN',
	account_name: any valid input,
	account_number: random string with 5 characters,
	swift_code: any valid input,
    aba: any valid input
}
```

2. bank_country_code is AU
```json
{
	payment_method : any valid input,
	bank_country_code: 'AU',
	account_name: any valid input,
	account_number: random string with the length of characters outer range of  6 to 9,
	swift_code: any valid input,
    aba: any valid input
}
```

- Expected & Actual
    - Expected :
        - Error message should be "Length of account_number should be between 8 and 20 when bank_country_code is 'CN'"
        - Error message should be "Length of account_number should be between 6 and 9 when bank_country_code is 'AU'"
    - Actual : Error messages both are "Length of account_number should be between 7 and 11 when bank_country_code is 'US'".
