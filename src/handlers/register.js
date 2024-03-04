const blockLogin = document.querySelector('.login-block');
const content = document.querySelector('.content-wrapper');

const registered = () => {
  console.log('[ SUCCESS REGISTERED ]');
  blockLogin.style.display = 'none';
  content.style.display = 'flex';
};

const failed = (e) => {
  console.log('[ FAILED REGISTERED ]: ', e.cause);
  alert('Registration Failed');
};

const connected = () => {
  console.log('[ SUCCESS CONNECTED ]');
};

const disconnected = (e) => {
  console.log('[ DISCONNECTED ]: ', e.cause);
  blockLogin.style.display = 'block';
  content.style.display = 'none';
};

const register = {
  registered,
  failed,
  connected,
  disconnected,
};

export default register;
