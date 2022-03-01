require('dotenv').config();
const axios = require('axios').default;

var allegroMiddleware = async function (req, res, next) {
  // if (global.isAccessVerified) {
  //   const token = Buffer.from(`${process.env.ALLEGRO_CLIENT_ID}:${process.env.ALLEGRO_CLIENT_SECRET}`, 'utf8').toString('base64');
  //   const response = await axios.post(
  //     `${process.env.ALLEGRO_URL}/auth/oauth/token?grant_type=refresh_token&refresh_token=${global.allegroRefreshToken}`,
  //     {},
  //     {
  //       headers: {
  //         'Content-Type': 'application/x-www-form-urlencoded',
  //         'Authorization': `Basic ${token}`,
  //       },
  //     },
  //   );
  //   global.allegroAccessToken = response.data.access_token;
  //   global.allegroAuthConfig = {
  //     headers: {
  //       // Authorization: `Bearer ${response.data.access_token}` || '',
  //       Authorization:
  //         `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDYyMTE4MzksInVzZXJfbmFtZSI6Ijk4ODk5NTAzIiwianRpIjoiOTc3OTIwY2EtZTFhYi00ZGJmLTg5NTAtYjBhYThkNjcxNDkyIiwiY2xpZW50X2lkIjoiMzU4ZGQ3MTc2NzIzNDk0ZDlmYWIwMmQ0NGQ0MGM4NDUiLCJzY29wZSI6WyJhbGxlZ3JvOmFwaTpzYWxlOm9mZmVyczp3cml0ZSIsImFsbGVncm86YXBpOnNhbGU6b2ZmZXJzOnJlYWQiXSwiYWxsZWdyb19hcGkiOnRydWV9.lziMPTF9OMyWA8QQoctQu08kQdaOwKt3HdmI_8I8W0b2JFpC9AAVzsgHkQ_sjDP3-JLRVeO6Vv-qBhwbViWmnUyE5sBfRO0IMAE25MQlzCfBv-mKKHfKhfz8R6V3M1_JWWaSer1ImD0F9FRSydC_8TCcQhLvssEEleBesJTT-LDHhLnaNglyFGloe9FhmQH-15TPHREql6GTWyaXLTZviTQx9Kiu2jNVMPWyrSNhwKu97hMZ9kmQf5cm7tvw18xQS_AO0eAJg5Ozm87ojGqgfAuaN0CvVZmz_oKCUicIzY2ry1j18SFeSg5fRXhtp4ml29Aa3f2z6cVB0Uy4Y-wE_A` ||
  //         '',
  //       Accept: 'application/vnd.allegro.beta.v2+json',
  //       ['Content-Type']: 'application/vnd.allegro.beta.v2+json',
  //     },
  //   };
  //   global.allegroRefreshToken = response.data.refresh_token;
  //   next();
  // } else {
  //   res.send('Please verify your device');
  // }
  global.allegroAuthConfig = {
    headers: {
      // Authorization: `Bearer ${response.data.access_token}` || '',
      Authorization:
        `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDYyMTE4MzksInVzZXJfbmFtZSI6Ijk4ODk5NTAzIiwianRpIjoiOTc3OTIwY2EtZTFhYi00ZGJmLTg5NTAtYjBhYThkNjcxNDkyIiwiY2xpZW50X2lkIjoiMzU4ZGQ3MTc2NzIzNDk0ZDlmYWIwMmQ0NGQ0MGM4NDUiLCJzY29wZSI6WyJhbGxlZ3JvOmFwaTpzYWxlOm9mZmVyczp3cml0ZSIsImFsbGVncm86YXBpOnNhbGU6b2ZmZXJzOnJlYWQiXSwiYWxsZWdyb19hcGkiOnRydWV9.lziMPTF9OMyWA8QQoctQu08kQdaOwKt3HdmI_8I8W0b2JFpC9AAVzsgHkQ_sjDP3-JLRVeO6Vv-qBhwbViWmnUyE5sBfRO0IMAE25MQlzCfBv-mKKHfKhfz8R6V3M1_JWWaSer1ImD0F9FRSydC_8TCcQhLvssEEleBesJTT-LDHhLnaNglyFGloe9FhmQH-15TPHREql6GTWyaXLTZviTQx9Kiu2jNVMPWyrSNhwKu97hMZ9kmQf5cm7tvw18xQS_AO0eAJg5Ozm87ojGqgfAuaN0CvVZmz_oKCUicIzY2ry1j18SFeSg5fRXhtp4ml29Aa3f2z6cVB0Uy4Y-wE_A` ||
        '',
      Accept: 'application/vnd.allegro.beta.v2+json',
      ['Content-Type']: 'application/vnd.allegro.beta.v2+json',
    },
  };
  next();
};

module.exports = allegroMiddleware;
