import ajax from './ajax';

//login request

export function reqLogin(username,password) {

  const BASE = ''; //Proxy server
  return ajax({
    method: 'post',
    url: BASE + '/login',
    data: {
      username,
      password
    }
  });
}

const name="admin";
const pwd="admin";
reqLogin(name,pwd).then(
  response => {
    console.log('successfully',response.data);
  },
  error =>{//promise chain break
    console.log('failed');
  }
);




