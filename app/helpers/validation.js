exports.email = (value) => {
    var rogex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let data = null;
    value.email && value.email.match(rogex)
      ? (data = { message: "data valid", status: true })
      : (data = { message: "Invalid email", status: false });
    return data;
  };
  
  exports.phone = (value) => {
    var phone_rogex = /\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\d{1,14}$/;
    let data = null;
    value.phone && value.phone.match(phone_rogex)
      ? (data = { message: "Phone no validated", status: true })
      : (data = { message: "PLease Provide Valid Phone No", status: false });
    return data;
  };
  
  exports.both = (value) => {
    var phone_rogex = /\\+(9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\\d{1,14}$/;
    var email_rogex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let data = null;
    value.email && value.email.match(email_rogex)
      ? value.phone && value.phone.match(phone_rogex)
        ? (data = { message: "Data validated", status: true })
        : (data = { message: "PLease Provide Valid Phone No", status: false })
      : (data = { message: "PLease Provide Valid email", status: false });
    return data;
  };
  