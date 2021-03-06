import React, { Component } from 'react';
import { ContractLoader, Dapparatus, Transactions, Gas, Address, Events } from "dapparatus";
import { Tx, Input, Output, Util } from 'leap-core';
import { equal, bi } from 'jsbi-utils';
import Web3 from 'web3';
import axios from 'axios';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import gasless from 'tabookey-gasless';
import './App.scss';
import Header from './components/Header';
import NavCard from './components/NavCard';
import SendByScan from './components/SendByScan';
import SendToAddress from './components/SendToAddress';
import RegisterMovie from './components/RegisterMovie';
import SendBadge from './components/SendBadge';
import WithdrawFromPrivate from './components/WithdrawFromPrivate';
import RequestFunds from './components/RequestFunds';
import SendWithLink from './components/SendWithLink';
import Receive from './components/Receive'
import Share from './components/Share'
import ShareLink from './components/ShareLink'
import Balance from "./components/Balance";
import Badges from "./components/Badges";
import Ruler from "./components/Ruler";
import Receipt from "./components/Receipt";
import CashOut from "./components/CashOut";
import MainCard from './components/MainCard';
import History from './components/History';
import Advanced from './components/Advanced';
import BottomLinks from './components/BottomLinks';
import MoreButtons from './components/MoreButtons';
import Admin from './components/Admin';
import Vendor from './components/Vendor';
import Vendors from './components/Vendors';
import RecentTransactions from './components/RecentTransactions';
import Footer from './components/Footer';
import Loader from './components/Loader';
import burnerlogo from './burnerwallet.png';
import BurnWallet from './components/BurnWallet'
import Bottom from './components/Bottom';
import customRPCHint from './customRPCHint.png';
import namehash from 'eth-ens-namehash'
import { Card, Box, ThemeProvider } from 'rimble-ui';
import theme from "./theme"
import bs58 from "bs58";

//https://github.com/lesnitsky/react-native-webview-messaging/blob/v1/examples/react-native/web/index.js
import RNMessageChannel from 'react-native-webview-messaging';


import bufficorn from './bufficorn.png';
import cypherpunk from './cypherpunk.png';
import eth from './ethereum.png';
import dai from './dai.jpg';
import xdai from './xdai.png';

let base64url = require('base64url')
const EthCrypto = require('eth-crypto');

//const POA_XDAI_NODE = "https://dai-b.poa.network"
const POA_XDAI_NODE = "https://dai.poa.network"

const NST_COLOR_BASE = 49153;

let XDAI_PROVIDER = POA_XDAI_NODE

let WEB3_PROVIDER
let CLAIM_RELAY
let ERC20TOKEN
let ERC20VENDOR
let ERC20IMAGE
let ERC20NAME
let LOADERIMAGE = burnerlogo
let HARDCODEVIEW// = "loader"// = "receipt"
let FAILCOUNT = 0

// Mainnet DAI by default
let DAI_TOKEN_ADDR = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';
let P_DAI_TOKEN_ADDR = '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359';

// Mainnet Leap Bridge(ExitHandler)
let BRIDGE_ADDR = '0x0036192587fD788B75829fbF79BE7F06E4F23B21';

let MARKET_MAKER;
let leapNetwork;

let mainStyle = {
  width:"100%",
  height:"100%",
  backgroundImage:"linear-gradient(#292929, #191919)",
  backgroundColor:"#191919",
  hotColor:"white",
  mainColorAlt:"white",
  mainColor:"white",
}

let title = i18n.t('app_name')
let titleImage = (
  <span style={{paddingRight:20,paddingLeft:16}}><i className="fas fa-fire" /></span>
)

//<i className="fas fa-fire" />
if (window.location.hostname.indexOf("localhost") >= 0 ||
    window.location.hostname.indexOf("10.0.0.107") >= 0 ||
    // For Tim to debug
    window.location.hostname.indexOf("sundai.fritz.box") >= 0) {
  XDAI_PROVIDER = "https://staging-testnet.leapdao.org/rpc";
  WEB3_PROVIDER = "https://rinkeby.infura.io/v3/f039330d8fb747e48a7ce98f51400d65"
  leapNetwork = "Leap Testnet";
  // LEAP token instead of DAI
  DAI_TOKEN_ADDR = '0xD2D0F8a6ADfF16C2098101087f9548465EC96C98';
  P_DAI_TOKEN_ADDR = '0x674d3D146453dDbC82aA1Cd46d12E04609408790';

  // Testnet Leap Bridge(ExitHandler)
  BRIDGE_ADDR = '0x3c80369bBf392cC1DBA45B2F1d97F7A374f5BB40';

  MARKET_MAKER = 'https://2nuxsb25he.execute-api.eu-west-1.amazonaws.com/testnet';

  CLAIM_RELAY = false;
  ERC20NAME = false;
  ERC20TOKEN = false;
  ERC20IMAGE = false;
}
else if (window.location.hostname.indexOf("cannes.motion.ooo") >= 0) {
  XDAI_PROVIDER = "https://staging-testnet.leapdao.org/rpc";
  WEB3_PROVIDER = "https://rinkeby.infura.io/v3/f039330d8fb747e48a7ce98f51400d65"
  leapNetwork = "Leap Testnet";
  // MNY token
  DAI_TOKEN_ADDR = '0xD2D0F8a6ADfF16C2098101087f9548465EC96C98';
  P_DAI_TOKEN_ADDR = '0x674d3D146453dDbC82aA1Cd46d12E04609408790';

  // Testnet Leap Bridge(ExitHandler)
  BRIDGE_ADDR = '0x3c80369bBf392cC1DBA45B2F1d97F7A374f5BB40';

  MARKET_MAKER = 'https://2nuxsb25he.execute-api.eu-west-1.amazonaws.com/testnet';

  CLAIM_RELAY = false;
  ERC20NAME = false;
  ERC20TOKEN = false;
  ERC20IMAGE = false;
}
else if (window.location.hostname.indexOf("s.xdai.io") >= 0) {
  WEB3_PROVIDER = POA_XDAI_NODE;
  CLAIM_RELAY = 'https://x.xdai.io'
  ERC20TOKEN = false//'Burner'
}
else if (window.location.hostname.indexOf("wallet.galleass.io") >= 0) {
  //WEB3_PROVIDER = "https://rinkeby.infura.io/v3/e0ea6e73570246bbb3d4bd042c4b5dac";
  WEB3_PROVIDER = "http://localhost:8545"
  //CLAIM_RELAY = 'https://x.xdai.io'
  ERC20TOKEN = false//'Burner'
  document.domain = 'galleass.io'
}
else if (window.location.hostname.indexOf("qreth") >= 0) {
  WEB3_PROVIDER = "https://mainnet.infura.io/v3/e0ea6e73570246bbb3d4bd042c4b5dac"
  CLAIM_RELAY = false
  ERC20TOKEN = false
}
else if (window.location.hostname.indexOf("xdai") >= 0) {
  WEB3_PROVIDER = POA_XDAI_NODE;
  CLAIM_RELAY = 'https://x.xdai.io'
  ERC20TOKEN = false
}
else if (window.location.hostname.indexOf("burner.leapdao.org") >= 0) {
  XDAI_PROVIDER = "wss://testnet-node1.leapdao.org:1443";
  WEB3_PROVIDER = "wss://rinkeby.infura.io/ws/v3/f039330d8fb747e48a7ce98f51400d65";
  // LEAP token instead of DAI
  DAI_TOKEN_ADDR = '0xD2D0F8a6ADfF16C2098101087f9548465EC96C98';
  P_DAI_TOKEN_ADDR = '0xD2D0F8a6ADfF16C2098101087f9548465EC96C98';
  leapNetwork = "Leap Testnet";
  // Testnet Leap Bridge(ExitHandler)
  BRIDGE_ADDR = '0x2c2a3b359edbCFE3c3Ac0cD9f9F1349A96C02530';

  MARKET_MAKER = 'https://2nuxsb25he.execute-api.eu-west-1.amazonaws.com/testnet';

  CLAIM_RELAY = false;
  ERC20NAME = false;
  ERC20TOKEN = false;
  ERC20IMAGE = false;
}
else if (window.location.hostname.indexOf("sundai.io") >= 0) {
  XDAI_PROVIDER = "wss://mainnet-node1.leapdao.org:1443";
  WEB3_PROVIDER = "wss://mainnet.infura.io/ws/v3/f039330d8fb747e48a7ce98f51400d65";
  leapNetwork = "Leap Network";

  // mainnet sunDAI for Plasma DAI
  P_DAI_TOKEN_ADDR = '0x3cC0DF021dD36eb378976142Dc1dE3F5726bFc48';

  MARKET_MAKER = 'https://k238oyefqc.execute-api.eu-west-1.amazonaws.com/mainnet';
  
  CLAIM_RELAY = false;
  ERC20NAME = false;
  ERC20TOKEN = false;
  ERC20IMAGE = false;
}
else if (window.location.hostname.indexOf("sundai.local") >= 0 ||
         window.location.hostname.indexOf("sundai.fritz.box") >= 0) {
  XDAI_PROVIDER = "wss://testnet-node1.leapdao.org:1443";
  WEB3_PROVIDER = "wss://rinkeby.infura.io/ws/v3/f039330d8fb747e48a7ce98f51400d65";
  leapNetwork = "Leap Testnet";

  // testnet sunDAI for Plasma DAI
  DAI_TOKEN_ADDR = '0xD2D0F8a6ADfF16C2098101087f9548465EC96C98';
  P_DAI_TOKEN_ADDR = '0xeFb369E2c694Bc0ba31945e0D3ac91Ab8E943be3';

  // Testnet Leap Bridge(ExitHandler)
  BRIDGE_ADDR = '0x2c2a3b359edbCFE3c3Ac0cD9f9F1349A96C02530';

  MARKET_MAKER = 'https://2nuxsb25he.execute-api.eu-west-1.amazonaws.com/testnet';
  CLAIM_RELAY = false;
  ERC20NAME = false;
  ERC20TOKEN = false;
  ERC20IMAGE = false;
}
else if (window.location.hostname.indexOf("buffidai") >= 0) {
  WEB3_PROVIDER = POA_XDAI_NODE;
  CLAIM_RELAY = 'https://x.xdai.io'
  ERC20NAME = 'BUFF'
  ERC20VENDOR = 'VendingMachine'
  ERC20TOKEN = 'ERC20Vendable'
  ERC20IMAGE = bufficorn
  LOADERIMAGE = bufficorn
}
else if (window.location.hostname.indexOf("burnerwallet.io") >= 0) {
  WEB3_PROVIDER = POA_XDAI_NODE;
  CLAIM_RELAY = 'https://x.xdai.io'
  ERC20NAME = 'BURN'
  ERC20VENDOR = 'BurnerVendor'
  ERC20TOKEN = 'Burner'
  ERC20IMAGE = cypherpunk
  LOADERIMAGE = cypherpunk
}
else if (window.location.hostname.indexOf("burnerwithrelays") >= 0) {
  WEB3_PROVIDER = "https://dai.poa.network";
  ERC20NAME = false
  ERC20TOKEN = false
  ERC20IMAGE = false
}

