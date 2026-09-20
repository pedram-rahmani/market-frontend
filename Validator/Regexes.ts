const testEmail = (value: string): boolean => {
  const emailPattern =
    /^[a-zA-Z0-9](?:[a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,63}$/;
  return emailPattern.test(value);
};

const testPassword = (value: string): boolean => {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()+\-=_])[A-Za-z\d!@#$%^&*()+\-=_]{8,32}$/;
  return passwordPattern.test(value);
};

const testUsername = (value: string): boolean => {
  const usernamePattern =
    /^(?=.*\p{L})\p{L}(?!.*[-_]{2})[\p{L}0-9 _-]*$/u;
  return usernamePattern.test(value);
};

const testName = (value: string): boolean => {
  const namePattern = /^\p{L}[\p{L}\s]*$/u;
  return namePattern.test(value);
};

const testCodeMelli = (value: string): boolean => {
  if (!/^\d{10}$/.test(value)) return false;
  if (/^(\d)\1{9}$/.test(value)) return false;
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
  return /^[0-9]+$/.test(value);
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
