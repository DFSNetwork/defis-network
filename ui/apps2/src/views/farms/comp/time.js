
var minepool_bal = 0;
var rankTagShow = false;
var userLP = 0;
var totalLP = 0;
var userlastTime = '';
var tokenLPPool = 0;
var minercount = 0;
var constant = 1;
var dssRate = [0.5333,0.7,0.7333,0.8,1];
var dssRateShow = [1,1.3125,1.375,1.5,1.8751];
var userDssRate = 0;

var options = {
  useEasing: true, //使用缓和效果
  useGrouping: false, //使用分组效果
  separator: ',', //分离器，数据够三位，例如100,000
  decimal: '.', //小数点分割，例如：10.00
  prefix: '', //第一位默认数字
  suffix: '' //最后一位默认数字
};

var userTime = '';
// var balance02 = new CountUp("poolNum", 0, 0.00000000, 8, 3, options);


function getTokenPool() {

  // if(minercount < rankLength){
  //   $(".rankNum").html(1);
  //   return
  // }
  var rank = 0;
  var rate = 1;
  var api = get_random_api();
  var selfData = {
    json: true,                 // Get the response as json
    code: dssLpContractName,           // Contract that we target
    scope: getURLPara("mid"),          // Account that owns the data
    table: 'miners',          // Table name
    index_position: '2',          // Table secondary index
    // lower_bound: '2',     // Table primary key value
    key_type:'i64',
    limit: 100,                   // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: true,             // Optional: Get reversed data
    show_payer: false,  
  }

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {
      var html  = '<table style="margin-bottom: 10px;" border=""><tbody><tr><td>名次</td><td>账号</td><td>总量</td></tr>';
      var html2  = '';
      var html3  = '</tbody></table>';
      for (x in data["rows"]) {
        if (data["rows"][x]["miner"] == getCookie("account")) {
          console.log("index",x);
          //poolmid.push(data["rows"][x]["mid"])
          // var json = {"mid":data["rows"][x]["mid"],"weight":data["rows"][x]["weight"]};
          // poolmid.push(json);
          rankTagShow = true;
          rank = Number(x)+1;
          
          // minepool_bal += parseFloat(data["rows"][x]["supply"]);
        }

        
            
            html2 += '<tr>';
            html2 += '  <td>'+ (Number(x)+1) +'</td>';
            html2 += '  <td>'+ data["rows"][x]["miner"] +'</td>';
            html2 += '  <td>'+ data["rows"][x]["liq_bal0"] +'</td>';
            html2 += '</tr>';
          


      }
      if(html2){
        $("#rankPanel .content").html(html+html2+html3);
      }

      if(rankTagShow){
        $(".rank").html("第"+ rank +"名").show();
        
        if(data["rows"].length == 100){
          

          if(rank < (Math.floor(rankLength / 2)+1) ){
            constant = 0.2;
          }else if(rank < (rankLength +1)){
            constant = 1;
            rate = 5;
          }
          
        }
      }else{

        if(data["rows"].length == 100){
          $(".rank").html("大于100名").show();
          
          constant = 0.6;
          rate = 3;
          
        }else{
          $(".rank").html("--").show();
        }
      }


      
      $(".rankNum").html(rate);
      // balance02.update(minepool_bal);

    }, "json");

}

function getUserLP() {

  var api = get_random_api();
  var selfData = {
    json: true,                 // Get the response as json
    code: dssLpContractName,           // Contract that we target
    scope: getURLPara("mid"),          // Account that owns the data
    table: 'miners',          // Table name
    // index_position: 329,          // Table secondary index
    lower_bound: getCookie("account"),     // Table primary key value
    limit: 1,                   // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false,             // Optional: Get reversed data
    show_payer: false,  
  }

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {

      for (x in data["rows"]) {
        if (data["rows"][x]["miner"] == getCookie("account")) {
          //poolmid.push(data["rows"][x]["mid"])
          // var json = {"mid":data["rows"][x]["mid"],"weight":data["rows"][x]["weight"]};
          // poolmid.push(json);
          userLP = parseFloat(data["rows"][x]["liq_bal0"]);
          $("#userLP").html(userLP);
          userlastTime = data["rows"][x]["last_drip"];
          userDssRate = dssRate[data["rows"][x]["pool"]];

          $(".userDssRate").html(dssRateShow[data["rows"][x]["pool"]]);

          
          // minepool_bal += parseFloat(data["rows"][x]["supply"]);
        }

      }
      // balance02.update(minepool_bal);

    }, "json");

}

