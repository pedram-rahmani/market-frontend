const testEmail = (value: string): boolean => {
  const emailPattern =
    /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
  return emailPattern.test(value);
};

const testPassword = (value: string): boolean => {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()+\-=_])[A-Za-z\d!@#$%^&*()+\-=_]{8,32}$/;
  return passwordPattern.test(value);
};

const testUsername = (value: string): boolean => {
  const usernamePattern =
    /^(?=.*[\u0600-\u06FFa-zA-Z])[\u0600-\u06FFa-zA-Z](?!.*[-_]{2})[\u0600-\u06FFa-zA-Z0-9 _-]*$/;
  return usernamePattern.test(value);
};

const testName = (value: string): boolean => {
  const namePattern = /^[a-zA-Z\u0600-\u06FF\s]+$/;
  return namePattern.test(value);
};

const testCodeMelli = (value: string): boolean => {
  if (!/^\d{10}$/.test(value)) return false;
  const check = parseInt(value[9], 10);
  const sum = value
    .split("")
    .slice(0, 9)
    .reduce((acc, num, idx) => acc + parseInt(num, 10) * (10 - idx), 0);
  const remainder = sum % 11;
  return (
    (remainder < 2 && check === remainder) ||
    (remainder >= 2 && check === 11 - remainder)
  );
};

const testPhoneNumber = (value: string): boolean => {
  const phonePattern = /^(\+98|0)?9\d{9}$/;
  return phonePattern.test(value);
};

const testNumber = (value: string): boolean => {
  return /^[0-9]+$/.test(value); // فقط اعداد
};

const regexes = {
  testEmail,
  testPassword,
  testUsername,
  testName,
  testCodeMelli,
  testPhoneNumber,
  testNumber,
};
export default regexes;