if(ERC20NAME=="BUFF"){
  mainStyle.backgroundImage = "linear-gradient(#540d48, #20012d)"
  mainStyle.backgroundColor = "#20012d"
  mainStyle.mainColor = "#b6299e"
  mainStyle.mainColorAlt = "#de3ec3"
  title = "BuffiDai.io"
  titleImage = (
    <img src={bufficorn} style={{
      maxWidth:50,
      maxHeight:50,
      marginRight:15,
      marginTop:-10
    }}/>
  )
} else if(ERC20NAME=="BURN"){
  mainStyle.backgroundImage = "linear-gradient(#4923d8, #6c0664)"
  mainStyle.backgroundColor = "#6c0664"
  mainStyle.mainColor = "#e72da3"
  mainStyle.mainColorAlt = "#f948b8"
  title = "Burner"
  titleImage = (
    <img src={cypherpunk} style={{
      maxWidth:50,
      maxHeight:50,
      marginRight:15,
      marginTop:-10
    }}/>
  )
}


let innerStyle = {
  maxWidth:740,
  margin:'0 auto',
  textAlign:'left'
}

let buttonStyle = {
  primary: {
    backgroundImage:"linear-gradient("+mainStyle.mainColorAlt+","+mainStyle.mainColor+")",
    backgroundColor:mainStyle.mainColor,
    color:"#FFFFFF",
    whiteSpace:"nowrap",
    cursor:"pointer",
  },
  secondary: {
    border:"2px solid "+mainStyle.mainColor,
    color:mainStyle.mainColor,
    whiteSpace:"nowrap",
    cursor:"pointer",
  }
}

const invLogoStyle = {
  maxWidth:50,
  maxHeight:50,
}

let metaReceiptTracker = {}


const BLOCKS_TO_PARSE_PER_BLOCKTIME = 32
const MAX_BLOCK_TO_LOOK_BACK = 512//don't look back more than 512 blocks

let dollarSymbol = "€"
let dollarConversion = 1.0
//let dollarSymbol = "€"
//let dollarConversion = 0.88
let convertToDollar = (amount)=>{
  return (parseFloat(amount)/dollarConversion)
}
let convertFromDollar = (amount)=>{
  return (parseFloat(amount)*dollarConversion)
}
let dollarDisplay = (amount)=>{
  let floatAmount = parseFloat(amount)
  amount = Math.floor(amount*100)/100
  return convertFromDollar(amount).toFixed(2)+dollarSymbol
}

let interval
let intervalLong

