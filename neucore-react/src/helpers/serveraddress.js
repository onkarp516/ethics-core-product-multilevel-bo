// const networkInterfaces = os.networkInterfaces();
// export const ip = networkInterfaces["   "][0]["address"];
// export const portNo = "8082";
// console.log(networkInterfaces);

export const getCurrentIpaddress = () => {
  // console.log(os);
  // const nets = os.networkInterfaces();
  // console.log(nets);
  // const results = Object.create(null); // Or just '{}', an empty object
  // for (const name of Object.keys(nets)) {
  //   for (const net of nets[name]) {
  //     // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
  //     if (net.family === "IPv4" && !net.internal) {
  //       if (!results[name]) {
  //         results[name] = [];
  //       }
  //       results[name].push(net.address);
  //     }
  //   }
  // }
  // let finalIpdlist = results[Object.keys(results)[0]];
  // console.log("finalIpd", finalIpdlist[0]);
  return "192.168.1.113";
  // return "192.168.1.14";
  // return "95.111.243.140"; // CONTABO SERVER
  // return "194.233.89.164"; // CONTABO SERVER
  // return finalIpdlist ? finalIpdlist[0] : "localhost";
  return "localhost";
  // return "192.168.1.105";
};

export const getPortNo = () => {
  // return 8085;
  // return 8084;
  // return 8081;
  // return 4044;
  return 9091;
  // return 3011; //CONTABO SERVER
};
