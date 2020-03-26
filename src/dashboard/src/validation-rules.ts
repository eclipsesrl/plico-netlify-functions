import { extend } from 'vee-validate';
import { required, email, regex, min } from 'vee-validate/dist/rules';

extend('email', {
  ...email,
  message: 'The email is invalid'
});

// Override the default message.
extend('required', {
  ...required,
  message: 'This field is required'
});

extend('regex', {
  ...regex,
  message:
    'At least 1 uppercase, 1 lowercase, 1 number and 1 special character'
});

extend('min', {
    ...min,
    params: ['length'],
    message: 'The field must have at least {length} characters'
})

extend('confirm', {
  params: ['target'],
  //@ts-ignore
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});