export default class App extends Component {
  constructor(props) {


    console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[["+title+"]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]")
    let view = 'main'
    let cachedView = localStorage.getItem("view")
    let cachedViewSetAge = Date.now() - localStorage.getItem("viewSetTime")
    if(HARDCODEVIEW){
      view = HARDCODEVIEW
    }else if(cachedViewSetAge < 300000 && cachedView&&cachedView!=0){
      view = cachedView
    }
    console.log("CACHED VIEW",view)
    super(props);
    this.state = {
      web3: false,
      account: false,
      gwei: 1.1,
      view: view,
      sendLink: "",
      sendKey: "",
      alert: null,
      loadingTitle:'loading...',
      title: title,
      extraHeadroom:0,
      balance: 0.00,
      vendors: {},
      ethprice: 0.00,
      hasUpdateOnce: false,
      badges: {},
      selectedBadge: false,
    };
    this.alertTimeout = null;

    try{
      RNMessageChannel.on('json', update => {
        try{
          let safeUpdate = {}
          if(update.title) safeUpdate.title = update.title
          if(update.extraHeadroom) safeUpdate.extraHeadroom = update.extraHeadroom
          if(update.possibleNewPrivateKey) safeUpdate.possibleNewPrivateKey = update.possibleNewPrivateKey
          this.setState(safeUpdate,()=>{
            if(this.state.possibleNewPrivateKey){
              this.dealWithPossibleNewPrivateKey()
            }
          })
        }catch(e){console.log(e)}
      })
    }catch(e){console.log(e)}

  }
  parseAndCleanPath(path){
    let parts = path.split(";")
    //console.log("PARTS",parts)
    let state = {}
    if(parts.length>0){
      state.toAddress = parts[0].replace("/","")
    }
    if(parts.length>=2){
      state.amount = parts[1]
    }
    if(parts.length>2){
      state.message = decodeURI(parts[2]).replaceAll("%23","#").replaceAll("%3B",";").replaceAll("%3A",":").replaceAll("%2F","/")
    }
    if(parts.length>3){
      state.extraMessage = decodeURI(parts[3]).replaceAll("%23","#").replaceAll("%3B",";").replaceAll("%3A",":").replaceAll("%2F","/")
    }
    //console.log("STATE",state)
    return state;
  }
  selectBadge(id){
    this.setState({selectedBadge:id},()=>{
      this.changeView('send_badge')
    })
  }
  openScanner(returnState){
    this.setState({returnState:returnState, scannerOpen: true})
  }
  returnToState(scannerState){
    let updateState = Object.assign({scannerState}, this.state.returnState);
    updateState.scannerOpen = false
    updateState.returnState = false
    console.log("UPDATE FROM RETURN STATE",updateState)
    this.setState(updateState)
  }
  clearBadges() {
    this.setState({badges:{}, badgeBalance: 0},()=>{
      console.log("BADGES CLEARED",this.state.badges)
    })
  }
  updateDimensions() {
    //force it to rerender when the window is resized to make sure qr fits etc
    this.forceUpdate();
  }
  saveKey(update){
    this.setState(update)
  }
  componentDidMount(){

    document.body.style.backgroundColor = mainStyle.backgroundColor
    console.log("document.getElementsByClassName('className').style",document.getElementsByClassName('.btn').style)
    window.addEventListener("resize", this.updateDimensions.bind(this));
    if(window.location.pathname){
      console.log("PATH",window.location.pathname,window.location.pathname.length,window.location.hash)
      if(window.location.pathname.indexOf("/pk")>=0){
        let tempweb3 = new Web3();
        let base64encodedPK = window.location.hash.replace("#","")
        let rawPK = tempweb3.utils.bytesToHex(base64url.toBuffer(base64encodedPK))
        this.setState({possibleNewPrivateKey:rawPK})
        window.history.pushState({},"", "/");
      }else if(window.location.pathname.length==43){
        this.changeView('send_to_address')
        console.log("CHANGE VIEW")
      }else if(window.location.pathname.length==134){
        let parts = window.location.pathname.split(";")
        let claimId = parts[0].replace("/","")
        let claimKey = parts[1]
        console.log("DO CLAIM",claimId,claimKey)
        this.setState({claimId,claimKey})
        window.history.pushState({},"", "/");
      }else if(
        (window.location.pathname.length>=65&&window.location.pathname.length<=67&&window.location.pathname.indexOf(";")<0) ||
        (window.location.hash.length>=65 && window.location.hash.length <=67 && window.location.hash.indexOf(";")<0)
      ){
        console.log("incoming private key")
        let privateKey = window.location.pathname.replace("/","")
        if(window.location.hash){
          privateKey = window.location.hash
        }
        privateKey = privateKey.replace("#","")
        if(privateKey.indexOf("0x")!=0){
          privateKey="0x"+privateKey
        }
        //console.log("!!! possibleNewPrivateKey",privateKey)
        this.setState({possibleNewPrivateKey:privateKey})
        window.history.pushState({},"", "/");
      }else if(window.location.pathname.indexOf("/vendors;")==0){
        this.changeView('vendors')
      }else{
        let parts = window.location.pathname.split(";")
        console.log("PARTS",parts)
        if(parts.length>=2){
          let sendToAddress = parts[0].replace("/","")
          let sendToAmount = parts[1]
          let extraData = ""
          if(parts.length>=3){
            extraData = parts[2]
          }
          if((parseFloat(sendToAmount)>0 || extraData) && sendToAddress.length==42){
            this.changeView('send_to_address')
          }
        }
      }
    }
    this.poll.bind(this)();
    interval = setInterval(this.poll.bind(this),1500)
    intervalLong = setInterval(this.longPoll.bind(this),45000)
    setTimeout(this.longPoll.bind(this),150)

    let mainnetweb3 = new Web3(WEB3_PROVIDER);
    let ensContract = new mainnetweb3.eth.Contract(require("./contracts/ENS.abi.js"),require("./contracts/ENS.address.js"))
    let daiContract;
    let bridgeContract;
    try{
      daiContract = new mainnetweb3.eth.Contract(require("./contracts/StableCoin.abi.js"),DAI_TOKEN_ADDR)
      bridgeContract = new mainnetweb3.eth.Contract(require("./contracts/Bridge.abi.js"), BRIDGE_ADDR)
    }catch(e){
      console.log("ERROR LOADING DAI Stablecoin Contract",e)
    }
    this.setState({mainnetweb3,ensContract,daiContract,bridgeContract})
  }
  componentWillUnmount() {
    clearInterval(interval)
    clearInterval(intervalLong)
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  async fetchBadgesPlasma(color) {
    const {xdaiweb3, account, badgeBalance} = this.state;
    if (xdaiweb3) {
      const queenId =
        '0x000000000000000000000000000000000000000000000000000000000000053A';

      const colors = await new Promise((resolve, reject) => {
        xdaiweb3.currentProvider.send(
          {
            jsonrpc: '2.0',
            id: 42,
            method: 'plasma_getColors',
            params: [false, true],
          },
          (err, {result}) => {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          },
        );
      });
      const tokenAddr = colors[color - NST_COLOR_BASE]
        .replace('0x', '')
        .toLowerCase();

      const unspent = await new Promise((resolve, reject) => {
        xdaiweb3.currentProvider.send(
          {
            jsonrpc: '2.0',
            id: 42,
            method: 'plasma_unspent',
            params: [account, color],
          },
          (err, {result}) => {
            if (err) {
              return reject(err);
            }
            return resolve(result);
          },
        );
      });
      const badges = unspent.reduce((initVal, currVal) => {
        const tokenId = currVal.output.value;
        initVal[tokenId] = {
          hash: this.toIPFSHash(currVal.output.data),
          id: tokenId
        }
        return initVal;
      }, {});

      let tokenIds = Object.keys(badges);

      if (badgeBalance !== tokenIds.length) {
        for (let i = 0; i < tokenIds.length; i++) {
          const tokenId = tokenIds[i];
          const hash = badges[tokenId].hash;
          badges[tokenId] = Object.assign(
            {id: tokenId},
            (await axios.get(`https://ipfs.infura.io/ipfs/${hash}`)).data
          )
        }
        this.setState({badges, badgeBalance: tokenIds.length});
      }
    }
  }

  toIPFSHash(data) {
    // NOTE: We currently hard code the IPFS hash to SHA2-256
    const algorithm = "12";
    const size = "20";
    data = data.substring(2, data.length);
    data = algorithm + size + data;
    return bs58.encode(Buffer.from(data, "hex"));
  }

  async poll() {
    const { web3, contracts, account } = this.state;

    try {
        await this.fetchBadgesPlasma(49154);
    } catch(err) {
      // NOTE: A changeAlert here confused some people. Especially when 
      // everything worked as expected but e.g. some ipfs links from Infura
      // timed out. We hence decided to only return the error in the console.
      console.log(err);
    }

    //console.log(">>>>>>> <<< >>>>>> Looking into iframe...")
    //console.log(document.getElementById('galleassFrame').contentWindow['web3'])

    if(ERC20TOKEN&&this.state.contracts&&(this.state.network=="xDai"||this.state.network=="Unknown")){
      let gasBalance = await this.state.web3.eth.getBalance(this.state.account)
      gasBalance = this.state.web3.utils.fromWei(""+gasBalance,'ether')
      //console.log("Getting balanceOf "+this.state.account+" in contract ",this.state.contracts[ERC20TOKEN])
      let tokenBalance = await this.state.contracts[ERC20TOKEN].balanceOf(this.state.account).call()
      //console.log("balance is ",tokenBalance)
      tokenBalance = this.state.web3.utils.fromWei(""+tokenBalance,'ether')

      //console.log("Getting admin from ",this.state.contracts[ERC20VENDOR])
      let isAdmin = await this.state.contracts[ERC20VENDOR].isAdmin(this.state.account).call()
      //console.log("ISADMIN",this.state.account,isAdmin)
      let isVendor = await this.state.contracts[ERC20VENDOR].vendors(this.state.account).call()
      //console.log("isVendor",isVendor)

      let vendorObject = this.state.vendorObject
      let products = []//this.state.products
      if(isVendor.isAllowed){
        //console.log("LOADING VENDOR PRODUCTS")
        let id = 0
        if(!vendorObject){
          let vendorData = await this.state.contracts[ERC20VENDOR].vendors(this.state.account).call()
          //console.log("vendorData",vendorData)
          vendorData.name = this.state.web3.utils.hexToUtf8(vendorData.name)
          vendorObject = vendorData
        }
        //console.log("Looking up products for vendor ",this.state.account)
        if(!products){
          products = []
        }
        let found = true
        while(found){
          let nextProduct = await this.state.contracts[ERC20VENDOR].products(this.state.account,id).call()
          if(nextProduct.exists){
            products[id++] = nextProduct
          }else{
            found=false
          }
        }
      }
      //console.log("isVendor",isVendor,"SAVING PRODUCTS",products)

      this.setState({gasBalance:gasBalance,balance:tokenBalance,isAdmin:isAdmin,isVendor:isVendor,hasUpdateOnce:true,vendorObject,products})
    }


    if(this.state.account){
      let ethBalance = 0.00
      let daiBalance = 0.00
      let xdaiBalance = 0.00

      if(this.state.mainnetweb3){

        try{
          ethBalance = await this.state.mainnetweb3.eth.getBalance(this.state.account)
          ethBalance = this.state.mainnetweb3.utils.fromWei(""+ethBalance,'ether')

          if(this.state.daiContract){
            daiBalance = await this.state.daiContract.methods.balanceOf(this.state.account).call()
            daiBalance = this.state.mainnetweb3.utils.fromWei(""+daiBalance,'ether')
          }
        }catch(e){
          console.log(e)
        }
      }
      if(this.state.xdaiweb3 && this.state.pdaiContract){
        xdaiBalance = await this.state.pdaiContract.methods.balanceOf(this.state.account).call();
        xdaiBalance = this.state.xdaiweb3.utils.fromWei(""+xdaiBalance,'ether')
      }

      this.setState({ethBalance,daiBalance,xdaiBalance,balance:xdaiBalance,hasUpdateOnce:true})
    }


  }
  longPoll() {
    axios.get("https://api.coinmarketcap.com/v2/ticker/1027/")
     .then((response)=>{
       let ethprice = response.data.data.quotes.USD.price
       this.setState({ethprice})
     })
  }
  setPossibleNewPrivateKey(value){
    this.setState({possibleNewPrivateKey:value},()=>{
      this.dealWithPossibleNewPrivateKey()
    })
  }
  async dealWithPossibleNewPrivateKey(){
    //this happens as page load and you need to wait until
    if(this.state && this.state.hasUpdateOnce){
      if(this.state.metaAccount && this.state.metaAccount.privateKey.replace("0x","") == this.state.possibleNewPrivateKey.replace("0x","")){
        this.setState({possibleNewPrivateKey:false})
        this.changeAlert({
          type: 'warning',
          message: 'Imported identical private key.',
        });
      }else{

        console.log("Checking on pk import...")
        console.log("this.state.balance",this.state.balance)
        console.log("this.state.metaAccount",this.state.metaAccount)
        console.log("this.state.xdaiBalance",this.state.xdaiBalance)
        console.log("this.state.daiBalance",this.state.daiBalance)
        console.log("this.state.isVendor",this.state.isVendor)


        console.log(!this.state.metaAccount || this.state.balance>=0.05 || this.state.xdaiBalance>=0.05 || this.state.ethBalance>=0.0005 || this.state.daiBalance>=0.05 || (this.state.isVendor&&this.state.isVendor.isAllowed))
        if(!this.state.metaAccount || this.state.balance>=0.05 || this.state.xdaiBalance>=0.05 || this.state.ethBalance>=0.0005 || this.state.daiBalance>=0.05 || (this.state.isVendor&&this.state.isVendor.isAllowed)){
          this.setState({possibleNewPrivateKey:false,withdrawFromPrivateKey:this.state.possibleNewPrivateKey},()=>{
            this.changeView('withdraw_from_private')
          })
        }else{
          this.setState({possibleNewPrivateKey:false,newPrivateKey:this.state.possibleNewPrivateKey})
          localStorage.setItem(this.state.account+"loadedBlocksTop","")
          localStorage.setItem(this.state.account+"recentTxs","")
          localStorage.setItem(this.state.account+"transactionsByAddress","")
          this.setState({recentTxs:[],transactionsByAddress:{},fullRecentTxs:[],fullTransactionsByAddress:{}})
        }
      }
    }else{
      setTimeout(this.dealWithPossibleNewPrivateKey.bind(this),500)
    }


  }
  componentDidUpdate(prevProps, prevState) {
    let { network, web3 } = this.state;
    if (web3 && network !== prevState.network /*&& !this.checkNetwork()*/) {
      console.log("WEB3 DETECTED BUT NOT RIGHT NETWORK",web3, network, prevState.network);
      //this.changeAlert({
      //  type: 'danger',
      //  message: 'Wrong Network. Please use Custom RPC endpoint: https://dai.poa.network or turn off MetaMask.'
      //}, false)
    }
  };
  checkNetwork() {
    let { network } = this.state;
    return network === "xDai" || network === "Unknown";
  }
  checkClaim(tx, contracts) {
    //check if we are trying to claim
    if (this.state.claimId && this.state.claimKey) {
      this.changeView('claimer')
      if (this.state.balance > 0.005) {
        this.chainClaim(tx, contracts);
      } else {
        this.relayClaim();
      }
    }
  }
  async ensLookup(name){
    let hash = namehash.hash(name)
    console.log("namehash",name,hash)
    let resolver = await this.state.ensContract.methods.resolver(hash).call()
    if(resolver=="0x0000000000000000000000000000000000000000") return "0x0000000000000000000000000000000000000000"
    console.log("resolver",resolver)
    let ensResolver = new this.state.mainnetweb3.eth.Contract(require("./contracts/ENSResolver.abi.js"),resolver)
    console.log("ensResolver:",ensResolver)
    return ensResolver.methods.addr(hash).call()
  }
  async chainClaim(tx, contracts) {
    console.log("DOING CLAIM ONCHAIN", this.state.claimId, this.state.claimKey, this.state.account);
    this.setState({sending: true})

    let fund = await contracts.Links.funds(this.state.claimId).call()
    console.log("FUND FOR "+this.state.claimId+" IS: ", fund)
    if (parseInt(fund[5].toString())>0) {
      this.setState({fund: fund})


      let claimHash = this.state.web3.utils.soliditySha3(
        {type: 'bytes32', value: this.state.claimId}, // fund id
        {type: 'address', value: this.state.account}, // destination address
        {type: 'uint256', value: fund[5]}, // nonce
        {type: 'address', value: contracts.Links._address} // contract address
      )
      console.log("claimHash", claimHash)
      console.log("this.state.claimKey", this.state.claimKey)
      let sig = this.state.web3.eth.accounts.sign(claimHash, this.state.claimKey);
      sig = sig.signature;

      console.log("CLAIM TX:", this.state.claimId, sig, claimHash, this.state.account)
      tx(contracts.Links.claim(this.state.claimId, sig, claimHash, this.state.account), 250000, false, 0, (result) => {
        if (result) {
          console.log("CLAIMED!!!", result)
          this.setState({claimed: true})
          setTimeout(() => {
            this.setState({sending: false}, () => {
              //alert("DONE")
              window.location = "/"
            })
          }, 2000)
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }else{
      console.log("FUND IS NOT READY YET, WAITING...")
      if(FAILCOUNT++>1){
        this.changeAlert({type: 'danger', message: 'Sorry. Failed to claim. Already claimed?'})
        setTimeout(() => {
          this.setState({sending: false}, () => {
            //alert("DONE")
            window.location = "/"
          })
        }, 2000)
      }
      setTimeout(()=>{
        this.chainClaim(tx, contracts)
      },3000)
    }

    this.forceUpdate();
  }
  async relayClaim() {
    console.log("DOING CLAIM THROUGH RELAY")
    let fund = await this.state.contracts.Links.funds(this.state.claimId).call()
      if (parseInt(fund[5].toString())>0) {
        this.setState({fund: fund})
        console.log("FUND: ", fund)

        let claimHash = this.state.web3.utils.soliditySha3(
          {type: 'bytes32', value: this.state.claimId}, // fund id
          {type: 'address', value: this.state.account}, // destination address
          {type: 'uint256', value: fund[5]}, // nonce
          {type: 'address', value: this.state.contracts.Links._address} // contract address
        )
        console.log("claimHash", claimHash)
        console.log("this.state.claimKey", this.state.claimKey)
        let sig = this.state.web3.eth.accounts.sign(claimHash, this.state.claimKey);
        sig = sig.signature
        /* getGasPrice() is not implemented on Metamask, leaving the code as reference. */
        //this.state.web3.eth.getGasPrice()
        //.then((gasPrice) => {

          console.log("CLAIM TX:", this.state.claimId, sig, claimHash, this.state.account)

          this.setState({sending: true})
        let relayClient = new gasless.RelayClient(this.state.web3);

        if(this.state.metaAccount && this.state.metaAccount.privateKey){
          relayClient.useKeypairForSigning(this.state.metaAccount)
        }
        console.log("Calling encodeABU on Links.claim() ",this.state.claimId, sig, claimHash, this.state.account)
        let claimData = this.state.contracts.Links.claim(this.state.claimId, sig, claimHash, this.state.account).encodeABI()
        //let network_gas_price = await this.state.web3.eth.getGasPrice();
        // Sometimes, xDai network returns '0'
        //if (!network_gas_price || network_gas_price == 0) {
        //  network_gas_price = 222222222222; // 222.(2) gwei
        //}
        let options = {
          from: this.state.account,
          to: this.state.contracts.Links._address,
          txfee: 12,
          gas_limit: 150000,
          gas_price: Math.trunc(1000000000 * 25)
        }
        console.log("Hitting relayClient with relayTransaction()",claimData, options)
        relayClient.relayTransaction(claimData, options).then((transaction) => {
            console.log("TX REALYED: ", transaction)
            this.setState({claimed: true})
            setTimeout(() => {
              this.setState({sending: false}, () => {
                //alert("DONE")
                window.location = "/"
              })
            }, 2000)
          })
      //})
      //.catch((error) => {
      //  console.log(error); //Get Gas price promise
      //});
    }else{
      this.changeAlert({type: 'danger', message: 'Sorry. Failed to claim. Already claimed?'})
      setTimeout(() => {
        this.setState({sending: false}, () => {
          //alert("DONE")
          window.location = "/"
        })
      }, 2000)
      console.log("Fund is not valid yet, trying again....")
      setTimeout(this.relayClaim,2000)
    }
  }
  setReceipt = (obj)=>{
    this.setState({receipt:obj})
  }
  changeView = (view,cb) => {
    if(view=="exchange"||view=="main"/*||view.indexOf("account_")==0*/){
      localStorage.setItem("view",view)//some pages should be sticky because of metamask reloads
      localStorage.setItem("viewSetTime",Date.now())
    }
    /*if (view.startsWith('send_with_link')||view.startsWith('send_to_address')) {
    console.log("This is a send...")
    console.log("BALANCE",this.state.balance)
    if (this.state.balance <= 0) {
    console.log("no funds...")
    this.changeAlert({
    type: 'danger',
    message: 'Insufficient funds',
  });
  return;
  }
  }
  */
  this.changeAlert(null);
  console.log("Setting state",view)
  this.setState({ view, scannerState:false },cb);
  };
  changeAlert = (alert, hide=true) => {
    clearTimeout(this.alertTimeout);
    this.setState({ alert });
    if (alert && hide) {
      this.alertTimeout = setTimeout(() => {
        this.setState({ alert: null });
      }, 2000);
    }
  };
  goBack(view="main"){
    console.log("GO BACK")
    this.changeView(view)
    this.setState({scannerOpen: false })
    setTimeout(()=>{window.scrollTo(0,0)},60)
  }
  async parseBlocks(parseBlock,recentTxs,transactionsByAddress){
    let web3;
    if (this.state.xdaiweb3) {
      web3 = this.state.xdaiweb3
    } else {
      web3 = this.state.web3
    }
    let block = await web3.eth.getBlock(parseBlock)
    let updatedTxs = false
    if(block){
      let transactions = block.transactions
  
      //console.log("transactions",transactions)
      for(let t in transactions){
        //console.log("TX",transactions[t])
        let tx = await web3.eth.getTransaction(transactions[t])
        // NOTE: NST information is encoded in a transaction's values. Hence if
        // we don't filter out NST transactions, they'll show up as huge
        // transfers in the UI.
        if(tx && tx.to && tx.from && !Util.isNST(tx.color)){
          //console.log("EEETRTTTTERTETETET",tx)
          let smallerTx = {
            hash:tx.hash,
            to:tx.to.toLowerCase(),
            from:tx.from.toLowerCase(),
            value:web3.utils.fromWei(""+tx.value,"ether"),
            blockNumber:tx.blockNumber
          }
  
  
          if(smallerTx.from==this.state.account || smallerTx.to==this.state.account){
            if(tx.input&&tx.input!="0x"){
  
              let decrypted = await this.decryptInput(tx.input)
  
              if(decrypted){
                smallerTx.data = decrypted
                smallerTx.encrypted = true
              }
  
              try{
                smallerTx.data = web3.utils.hexToUtf8(tx.input)
              }catch(e){}
              //console.log("smallerTx at this point",smallerTx)
              if(!smallerTx.data){
                smallerTx.data = " *** unable to decrypt data *** "
              }
            }
            updatedTxs = this.addTxIfAccountMatches(recentTxs,transactionsByAddress,smallerTx) || updatedTxs
          }
  
        }
      }
    }
    return updatedTxs
  }
  async decryptInput(input){
    let key = input.substring(0,32)
    //console.log("looking in memory for key",key)
    let cachedEncrypted = this.state[key]
    if(!cachedEncrypted){
      //console.log("nothing found in memory, checking local storage")
      cachedEncrypted = localStorage.getItem(key)
    }
    if(cachedEncrypted){
      return cachedEncrypted
    }else{
      if(this.state.metaAccount){
        try{
          let parsedData = EthCrypto.cipher.parse(input.substring(2))
          const endMessage = await EthCrypto.decryptWithPrivateKey(
            this.state.metaAccount.privateKey, // privateKey
            parsedData // encrypted-data
          );
          return  endMessage
        }catch(e){}
      }else{
        //no meta account? maybe try to setup signing keys?
        //maybe have a contract that tries do decrypt? \
      }
    }
    return false
  }
  initRecentTxs(){
    let recentTxs = []
    if(this.state.recentTx) recentTxs = recentTxs.concat(this.state.recentTxs)
    let transactionsByAddress = Object.assign({},this.state.transactionsByAddress)
    if(!recentTxs||recentTxs.length<=0){
      recentTxs = localStorage.getItem(this.state.account+"recentTxs")
      try{
        recentTxs=JSON.parse(recentTxs)
      }catch(e){
        recentTxs=[]
      }
    }
    if(!recentTxs){
      recentTxs=[]
    }
    if(Object.keys(transactionsByAddress).length === 0){
      transactionsByAddress = localStorage.getItem(this.state.account+"transactionsByAddress")
      try{
        transactionsByAddress=JSON.parse(transactionsByAddress)
      }catch(e){
        transactionsByAddress={}
      }
    }
    if(!transactionsByAddress){
      transactionsByAddress={}
    }
    return [recentTxs,transactionsByAddress]
  }
  addTxIfAccountMatches(recentTxs,transactionsByAddress,smallerTx){
    let updatedTxs = false
  
    let otherAccount = smallerTx.to
    if(smallerTx.to==this.state.account){
      otherAccount = smallerTx.from
    }
    if(!transactionsByAddress[otherAccount]){
      transactionsByAddress[otherAccount] = []
    }
  
    let found = false
    if(parseFloat(smallerTx.value)>0.005){
      for(let r in recentTxs){
        if(recentTxs[r].hash==smallerTx.hash/* && (!smallerTx.data || recentTxs[r].data == smallerTx.data)*/){
          found = true
          if(!smallerTx.data || recentTxs[r].data == smallerTx.data){
            // do nothing, it exists
          }else{
            recentTxs[r].data = smallerTx.data
            updatedTxs=true
          }
        }
      }
      if(!found){
        updatedTxs=true
        recentTxs.push(smallerTx)
        //console.log("recentTxs after push",recentTxs)
      }
    }
  
    found = false
    for(let t in transactionsByAddress[otherAccount]){
      if(transactionsByAddress[otherAccount][t].hash==smallerTx.hash/* && (!smallerTx.data || recentTxs[r].data == smallerTx.data)*/){
        found = true
        if(!smallerTx.data || transactionsByAddress[otherAccount][t].data == smallerTx.data){
          // do nothing, it exists
        }else{
          transactionsByAddress[otherAccount][t].data = smallerTx.data
          if(smallerTx.encrypted) transactionsByAddress[otherAccount][t].encrypted = true
          updatedTxs=true
        }
      }
    }
    if(!found){
      updatedTxs=true
      transactionsByAddress[otherAccount].push(smallerTx)
    }
  
    return updatedTxs
  }
  sortAndSaveTransactions(recentTxs,transactionsByAddress){
    recentTxs.sort(sortByBlockNumber)
  
    for(let t in transactionsByAddress){
      transactionsByAddress[t].sort(sortByBlockNumberDESC)
    }
    recentTxs = recentTxs.slice(0,12)
    localStorage.setItem(this.state.account+"recentTxs",JSON.stringify(recentTxs))
    localStorage.setItem(this.state.account+"transactionsByAddress",JSON.stringify(transactionsByAddress))
  
    this.setState({recentTxs:recentTxs,transactionsByAddress:transactionsByAddress},()=>{
      if(ERC20TOKEN){
        this.syncFullTransactions()
      }
    })
  }
  async addAllTransactionsFromList(recentTxs,transactionsByAddress,theList){
    let updatedTxs = false
  
    for(let e in theList){
      let thisEvent = theList[e]
      let cleanEvent = Object.assign({},thisEvent)
      cleanEvent.to = cleanEvent.to.toLowerCase()
      cleanEvent.from = cleanEvent.from.toLowerCase()
      cleanEvent.value = this.state.web3.utils.fromWei(""+cleanEvent.value,'ether')
      cleanEvent.token = ERC20TOKEN
      if(cleanEvent.data) {
        let decrypted = await this.decryptInput(cleanEvent.data)
        if(decrypted){
          cleanEvent.data = decrypted
          cleanEvent.encrypted = true
        }else{
          try{
            cleanEvent.data = this.state.web3.utils.hexToUtf8(cleanEvent.data)
          }catch(e){}
        }
      }
      updatedTxs = this.addTxIfAccountMatches(recentTxs,transactionsByAddress,cleanEvent) || updatedTxs
    }
    return updatedTxs
  }
  syncFullTransactions(){
    let initResult = this.initRecentTxs()
    let recentTxs = []
    recentTxs = recentTxs.concat(initResult[0])
    let transactionsByAddress = Object.assign({},initResult[1])
  
    let updatedTxs = false
    updatedTxs = this.addAllTransactionsFromList(recentTxs,transactionsByAddress,this.state.transferTo) || updatedTxs
    updatedTxs = this.addAllTransactionsFromList(recentTxs,transactionsByAddress,this.state.transferFrom) || updatedTxs
    updatedTxs = this.addAllTransactionsFromList(recentTxs,transactionsByAddress,this.state.transferToWithData) || updatedTxs
    updatedTxs = this.addAllTransactionsFromList(recentTxs,transactionsByAddress,this.state.transferFromWithData) || updatedTxs
  
    if(updatedTxs||!this.state.fullRecentTxs||!this.state.fullTransactionsByAddress){
      recentTxs.sort(sortByBlockNumber)
      for(let t in transactionsByAddress){
        transactionsByAddress[t].sort(sortByBlockNumberDESC)
      }
      recentTxs = recentTxs.slice(0,12)
      //console.log("FULLRECENT",recentTxs)
      this.setState({fullRecentTxs:recentTxs,fullTransactionsByAddress:transactionsByAddress})
    }
  }
  render() {
    let {
      web3, account, tx, gwei, block, avgBlockTime, etherscan, balance, metaAccount, burnMetaAccount, view, alert, send
    } = this.state;
  
    let networkOverlay = ""
    // if(web3 && !this.checkNetwork() && view!="exchange"){
    //   networkOverlay = (
    //     <div>
    //       <input style={{zIndex:13,position:'absolute',opacity:0.95,right:48,top:192,width:194}} value="https://dai.poa.network" />
    //       <img style={{zIndex:12,position:'absolute',opacity:0.95,right:0,top:0,maxHeight:370}} src={customRPCHint} />
    //     </div>
    //   )
    // }
  
  
    let web3_setup = ""
    if(web3){
      web3_setup = (
        <div>
        <ContractLoader
        key="ContractLoader"
        config={{DEBUG: true}}
        web3={web3}
        require={path => {
          return require(`${__dirname}/${path}`)
        }}
        onReady={(contracts, customLoader) => {
          console.log("contracts loaded", contracts)
          this.setState({contracts: contracts,customLoader: customLoader}, async () => {
            console.log("Contracts Are Ready:", contracts)
            this.checkClaim(tx, contracts);
          })
        }}
        />
        <Transactions
        key="Transactions"
        config={{DEBUG: false, hide: true}}
        account={account}
        gwei={gwei}
        web3={web3}
        block={block}
        avgBlockTime={avgBlockTime}
        etherscan={etherscan}
        metaAccount={metaAccount}
        onReady={(state) => {
          console.log("Transactions component is ready:", state);
          state.nativeSend = tokenSend.bind(this)
          //delete state.send
          state.send = tokenSend.bind(this)
          console.log(state)
          this.setState(state)
  
        }}
        onReceipt={(transaction, receipt) => {
          // this is one way to get the deployed contract address, but instead I'll switch
          //  to a more straight forward callback system above
          console.log("Transaction Receipt", transaction, receipt)
        }}
        />
        </div>
      )
    }
  
    let eventParser = ""
  
  
    let extraHead = ""
    if(this.state.extraHeadroom){
      extraHead = (
        <div style={{marginTop:this.state.extraHeadroom}}>
        </div>
      )
    }
  
    let totalBalance = parseFloat(this.state.ethBalance) * parseFloat(this.state.ethprice) + parseFloat(this.state.daiBalance) + parseFloat(this.state.xdaiBalance)
    if(ERC20TOKEN){
      totalBalance += parseFloat(this.state.balance)
    }
  
    let header = (
      <div style={{height:50}}>
      </div>
    )
    if(web3){
      header = (
        <Header
          openScanner={this.openScanner.bind(this)}
          network={leapNetwork || this.state.network}
          total={totalBalance}
          ens={this.state.ens}
          title={this.state.title}
          titleImage={titleImage}
          mainStyle={mainStyle}
          address={this.state.account}
          changeView={this.changeView}
          balance={balance}
          view={this.state.view}
          dollarDisplay={dollarDisplay}
        />
      )
    }
  
    return (
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <div style={mainStyle}>
            <div style={innerStyle}>
              {extraHead}
              {networkOverlay}
              {web3_setup}
  
              <div>
                {header}
  
  
  
              {web3 /*&& this.checkNetwork()*/ && (() => {
                //console.log("VIEW:",view)
  
                let moreButtons = (
                  <MoreButtons
                    buttonStyle={buttonStyle}
                    changeView={this.changeView}
                    isVendor={this.state.isVendor&&this.state.isVendor.isAllowed}
                  />
                )
  
                let subBalanceDisplay = ""
                if(ERC20TOKEN){
                  if(!this.state.gasBalance){
                    subBalanceDisplay = ""
                  }else{
                    subBalanceDisplay = (
                      <div style={{opacity:0.4,fontSize:12,position:'absolute',right:0,marginTop:5}}>
                        {Math.round(this.state.gasBalance*10000)/10000}
                      </div>
                    )
                  }

                if(this.state.isAdmin){
                  moreButtons = (
                    <div>
                      <Admin
                        ERC20VENDOR={ERC20VENDOR}
                        ERC20TOKEN={ERC20TOKEN}
                        vendors={this.state.vendors}
                        buttonStyle={buttonStyle}
                        changeView={this.changeView}
                        contracts={this.state.contracts}
                        tx={this.state.tx}
                        web3={this.state.web3}
                      />
                      <MoreButtons
                        buttonStyle={buttonStyle}
                        changeView={this.changeView}
                        isVendor={false}
                      />
                    </div>
                  )
                }else if(this.state.isVendor&&this.state.isVendor.isAllowed){
                  moreButtons = (
                    <div>
                      <Vendor
                        ERC20VENDOR={ERC20VENDOR}
                        products={this.state.products}
                        address={account}
                        buttonStyle={buttonStyle}
                        changeView={this.changeView}
                        changeAlert={this.changeAlert}
                        contracts={this.state.contracts}
                        vendor={this.state.isVendor}
                        tx={this.state.tx}
                        web3={this.state.web3}
                        dollarDisplay={dollarDisplay}
                      />
                      <MoreButtons
                        buttonStyle={buttonStyle}
                        changeView={this.changeView}
                        isVendor={true}
                      />
                    </div>
                  )
                }else if(ERC20TOKEN){
                  moreButtons = (
                    <div>
                      <MoreButtons
                        buttonStyle={buttonStyle}
                        changeView={this.changeView}
                        isVendor={false}
                      />
                    </div>
                  )
                }else{
                  moreButtons = ""
                }

                if(this.state.contracts){
                  eventParser = (
                    <div style={{color:"#000000"}}>
                      <Events
                        config={{hide:true}}
                        contract={this.state.contracts[ERC20TOKEN]}
                        eventName={"Transfer"}
                        block={this.state.block}
                        filter={{from:this.state.account}}
                        onUpdate={(eventData,allEvents)=>{this.setState({transferFrom:allEvents},this.syncFullTransactions)}}
                      />
                      <Events
                        config={{hide:true}}
                        contract={this.state.contracts[ERC20TOKEN]}
                        eventName={"Transfer"}
                        block={this.state.block}
                        filter={{to:this.state.account}}
                        onUpdate={(eventData,allEvents)=>{this.setState({transferTo:allEvents},this.syncFullTransactions)}}
                      />
                      <Events
                        config={{hide:true}}
                        contract={this.state.contracts[ERC20TOKEN]}
                        eventName={"TransferWithData"}
                        block={this.state.block}
                        filter={{from:this.state.account}}
                        onUpdate={(eventData,allEvents)=>{this.setState({transferFromWithData:allEvents},this.syncFullTransactions)}}
                      />
                      <Events
                        config={{hide:true}}
                        contract={this.state.contracts[ERC20TOKEN]}
                        eventName={"TransferWithData"}
                        block={this.state.block}
                        filter={{to:this.state.account}}
                        onUpdate={(eventData,allEvents)=>{this.setState({transferToWithData:allEvents},this.syncFullTransactions)}}
                      />
                      <Events
                        config={{hide:true}}
                        contract={this.state.contracts[ERC20VENDOR]}
                        eventName={"UpdateVendor"}
                        block={this.state.block}
                        onUpdate={(vendor, all)=>{
                          let {vendors} = this.state
                          console.log("VENDOR",vendor)
                          if(!vendors[vendor.vendor] || vendors[vendor.vendor].blockNumber<vendor.blockNumber){
                            vendors[vendor.vendor] = {
                              name: this.state.web3.utils.hexToUtf8(vendor.name),
                              isAllowed: vendor.isAllowed,
                              isActive: vendor.isActive,
                              vendor: vendor.vendor,
                              blockNumber: vendor.blockNumber
                            }
                          }
                          this.setState({vendors})
                        }}
                      />
                    </div>
                  )
                }
              }

              let selected = "xDai"
              let extraTokens = ""

              let defaultBalanceDisplay = (
                <div>
                  <Balance icon={xdai} selected={false} text={"MNY"} amount={this.state.xdaiBalance} address={account} dollarDisplay={dollarDisplay} />
                </div>
              )

              if(ERC20TOKEN){
                selected = ERC20NAME
                extraTokens = (
                  <div>
                    <Balance icon={ERC20IMAGE} selected={selected} text={"MNY"} amount={this.state.balance} address={account} dollarDisplay={dollarDisplay} />
                  </div>
                )
                defaultBalanceDisplay = extraTokens
              }

              if(view.indexOf("account_")==0)
              {

                let targetAddress = view.replace("account_","")
                console.log("TARGET",targetAddress)
                return (
                  <div>
                    <Card>

                      <NavCard title={(
                        <div>
                          {i18n.t('history_chat')}
                        </div>
                      )} goBack={this.goBack.bind(this)}/>
                      {defaultBalanceDisplay}
                      <History
                        buttonStyle={buttonStyle}
                        saveKey={this.saveKey.bind(this)}
                        metaAccount={this.state.metaAccount}
                        transactionsByAddress={ERC20TOKEN?this.state.fullTransactionsByAddress:this.state.transactionsByAddress}
                        address={account}
                        balance={balance}
                        changeAlert={this.changeAlert}
                        changeView={this.changeView}
                        target={targetAddress}
                        block={this.state.block}
                        send={this.state.send}
                        web3={this.state.web3}
                        goBack={this.goBack.bind(this)}
                        dollarDisplay={dollarDisplay}
                      />
                    </Card>

                    <Bottom
                      action={()=>{
                        this.changeView('main')
                      }}
                    />
                  </div>

                )
              }

              let badgeDisplay = ""
              if(this.state.badgeBalance>0){
                badgeDisplay = (
                  <div>
                    <Badges
                      badges={this.state.badges}
                      address={account}
                      selectBadge={this.selectBadge.bind(this)}
                    />
                    <Ruler/>
                  </div>
                );
              }
              const sendByScan = (
                <SendByScan
                  parseAndCleanPath={this.parseAndCleanPath.bind(this)}
                  returnToState={this.returnToState.bind(this)}
                  returnState={this.state.returnState}
                  mainStyle={mainStyle}
                  goBack={this.goBack.bind(this)}
                  changeView={this.changeView}
                  onError={(error) =>{
                    this.changeAlert("danger",error)
                  }}
                />
              )
  
              switch(view) {
                case 'main':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <Card p={3}>
                      {extraTokens}

                      <Balance icon={xdai} selected={selected} text={"MNY"} amount={this.state.xdaiBalance} address={account} dollarDisplay={dollarDisplay}/>

                      {badgeDisplay}

                      <MainCard
                        subBalanceDisplay={subBalanceDisplay}
                        buttonStyle={buttonStyle}
                        address={account}
                        balance={balance}
                        changeAlert={this.changeAlert}
                        changeView={this.changeView}
                        dollarDisplay={dollarDisplay}
                        ERC20TOKEN={ERC20TOKEN}
                      />
                      
                      <Box>
                        {moreButtons}
                      </Box>

                      <RecentTransactions
                        dollarDisplay={dollarDisplay}
                        view={this.state.view}
                        buttonStyle={buttonStyle}
                        ERC20TOKEN={ERC20TOKEN}
                        transactionsByAddress={ERC20TOKEN?this.state.fullTransactionsByAddress:this.state.transactionsByAddress}
                        changeView={this.changeView}
                        address={account}
                        block={this.state.block}
                        recentTxs={ERC20TOKEN?this.state.fullRecentTxs:this.state.recentTxs}
                      />

                    </Card>
                    <Bottom
                      icon={"Settings"}
                      text={i18n.t('advance_title')}
                      action={()=>{
                        this.changeView('advanced')
                      }}
                    />
                  </div>
                );
                case 'advanced':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <Card p={3}>
                      <NavCard title={i18n.t('advance_title')} goBack={this.goBack.bind(this)}/>
                      <Advanced
                        isVendor={this.state.isVendor && this.state.isVendor.isAllowed}
                        buttonStyle={buttonStyle}
                        address={account}
                        balance={balance}
                        changeView={this.changeView}
                        privateKey={metaAccount.privateKey}
                        changeAlert={this.changeAlert}
                        dollarDisplay={dollarDisplay}
                        badge={this.state.badges[this.state.selectedBadge]}
                        clearBadges={this.clearBadges.bind(this)}
                      />
                    </Card>
                    <Bottom
                      text={i18n.t('done')}
                      action={this.goBack.bind(this)}
                    />
                  </div>
                )
                case 'withdraw_from_private':
                  return (
                    <div>
                      {this.state.scannerOpen ? sendByScan : null}
                      <Card p={3} style={{zIndex:1}}>
                        <NavCard title={i18n.t('withdraw')} goBack={this.goBack.bind(this)}/>
                        {defaultBalanceDisplay}
                        <WithdrawFromPrivate
                          ERC20TOKEN={ERC20TOKEN}
                          products={this.state.products}
                          buttonStyle={buttonStyle}
                          balance={balance}
                          address={account}
                          contracts={this.state.contracts}
                          web3={this.state.web3}
                          xdaiweb3={this.state.xdaiweb3}
                          pdaiContract={this.state.pdaiContract}
                          pDaiTokenAddr={P_DAI_TOKEN_ADDR}
                          //amount={false}
                          privateKey={this.state.withdrawFromPrivateKey}
                          goBack={this.goBack.bind(this)}
                          changeView={this.changeView}
                          changeAlert={this.changeAlert}
                          dollarDisplay={dollarDisplay}
                          tokenSendV2={tokenSendV2.bind(this)}
                        />
                      </Card>
                      <Bottom
                        action={()=>{
                          this.changeView('main')
                        }}
                      />
                    </div>
                  );
                case 'send_badge':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <Card p={3} style={{zIndex:1}}>
                      <NavCard title="Transfer Movie" titleLink={this.state.badges[this.state.selectedBadge].external_url} goBack={this.goBack.bind(this)}/>
                      <SendBadge
                        changeView={this.changeView}
                        ensLookup={this.ensLookup.bind(this)}
                        ERC20TOKEN={ERC20TOKEN}
                        buttonStyle={buttonStyle}
                        balance={balance}
                        web3={this.state.web3}
                        xdaiweb3={this.state.xdaiweb3}
                        contracts={this.state.contracts}
                        address={account}
                        scannerState={this.state.scannerState}
                        tx={this.state.tx}
                        goBack={this.goBack.bind(this)}
                        openScanner={this.openScanner.bind(this)}
                        setReceipt={this.setReceipt}
                        changeAlert={this.changeAlert}
                        dollarDisplay={dollarDisplay}
                        badge={this.state.badges[this.state.selectedBadge]}
                        clearBadges={this.clearBadges.bind(this)}
                        tokenSendV2={tokenSendV2.bind(this)}
                        metaAccount={this.state.metaAccount}
                      />
                    </Card>
                    <Bottom
                      text={i18n.t('done')}
                      action={this.goBack.bind(this)}
                    />
                  </div>
                )
                case 'send_to_address':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <Card p={3} style={{zIndex:1}}>
                      <NavCard title={i18n.t('send_to_address_title')} goBack={this.goBack.bind(this)}/>
                      {defaultBalanceDisplay}
                      <SendToAddress
                        parseAndCleanPath={this.parseAndCleanPath.bind(this)}
                        openScanner={this.openScanner.bind(this)}
                        scannerState={this.state.scannerState}
                        ensLookup={this.ensLookup.bind(this)}
                        ERC20TOKEN={ERC20TOKEN}
                        buttonStyle={buttonStyle}
                        balance={balance}
                        web3={this.state.web3}
                        address={account}
                        send={send}
                        goBack={this.goBack.bind(this)}
                        changeView={this.changeView}
                        setReceipt={this.setReceipt}
                        changeAlert={this.changeAlert}
                        dollarDisplay={dollarDisplay}
                        convertToDollar={convertToDollar}
                        pDaiTokenAddr={P_DAI_TOKEN_ADDR}
                      />
                    </Card>
                    <Bottom
                      text={i18n.t('cancel')}
                      action={this.goBack.bind(this)}
                    />
                  </div>
                );
                case 'receipt':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <Card p={3}>
                      <NavCard title={i18n.t('receipt_title')} goBack={this.goBack.bind(this)}/>
                      <Receipt
                        receipt={this.state.receipt}
                        view={this.state.view}
                        block={this.state.block}
                        ensLookup={this.ensLookup.bind(this)}
                        ERC20TOKEN={ERC20TOKEN}
                        buttonStyle={buttonStyle}
                        balance={balance}
                        web3={this.state.web3}
                        address={account}
                        send={send}
                        goBack={this.goBack.bind(this)}
                        changeView={this.changeView}
                        changeAlert={this.changeAlert}
                        dollarDisplay={dollarDisplay}
                        transactionsByAddress={this.state.transactionsByAddress}
                        fullTransactionsByAddress={this.state.fullTransactionsByAddress}
                        fullRecentTxs={this.state.fullRecentTxs}
                        recentTxs={this.state.recentTxs}
                      />
                    </Card>
                    <Bottom
                      action={this.goBack.bind(this)}
                    />
                  </div>
                );
                case 'receive':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <Card p={3}>
                      <NavCard title={i18n.t('receive_title')} goBack={this.goBack.bind(this)}/>
                      {defaultBalanceDisplay}
                      <Receive
                        view={this.state.view}
                        block={this.state.block}
                        ensLookup={this.ensLookup.bind(this)}
                        ERC20TOKEN={ERC20TOKEN}
                        buttonStyle={buttonStyle}
                        balance={balance}
                        web3={this.state.web3}
                        address={account}
                        send={send}
                        goBack={this.goBack.bind(this)}
                        changeView={this.changeView}
                        changeAlert={this.changeAlert}
                        dollarDisplay={dollarDisplay}
                        transactionsByAddress={this.state.transactionsByAddress}
                        fullTransactionsByAddress={this.state.fullTransactionsByAddress}
                        fullRecentTxs={this.state.fullRecentTxs}
                        recentTxs={this.state.recentTxs}
                      />
                    </Card>
                    <Bottom
                      action={this.goBack.bind(this)}
                    />
                  </div>
                );
                  case 'request_funds':
                  return (
                    <div>
                      {this.state.scannerOpen ? sendByScan : null}
                      <Card p={3}>
                        <NavCard title={i18n.t('request_funds_title')} goBack={this.goBack.bind(this)}/>
                        {defaultBalanceDisplay}
                        <RequestFunds
                          block={this.state.block}
                          view={this.state.view}
                          mainStyle={mainStyle}
                          buttonStyle={buttonStyle}
                          balance={balance}
                          address={account}
                          send={send}
                          goBack={this.goBack.bind(this)}
                          changeView={this.changeView}
                          changeAlert={this.changeAlert}
                          dollarDisplay={dollarDisplay}
                          transactionsByAddress={this.state.transactionsByAddress}
                          fullTransactionsByAddress={this.state.fullTransactionsByAddress}
                          fullRecentTxs={this.state.fullRecentTxs}
                          recentTxs={this.state.recentTxs}
                        />
                      </Card>
                      <Bottom
                        action={()=>{
                          this.changeView('main')
                        }}
                      />
                    </div>
                  );
                  case 'share':
  
                    let url = window.location.protocol+"//"+window.location.hostname
                    if(window.location.port&&window.location.port!=80&&window.location.port!=443){
                      url = url+":"+window.location.port
                    }
  
                    return (
                      <div>
                        {this.state.scannerOpen ? sendByScan : null}
                        <Card p={3}>
                          <NavCard title={url} goBack={this.goBack.bind(this)} />
                          <Share
                            title={url}
                            url={url}
                            mainStyle={mainStyle}
                            sendKey={this.state.sendKey}
                            sendLink={this.state.sendLink}
                            balance={balance}
                            address={account}
                            contracts={this.state.contracts}
                            web3={web3}
                            //amount={false}
                            privateKey={this.state.withdrawFromPrivateKey}
                            goBack={this.goBack.bind(this)}
                            changeView={this.changeView}
                            changeAlert={this.changeAlert}
                            dollarDisplay={dollarDisplay}
                          />
                        </Card>
                        <Bottom
                          action={this.goBack.bind(this)}
                        />
                      </div>
                    );
                  case 'share-link':
                    return (
                      <div>
                        {this.state.scannerOpen ? sendByScan : null}
                        <Card p={3}>
                          <NavCard title={'Share Link'} goBack={this.goBack.bind(this)} />
                            <ShareLink
                              sendKey={this.state.sendKey}
                              sendLink={this.state.sendLink}
                              balance={balance}
                              address={account}
                              changeAlert={this.changeAlert}
                              goBack={this.goBack.bind(this)}
                            />
                        </Card>
                        <Bottom
                          action={this.goBack.bind(this)}
                        />
                      </div>
                    );
                  case 'send_with_link':
                  return (
                    <div>
                      {this.state.scannerOpen ? sendByScan : null}
                      <Card p={3}>
                        <NavCard title={'Send with Link'} goBack={this.goBack.bind(this)} />
                        {defaultBalanceDisplay}
                        <SendWithLink balance={balance}
                          buttonStyle={buttonStyle}
                          changeAlert={this.changeAlert}
                          sendWithLink={(amount,cb)=>{
                            let randomHash = this.state.web3.utils.sha3(""+Math.random())
                            let randomWallet = this.state.web3.eth.accounts.create()
                            let sig = this.state.web3.eth.accounts.sign(randomHash, randomWallet.privateKey);
                            console.log("STATE",this.state,this.state.contracts)
                            this.state.tx(this.state.contracts.Links.send(randomHash,sig.signature,0,amount*10**18,7),250000,false,amount*10**18,async (receipt)=>{
                              this.setState({sendLink: randomHash,sendKey: randomWallet.privateKey},()=>{
                                console.log("STATE SAVED",this.state)
                              })
                              cb(receipt)
                            })
                          }}
                          address={account}
                          changeView={this.changeView}
                          goBack={this.goBack.bind(this)}
                          dollarDisplay={dollarDisplay}
                          convertToDollar={convertToDollar}
                        />
                      </Card>
                      <Bottom
                        text={i18n.t('cancel')}
                        action={this.goBack.bind(this)}
                      />
                    </div>
                  );
                  case 'burn-wallet':
                  return (
                    <div>
                      {this.state.scannerOpen ? sendByScan : null}
                      <Card p={3}>
                        <NavCard title={"Burn Private Key"} goBack={this.goBack.bind(this)}/>
                        {defaultBalanceDisplay}
                        <BurnWallet
                        mainStyle={mainStyle}
                        address={account}
                        balance={balance}
                        goBack={this.goBack.bind(this)}
                        dollarDisplay={dollarDisplay}
                        burnWallet={()=>{
                          burnMetaAccount()
                          if(RNMessageChannel){
                            RNMessageChannel.send("burn")
                          }
                          if(localStorage&&typeof localStorage.setItem == "function"){
                            localStorage.setItem(this.state.account+"loadedBlocksTop","")
                            localStorage.setItem(this.state.account+"metaPrivateKey","")
                            localStorage.setItem(this.state.account+"recentTxs","")
                            localStorage.setItem(this.state.account+"transactionsByAddress","")
                            this.setState({recentTxs:[],transactionsByAddress:{}})
                          }
                        }}
                        />
                      </Card>
                      <Bottom
                        text={i18n.t('cancel')}
                        action={this.goBack.bind(this)}
                      />
                  </div>
                );
                case 'vendors':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <Card>
  
                      <NavCard title={i18n.t('vendors')} goBack={this.goBack.bind(this)}/>
                      <Vendors
                        ERC20VENDOR={ERC20VENDOR}
                        products={this.state.products}
                        vendorObject={this.state.vendorObject}
                        vendors={this.state.vendors}
                        address={account}
                        mainStyle={mainStyle}
                        changeView={this.changeView}
                        contracts={this.state.contracts}
                        vendor={this.state.isVendor}
                        tx={this.state.tx}
                        web3={this.state.web3}
                        block={this.state.block}
                        goBack={this.goBack.bind(this)}
                        dollarDisplay={dollarDisplay}
                      />
                    </Card>
                    <Bottom
                      action={this.goBack.bind(this)}
                    />
                  </div>
                );
                case 'loader':
                return (
                  <div>
                    <div style={{zIndex:1,position:"relative",color:"#dddddd"}}>
  
                      <NavCard title={"Sending..."} goBack={this.goBack.bind(this)} darkMode={true}/>
                    </div>
                    <Loader loaderImage={LOADERIMAGE} mainStyle={mainStyle}/>
                  </div>
                );
                case 'reader':
                return (
                  <div>
                    <div style={{zIndex:1,position:"relative",color:"#dddddd"}}>
                      <NavCard title={"Reading QRCode..."} goBack={this.goBack.bind(this)} darkMode={true}/>
                    </div>
                    <Loader loaderImage={LOADERIMAGE}  mainStyle={mainStyle}/>
                  </div>
                );
                case 'claimer':
                return (
                  <div>
                    <div style={{zIndex:1,position:"relative",color:"#dddddd"}}>
                      <NavCard title={"Claiming..."} goBack={this.goBack.bind(this)} darkMode={true}/>
                    </div>
                  <Loader loaderImage={LOADERIMAGE} mainStyle={mainStyle}/>
                  </div>
                );
                case 'mint':
                return (
                  <div>
                    {this.state.scannerOpen ? sendByScan : null}
                    <div className="send-to-address card w-100" style={{zIndex:1}}>
                      <NavCard title={i18n.t('mint.title')} goBack={this.goBack.bind(this)}/>
                      <RegisterMovie
                        mainnetweb3={this.state.mainnetweb3}
	                xdaiweb3={this.state.xdaiweb3}
                        ERC721Full={this.state.contracts.ERC721Full}
                        scannerState={this.state.scannerState}
                        openScanner={this.openScanner.bind(this)}
                        buttonStyle={buttonStyle}
                        web3={this.state.web3}
                        address={account}
                        goBack={this.goBack.bind(this)}
                        changeView={this.changeView}
                        changeAlert={this.changeAlert}
                        pTx={this.state.pTx}
                        setReceipt={this.setReceipt}
                      />
                    </div>
                    <Bottom
                      text={i18n.t('cancel')}
                      action={this.goBack.bind(this)}
                    />
                  </div>
                );
                default:
                return (
                  <div>unknown view</div>
                )
                }
          })()}
          { ( false ||  !web3 /*|| !this.checkNetwork() */) &&
            <div>
              <Loader loaderImage={LOADERIMAGE} mainStyle={mainStyle}/>
            </div>
          }
          { alert && <Footer alert={alert} changeAlert={this.changeAlert}/> }
          </div>
          <Dapparatus
              config={{
                DEBUG: false,
                hide: true,
                requiredNetwork: ['Unknown', 'xDai'],
                metatxAccountGenerator: false,
              }}
              //used to pass a private key into Dapparatus
              newPrivateKey={this.state.newPrivateKey}
              fallbackWeb3Provider={WEB3_PROVIDER}
              network="LeapTestnet"
              xdaiProvider={XDAI_PROVIDER}
              onUpdate={async (state) => {
                //console.log("DAPPARATUS UPDATE",state)
                if(ERC20TOKEN){
                  delete state.balance
                }
                if (state.xdaiweb3) {
                  let pdaiContract;
                  try{
                    pdaiContract = new state.xdaiweb3.eth.Contract(require("./contracts/StableCoin.abi.js"),P_DAI_TOKEN_ADDR)
                  }catch(e){
                    console.log("ERROR LOADING DAI Stablecoin Contract",e)
                  }
                  this.setState({pdaiContract});
                }
                if (state.web3Provider) {
                  state.web3 = new Web3(state.web3Provider)
                  this.setState(state,()=>{
                    //console.log("state set:",this.state)
                    if(this.state.possibleNewPrivateKey){
                      this.dealWithPossibleNewPrivateKey()
                    }
                    if(!this.state.parsingTheChain){
                      this.setState({parsingTheChain:true},async ()=>{
                        let upperBoundOfSearch = this.state.block
                        //parse through recent transactions and store in local storage
  
                        if(localStorage&&typeof localStorage.setItem == "function"){
  
                          let initResult = this.initRecentTxs()
                          let recentTxs = initResult[0]
                          let transactionsByAddress = initResult[1]
  
                          let loadedBlocksTop = this.state.loadedBlocksTop
                          if(!loadedBlocksTop){
                            loadedBlocksTop = localStorage.getItem(this.state.account+"loadedBlocksTop")
                          }
                          //  Look back through previous blocks since this account
                          //  was last online... this could be bad. We might need a
                          //  central server keeping track of all these and delivering
                          //  a list of recent transactions
  
                          let updatedTxs = false
                          if(!loadedBlocksTop || loadedBlocksTop<this.state.block){
                            if(!loadedBlocksTop) loadedBlocksTop = Math.max(2,this.state.block-5)
  
                            if(this.state.block - loadedBlocksTop > MAX_BLOCK_TO_LOOK_BACK){
                              loadedBlocksTop = this.state.block-MAX_BLOCK_TO_LOOK_BACK
                            }
  
                            let paddedLoadedBlocks = parseInt(loadedBlocksTop)+BLOCKS_TO_PARSE_PER_BLOCKTIME
                            //console.log("choosing the min of ",paddedLoadedBlocks,"and",this.state.block)
                            let parseBlock=Math.min(paddedLoadedBlocks,this.state.block)
  
                            //console.log("MIN:",parseBlock)
                            upperBoundOfSearch = parseBlock
                            console.log(" +++++++======= Parsing recent blocks ~"+this.state.block)
                            //first, if we are still back parsing, we need to look at *this* block too
                            if(upperBoundOfSearch<this.state.block){
                              for(let b=this.state.block;b>this.state.block-6;b--){
                                //console.log(" ++ Parsing *CURRENT BLOCK* Block "+b+" for transactions...")
                                updatedTxs = (await this.parseBlocks(b,recentTxs,transactionsByAddress)) || updatedTxs
                              }
                            }
                            console.log(" +++++++======= Parsing from "+loadedBlocksTop+" to "+upperBoundOfSearch+"....")
                            while(loadedBlocksTop<parseBlock){
                              //console.log(" ++ Parsing Block "+parseBlock+" for transactions...")
                              updatedTxs = (await this.parseBlocks(parseBlock,recentTxs,transactionsByAddress)) || updatedTxs
                              parseBlock--
                            }
                          }
  
                          if(updatedTxs||!this.state.recentTxs){
                            this.sortAndSaveTransactions(recentTxs,transactionsByAddress)
                          }
  
                          localStorage.setItem(this.state.account+"loadedBlocksTop",upperBoundOfSearch)
                          this.setState({parsingTheChain:false,loadedBlocksTop:upperBoundOfSearch})
                        }
                        //console.log("~~ DONE PARSING SET ~~")
                      })
                    }
                  })
                }
              }}
              />
              <Gas
              network={this.state.network}
              onUpdate={(state)=>{
                console.log("Gas price update:",state)
                this.setState(state,()=>{
                  this.state.gwei += 0.1
                  console.log("GWEI set:",this.state)
                })
              }}
              />
              {eventParser}
            </div>
          </div>
        </I18nextProvider>
      </ThemeProvider>
    )
  }
}