function getTotalLP() {

  var api = get_random_api();
  var selfData = {
    json: true,                 // Get the response as json
    code: dssLpContractName,           // Contract that we target
    scope: dssLpContractName,          // Account that owns the data
    table: 'assetpool',          // Table name
    // index_position: 329,          // Table secondary index
    lower_bound: getURLPara("mid"),     // Table primary key value
    limit: 1,                   // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false,             // Optional: Get reversed data
    show_payer: false,  
  }

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {

      for (x in data["rows"]) {
        totalLP = parseFloat(data["rows"][x]["stackasset"]);

      }
      // balance02.update(minepool_bal);
      if(userLP != 0){
        var time = getUserUTC() || 0;
        var num = (tokenLPPool / 2 / 604800) * time * (userLP / totalLP) * constant * userDssRate;

        if(userTime == ''){
          userTime = new CountUp("userTime", 0, 0.00000000, 8, 3, options);
        }
        userTime.update(num);
        
        console.log("time:",num)
        
      }
    }, "json");

}
function getTokenLPPool() {

  var api = get_random_api();
  var selfData = {
    json: true,                 // Get the response as json
    code: dssLpContractName,           // Contract that we target
    scope: dssLpContractName,          // Account that owns the data
    table: 'ponds',          // Table name
    // index_position: 329,          // Table secondary index
    lower_bound: getURLPara("mid"),     // Table primary key value
    limit: 1,                   // Here we limit to 1 to get only the single row with primary key equal to 'testacc'
    reverse: false,             // Optional: Get reversed data
    show_payer: false,  
  }

  $.post(api + "/v1/chain/get_table_rows", JSON.stringify(selfData),
    function(data, status) {

      for (x in data["rows"]) {
        var times = Math.ceil(getUserUTC(data["rows"][x]["start"]) / data["rows"][x]["halftime"]);
        tokenLPPool = parseFloat(data["rows"][x]["max_supply"]) * Math.pow(0.5,times);
        minercount = data["rows"][x]["minercount"];

      }
    }, "json");

}
function mining() {


  checkScatter(function(user) {
    var authorization;
    const eos = loot.scatter.eos(network, Eos);
    const account = user.name;
    authorization = [{
      actor: account,
      permission: user.authority
    }]


    eos.transaction({
      actions: [{
        account: dssLpContractName,
        name: 'mining',
        authorization: authorization,
        data: {
          id:getURLPara("mid"),
          acc: account
        }
      }]
    }).then(res => {
      showMsg("收矿成功！");


    }).catch(e => {

      eosErrorShow(e);
    });
  })
}


function swapTokenGo(){
  var dssId = getURLPara("mid");
  if(dssId == '3'){
    window.location.href = "https://www.yfc.one/vault";
  }else if(dssId == '4'){
    window.location.href = "https://apps.defis.network/dss";
  }
}


$(function(){
  if(!CountUp){
    userTime = '';
  }else{
    userTime = new CountUp("userTime", 0, 0.00000000, 8, 3, options);
  }
  
  if(getURLPara("mid")){
    var imgs = getTokenImgs(getURLPara("mid"));
    $("#swapImgs").attr("src","imgs/"+imgs);
    $(".subInfo").html("映射 "+ getTokenName(getURLPara("mid")) +" 的LP来获取时砂TIME");


  }
  if(getCookie("account")){
    getTokenPool();
    getUserLP();
    getTotalLP();
    getTokenLPPool();
  }
  
})

function getTokenName(id) {
  switch (String(id)) {
    case "3":
      return "YFC DSS";
      break;
    case "4":
      return "DFS DSS";
      break;
  }
}
function getUserUTC(){
  // var utcStart = "2020-10-05T17:20:16";
  var oldtime = new Date(userlastTime).getTime();
  var uy = String(new Date().getUTCFullYear());
  var um = String(new Date().getUTCMonth() + 1);
  var ud = String(new Date().getUTCDate());
  var uh = String(new Date().getUTCHours());
  var umin = String(new Date().getUTCMinutes());
  var us = String(new Date().getUTCSeconds());
  if(um.length == 1){
    um = '0'+um;
  }
  if(ud.length == 1){
    ud = '0'+ud;
  }
  if(uh.length == 1){
    uh = '0'+uh;
  }
  if(umin.length == 1){
    umin = '0'+umin;
  }
  if(us.length == 1){
    us = '0'+us;
  }
  var utcNow = String(uy + "-" + um + "-" + ud + "T" + uh + ":" + umin + ":" + us);

  var newtime = new Date(utcNow).getTime();
  var time = (newtime - oldtime) / 1000;

    if(time < 0){
      console.log("未开始")
      return
    }
    // console.log(utcNow,userlastTime)
    // console.log(newtime,oldtime)
    // console.log(time,new Date(utcNow).Format('yyyy-MM-dd hh:mm:ss'),new Date(userlastTime).Format('yyyy-MM-dd hh:mm:ss'))
    return time;
    // var d = parseInt(time / (60 * 60 * 24));
    // // var h = parseInt(time / 60 / 60 % 24);
    // var h = parseInt(time / 60 / 60);
    // var m = String(parseInt(time / 60 % 60));
    // var s = String(parseInt(time % 60));
    // if(m.length == 1){
    //   m = '0'+m;
    // }
    // if(s.length == 1){
    //   s = '0'+s;
    // }
}
function transactionGo(id){
  var tag = '';
  switch (String(id)) {
    case timeMid:
      tag = "time.png";
      break;
    case "39":
      tag = "minedfstoken-DFS";
      break;
    case "329":
      tag = "yfctokenmain-YFC";
      break;
    case "444":
      tag = "lootglobcore-LOOT";
      break;
  }
  if(tag == ''){
    alert("交易未开放");
  }
  window.location.href = "https://apps.defis.network/?in=eosio.token-EOS&out=" + tag;
}
//

setInterval(function() {

  if(getCookie("account")){
    getTokenPool();
    getUserLP();
    getTotalLP();
  }

}, 3000)
setInterval(function() {

  if(getCookie("account")){
    getTokenLPPool();
  }

}, 10000)



// EOS 收益 = EOS做市 - EOS本金
// YFC 收益 = YFC做市 - YFC本金

// EOS 币本位时
// 总EOS盈亏 = EOS 收益 + (YFC收益 * YFC 当前价格)
// 百分比 = 总EOS盈亏 / (EOS本金 * 2)

// YFC 币本位时
// 总YFC盈亏 = (EOS 收益 / YFC 当前价格) + YFC收益
// 百分比 = 总YFC盈亏 / (YFC本金 * 2)

// 数据带入 - EOS本位