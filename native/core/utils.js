
import Intl from 'react-native-intl'

export const emailValidator = email => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email cannot be empty.';
  if (!re.test(email)) return 'Ooops! We need a valid email address.';

  return '';
};

export const passwordValidator = password => {
  if (!password || password.length <= 0) return 'Password cannot be empty.';

  return '';
};

export const nameValidator = name => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};


export function formatCurrency (locales, currency, number) {
  // var formatted = new Intl.NumberFormat(locales, {
  //   style: 'currency',
  //   currency: currency,
  //   minimumFractionDigits: fractionDigits
  // }).format(number).then(res => {
  //   return res;
  // });

  new Intl.NumberFormat(locales, { style: 'currency', currency: currency }).format(number).then(res => {
    return res
  } )
  
}