//<iframe id="galleassFrame" style={{zIndex:99,position:"absolute",left:0,top:0,width:800,height:600}} src="https://galleass.io" />

// NOTE: This function is used heavily by legacy code. We've reimplemented it's
// body though.
async function tokenSend(to, value, gasLimit, txData, cb) {
  let { account, web3, xdaiweb3, metaAccount } = this.state
  if(typeof gasLimit === "function"){
    cb = gasLimit
  }

  if(typeof txData === "function"){
    cb = txData
  }

  value = xdaiweb3.utils.toWei(""+value, "ether")
  const color = await xdaiweb3.getColor(P_DAI_TOKEN_ADDR);
  try {
    const receipt = await tokenSendV2(
      account,
      to,
      value,
      color,
      xdaiweb3,
      web3,
      metaAccount && metaAccount.privateKey
    )

    cb(null, receipt);
  } catch(err) {
    cb({
      error: err,
      request: { account, to, value, color },
    });
    // NOTE: The callback cb of tokenSend is not used correctly in the expected
    // format cb(error, receipt) throughout the app. We hence cannot send
    // errors in the callback :( When no receipt is returned (e.g. null), the
    // burner wallet will react with not resolving the "sending" view. This is
    // not ideal and should be changed in the future. We opened an issue on the
    // upstream repo: https://github.com/austintgriffith/burner-wallet/issues/157
  }
}

async function tokenSendV2(from, to, value, color, xdaiweb3, web3, privateKey) {
  const unspent = await xdaiweb3.getUnspent(from)

  let transaction;
  if (Util.isNST(color)) {
    const { outpoint, output: { data }} = unspent.find(
      ({ output }) =>
        Number(output.color) === Number(color) &&
        equal(bi(output.value), bi(value))
    );
    const inputs = [new Input(outpoint)];
    const outputs = [new Output(value, to, color, data)];
    transaction = Tx.transfer(inputs, outputs);
  } else {
    transaction = Tx.transferFromUtxos(unspent, from, to, value, color)
  }

  const signedTx = privateKey ? await transaction.signAll(privateKey) : await transaction.signWeb3(web3);
  const rawTx = signedTx.hex();

  // NOTE: Leapdao's Plasma implementation currently doesn't return receipts.
  // We hence have to periodically query the leap node to check whether our
  // transaction has been included into the chain. We assume that if it hasn't
  // been included after 5000ms (50 rounds at a 100ms timeout), it failed.
  // Unfortunately, at this point we cannot provide an error message for why

  let receipt;
  let rounds = 50;

  while (rounds--) {
    // redundancy rules ✊
    try {
      // web3 hangs here on invalid txs, trying to get receipt?
      // await this.web3.eth.sendSignedTransaction(tx.hex());
      await new Promise(
        (resolve, reject) => {
          xdaiweb3.currentProvider.send(
            { jsonrpc: '2.0', id: 42, method: 'eth_sendRawTransaction', 'params': [rawTx] },
            (err, res) => { if (err) { return reject(err); } resolve(res); }
          );
        }
      );
    } catch(err) {
      // ignore for now
      console.log(err);
      // NOTE: Leap's node currently doesn't implement the "newBlockHeaders"
      // JSON-RPC call. When a transaction is rejected by a node,
      // sendSignedTransaction hence throws an error. We simply ignore this
      // error here and use the polling tactic below. For more details see:
      // https://github.com/leapdao/leap-node/issues/255

      // const messageToIgnore = "Failed to subscribe to new newBlockHeaders to confirm the transaction receipts.";
      // NOTE: In the case where we want to ignore web3's error message, there's
      // "\r\n {}" included in the error message, which is why we cannot
      // compare with the equal operator, but have to use String.includes.
      // if (!err.message.includes(messageToIgnore)) {
      //  throw err;
      // }
    }

    let res = await xdaiweb3.eth.getTransaction(signedTx.hash())

    if (res && res.blockHash) {
      receipt = res;
      break;
    }

    // wait ~100ms
    await new Promise((resolve) => setTimeout(() => resolve(), 100));
  }

  if (receipt) {
    return receipt;
  }

  throw new Error("Transaction wasn't included into a block.");
}

let sortByBlockNumberDESC = (a,b)=>{
  if(b.blockNumber>a.blockNumber){
    return -1
  }
  if(b.blockNumber<a.blockNumber){
    return 1
  }
  return 0
}
let sortByBlockNumber = (a,b)=>{
  if(b.blockNumber<a.blockNumber){
    return -1
  }
  if(b.blockNumber>a.blockNumber){
    return 1
  }
  return 0
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
