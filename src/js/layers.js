import store from './store'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import ImageLaye from 'ol/layer/Image'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ.js'
import GeoJSON from 'ol/format/GeoJSON'
import {Fill, Stroke, Style, Text} from 'ol/style'
import RasterSource from 'ol/source/Raster'
import { transformExtent, fromLonLat } from 'ol/proj.js'
import LayerGroup from 'ol/layer/Group'
import mw5 from './mw/mw5'
import mw20 from './mw/mw20'
import Feature from 'ol/Feature'
import Polygon  from "ol/geom/Polygon"
import Crop from 'ol-ext/filter/Crop'
import Mask from 'ol-ext/filter/Mask'
import  * as MaskDep from './mask-dep'
import  * as LayersMvt from './layers-mvt'
// import BingMaps from 'ol/source/BingMaps'
import * as d3 from "d3"
import {fgbObj, homusyomiyazaki2024Summ, hyuganadaShindoSumm, nantoraShindoObj} from "./layers-mvt";
// import {ssdsPrefObj} from "./layers-mvt";
// const mapsStr = ['map01','map02','map03','map04']
// const mapsStr = ['map01'];
const mapsStr = ['map01','map02'];


const transformE = extent => {
  return transformExtent(extent,'EPSG:4326','EPSG:3857')
}
const floodColor = d3.scaleLinear()
    .domain([0, 100, 1000, 2500,9000, 20000])
    .range([
        "#00FF00",
      // "#00FF66",
      // "#ffff00",
      "#ffff00",
      "#ff8c00",
      "#ff4400",
      "red",
      "#880000"
    ])
for (let i = 0; i < 20000; i++) {
  store.state.info.floodColors[i] = d3.rgb(floodColor(i))
}
const floodColor2 = d3.scaleLinear()
    .domain([0, 50, 100, 500, 1000, 2500,5000,11000,20000])
    .range([
      "deepskyblue",
      "dodgerblue",
      "blue",
      "mediumblue",
      "darkblue",
      "navy",
      "midnightblue",
      "black",
      "black"
    ])
for (let i = 0; i < 20000; i++) {
  store.state.info.floodColors2[i] = d3.rgb(floodColor2(i))
}

function flood(pixels, data) {
  const pixel = pixels[0]
  if (pixel[3]) {
    let height
    if (pixel[3] === 255) {
      height = pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]
      height = (height < 8323072) ? height : height - 16777216
      height /= 100 //他のDEMを使う時はこれ
    }
    // console.log(height)
    if (height >= data.level) { // 陸上
      let sinsui = height - data.level
      // console.log(height,data.level)
      sinsui = Math.floor(sinsui)
      const floodColors = data.floodColors
      const rgb = floodColors[sinsui]
      // // console.log(rgb)
      if (rgb) pixel[0] = rgb.r;
      if (rgb) pixel[1] = rgb.g;
      if (rgb) pixel[2] = rgb.b;
      if (rgb) pixel[3] = 255

      // const c = data.colors
      // if (sinsui <= 10) {
      //   pixel[0] = c.m5.r; pixel[1] = c.m5.g; pixel[2] = c.m5.b; pixel[3] = c.m5.a*255
      // } else if (sinsui <= 50) {
      //   pixel[0] = c.m10.r; pixel[1] = c.m10.g; pixel[2] = c.m10.b; pixel[3] = c.m10.a*255
      // } else if (sinsui <= 100) {
      //   pixel[0] = c.m50.r; pixel[1] = c.m50.g; pixel[2] = c.m50.b; pixel[3] = c.m50.a*255
      // } else if (sinsui <= 500) {
      //   pixel[0] = c.m100.r; pixel[1] = c.m100.g; pixel[2] = c.m100.b; pixel[3] = c.m100.a*255
      // } else if (sinsui <= 1000) {
      //   pixel[0] = c.m500.r; pixel[1] = c.m500.g; pixel[2] = c.m500.b; pixel[3] = c.m500.a*255
      // } else if (sinsui <= 2500) {
      //   pixel[0] = c.m1500.r;pixel[1] = c.m1500.g;pixel[2] = c.m1500.b;pixel[3] = c.m1500.a * 255
      // } else {
      //   pixel[0] = c.m2500.r;pixel[1] = c.m2500.g;pixel[2] = c.m2500.b;pixel[3] = c.m2500.a * 255
      // }
    } else { //海面下
      // let sinsui = - height + data.level
      let sinsui = -height + data.level

      sinsui = Math.floor(sinsui)
      const floodColors2 = data.floodColors2
      const rgb = floodColors2[sinsui]
      // // console.log(rgb)
      if (rgb) pixel[0] = rgb.r;
      if (rgb) pixel[1] = rgb.g;
      if (rgb) pixel[2] = rgb.b;
      if (rgb) pixel[3] = 255
      // const c = data.colors
      // if (sinsui >= -10) {
      //   pixel[0] = c.sea10.r; pixel[1] = c.sea10.g; pixel[2] = c.sea10.b; pixel[3] = c.sea10.a*255
      // } else if (sinsui >= -50) {
      //   pixel[0] = c.sea50.r; pixel[1] = c.sea50.g; pixel[2] = c.sea50.b; pixel[3] = c.sea50.a*255
      // } else if (sinsui >= -100) {
      //   pixel[0] = c.sea100.r; pixel[1] = c.sea100.g; pixel[2] = c.sea100.b; pixel[3] = c.sea100.a*255
      // } else if (sinsui >= -500) {
      //   pixel[0] = c.sea500.r; pixel[1] = c.sea500.g; pixel[2] = c.sea500.b; pixel[3] = c.sea500.a*255
      // } else if (sinsui >= -1000) {
      //   pixel[0] = c.sea1500.r; pixel[1] = c.sea1500.g; pixel[2] = c.sea1500.b; pixel[3] = c.sea1500.a*255
      // } else if (sinsui >= -2500) {
      //   pixel[0] = c.sea2500.r;pixel[1] = c.sea2500.g;pixel[2] = c.sea2500.b;pixel[3] = c.sea2500.a*255
      // } else {
      //   pixel[0] = c.sea3500.r;pixel[1] = c.sea3500.g;pixel[2] = c.sea3500.b;pixel[3] = c.sea3500.a*255
      // }
    }
  }
  return pixel
}
function flood2(pixels, data) {
  const pixel = pixels[0]
  if (pixel[3]) {
    let height
    if (pixel[3] === 255) {
      height = pixel[0] * 256 * 256 + pixel[1] * 256 + pixel[2]
      height = (height < 8323072) ? height : height - 16777216
      height /= 100 //他のDEMを使う時はこれ
    }
    if (height >= data.level) { // 陸上
      pixel[3] = 0
    } else { //海面下
      const c = data.colors
      pixel[0] = c.paleSea.r; pixel[1] = c.paleSea.g; pixel[2] = c.paleSea.b; pixel[3] = c.paleSea.a*255
    }
  }
  return pixel
}
//dem10---------------------------------------------------------------------------------
// const url = 'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png'
// const url = 'https://tiles.gsj.jp/tiles/elev/land/{z}/{y}/{x}.png' // 陸のみ
// const url = 'https://gsj-seamless.jp/labs/elev2/elev/{z}/{y}/{x}.png' // 海あり
const elevation9 = new XYZ({
  url:'https://tiles.gsj.jp/tiles/elev/mixed/{z}/{y}/{x}.png',
  maxZoom:9,
  crossOrigin:'anonymous',
  interpolate: false,
})
function Dem10 () {
  this.multiply = true
  this.source = new RasterSource({
    sources:[elevation9],
    operation:flood
  })
}
export const flood10Obj = {}
for (let i of mapsStr) {
  flood10Obj[i] = new ImageLaye(new Dem10())
  flood10Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range10m").value)
    event.data.colors = store.state.info.colors
    event.data.floodColors = store.state.info.floodColors
    event.data.floodColors2 = store.state.info.floodColors2
  })
}
const elevation11 = new XYZ({
  url:'https://tiles.gsj.jp/tiles/elev/land/{z}/{y}/{x}.png',
  maxZoom:11,
  crossOrigin:'anonymous',
  interpolate: false,
})
const elevation15 = new XYZ({
  url:'https://tiles.gsj.jp/tiles/elev/land/{z}/{y}/{x}.png',
  maxZoom:15,
  crossOrigin:'anonymous',
  interpolate: false,
})
function Dem151 () {
  this.multiply = true
  this.source = new RasterSource({
    sources:[elevation11],
    operation:flood
  })
  this.minResolution = 19.109257
}
export const flood151Obj = {}
for (let i of mapsStr) {
  flood151Obj[i] = new ImageLaye(new Dem151())
  flood151Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range10m").value)
    event.data.colors = store.state.info.colors
    event.data.floodColors = store.state.info.floodColors
    event.data.floodColors2 = store.state.info.floodColors2
  })
}
function Dem152 () {
  this.multiply = true
  this.source = new RasterSource({
    sources:[elevation15],
    operation:flood
  })
  this.maxResolution = 19.109257
}
export const flood152Obj = {}
for (let i of mapsStr) {
  flood152Obj[i] = new ImageLaye(new Dem152())
  flood152Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range10m").value)
    event.data.colors = store.state.info.colors
    event.data.floodColors = store.state.info.floodColors
    event.data.floodColors2 = store.state.info.floodColors2
  })
}
export const flood15Obj = {};
for (let i of mapsStr) {
  flood15Obj[i] = new LayerGroup({
    layers: [
      flood151Obj[i],
      flood152Obj[i],
    ]
  })
  flood15Obj[i].values_['multiply'] = true
}

function DemSinple1 () {
  this.multiply = true
  this.source = new RasterSource({
    sources:[elevation11],
    operation:flood2
  })
  this.minResolution = 19.109257
}
export const floodSinple1Obj = {}
for (let i of mapsStr) {
  floodSinple1Obj[i] = new ImageLaye(new DemSinple1())
  floodSinple1Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range10m").value)
    event.data.colors = store.state.info.colors
  })
}
function DemSinple2 () {
  this.multiply = true
  this.source = new RasterSource({
    sources:[elevation15],
    operation:flood2
  })
  this.maxResolution = 19.109257
}
export const floodSinple2Obj = {}
for (let i of mapsStr) {
  floodSinple2Obj[i] = new ImageLaye(new DemSinple2())
  floodSinple2Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range10m").value)
    event.data.colors = store.state.info.colors
  })
}

export const floodSinpleObj = {};
for (let i of mapsStr) {
  floodSinpleObj[i] = new LayerGroup({
    layers: [
      floodSinple1Obj[i],
      floodSinple2Obj[i],
    ]
  })
  floodSinpleObj[i].values_['multiply'] = true
}

//dem5---------------------------------------------------------------------------------
const elevation5 = new XYZ({
  url:'https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png',
  minZoom:15,
  maxZoom:15,
  crossOrigin:'anonymous'
});
function Dem5 () {
  this.source = new RasterSource({
    sources:[elevation5],
    operation:flood
  });
  this.maxResolution = 38.22
}
export const flood5Obj = {}
for (let i of mapsStr) {
  flood5Obj[i] = new ImageLaye(new Dem5());
  flood5Obj[i].getSource().on('beforeoperations', function(event) {
    event.data.level = Number(document.querySelector('#' + i  + " .flood-range5m").value)
    event.data.colors = store.state.info.colors
  });
}

let floodSumm = ''

// シームレス地質図-------------------------------------------------------------------------------
const sources =new XYZ({
  url: 'https://gbank.gsj.jp/seamless/v2/api/1.2/tiles/{z}/{y}/{x}.png?layer=glf',
  // 地理院10mdemは下記
  // url: 'https://gbank.gsj.jp/seamless/v2/api/1.2/tiles/{z}/{y}/{x}.png',
  crossOrigin: 'Anonymous',
  minZoom: 5,
  maxZoom: 13,
})
function seamless () {
  this.name = 'seamless'
   // this.className = 'pointer'
  this.pointer = true
  this.multiply = true
  this.source = new RasterSource({
    sources:[sources],
    operation:operationFunc()
  })
}
export const seamlessObj = {}
for (let i of mapsStr) {
  seamlessObj[i] = new ImageLaye(new seamless())
  seamlessObj[i].getSource().on('beforeoperations', function(event) {
    if (store.state.base.colorArr[i].length!==0) {
      event.data.colorArr = store.state.base.colorArr[i]
    }
  });
}

function SeamlessCisitu () {
  this.preload = Infinity
  this.name = 'seamless'
  this.pointer = true
  this.multiply = true
  this.source = new XYZ({
    url: 'https://gbank.gsj.jp/seamless/v2/api/1.2/tiles/{z}/{y}/{x}.png?layer=glf',
    crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 13
  })
}
const seamelesChisituObj = {};
for (let i of mapsStr) {
  seamelesChisituObj[i] = new TileLayer(new SeamlessCisitu())
}

const seamlessSumm = ''
function operationFunc () {
  return function (pixels, data) {
    var pixel = pixels[0]
    if (pixel[3]) {
      var colorArr = data.colorArr
      if (colorArr) {
        var pixel00 = pixel[0] + "/" + pixel[1] + "/" + pixel[2]
        if (colorArr.indexOf(pixel00) >= 0) {
          // 存在する
        } else {
          pixel[3] = 0
        }
      } else {
        return pixel
      }
    }
    return pixel
  }
}
// オープンストリートマップ------------------------------------------------------------------------
function Osm () {
  this.preload = Infinity
  this.source = new OSM()
}
const osmObj = {}
for (let i of mapsStr) {
  osmObj[i] = new TileLayer(new Osm())
}
const osmSumm = 'OpenStreetMapは、道路地図などの地理情報データを誰でも利用できるよう、フリーの地理情報データを作成することを目的としたプロジェクトです。<a href=\'https://openstreetmap.jp\' target=\'_blank\'>OpenStreetMap</a>';
// 標準地図------------------------------------------------------------------------------------
function Std () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 18
  })
}
const stdObj = {}
for (let i of mapsStr) {
  stdObj[i] = new TileLayer(new Std())
}
const stdSumm = '国土地理院作成のタイルです。<br><a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'
// 淡色地図------------------------------------------------------------------------------------
function Pale () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 2,
    maxZoom: 18
  })
  this.useInterimTilesOnError = false
}
const paleObj = {}
for (let i of mapsStr) {
  paleObj[i] = new TileLayer(new Pale())
}
const paleSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'
// 淡色地図------------------------------------------------------------------------------------
function Palegray () {
  this.preload = Infinity
  this.className = 'gray-scale'
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 2,
    maxZoom: 18
  })
  this.useInterimTilesOnError = false
}
const paleGrayObj = {}
for (let i of mapsStr) {
  paleGrayObj[i] = new TileLayer(new Palegray())
}
// 白地図--------------------------------------------------------------------------------------
function Blank () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/blank/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 18
  })
}
const blankObj = {};
for (let i of mapsStr) {
  blankObj[i] = new TileLayer(new Blank())
}
const blankSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'
// 全国最新写真-------------------------------------------------------------------------------
function Seamlessphoto () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 18
  })
}
const seamlessphotoObj = {};
for (let i of mapsStr) {
  seamlessphotoObj[i] = new TileLayer(new Seamlessphoto())
}
const seamlessphotoSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'
// 色別標高図---------------------------------------------------------------------------------
function Relief () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 15
  })
}
const reliefObj = {};
for (let i of mapsStr) {
  reliefObj[i] = new TileLayer(new Relief())
}
const reliefSumm = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'
// 治水地形分類図 更新版（2007年以降）---------------------------------------------------------------------------------
function Tisui2007 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/lcmfc2/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 16
  })
}
const tisui2007Obj = {};
for (let i of mapsStr) {
  tisui2007Obj[i] = new TileLayer(new Tisui2007())
}
const tisui2007Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>' +
    '<br><a href="https://cyberjapandata.gsi.go.jp/legend/lcmfc2_legend.jpg" target="_blank">凡例</a>'
// 陰影起伏図---------------------------------------------------------------------------------
function Inei () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/hillshademap/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 16
  })
}
const ineiObj = {};
for (let i of mapsStr) {
  ineiObj[i] = new TileLayer(new Inei())
}
// 傾斜量図---------------------------------------------------------------------------------
function Keisya () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 3,
    maxZoom: 15
  })
}
const keisyaObj = {};
for (let i of mapsStr) {
  keisyaObj[i] = new TileLayer(new Keisya())
}
// 明治期の低湿地---------------------------------------------------------------------------------
function Sitti () {
  this.preload = Infinity
  this.name = 'sitti'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/swale/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 16
  })
}
const sittiObj = {};
for (let i of mapsStr) {
  sittiObj[i] = new TileLayer(new Sitti())
}
// 数値地図25000（土地条件）---------------------------------------------------------------------------------
function Suuti25000 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/lcm25k_2012/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 10,
    maxZoom: 16
  })
}
const suuti25000Obj = {};
for (let i of mapsStr) {
  suuti25000Obj[i] = new TileLayer(new Suuti25000())
}
const suuti25000Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>' +
'<br><a href="https://cyberjapandata.gsi.go.jp/legend/lcm25k_2012/lc_legend.pdf" target="_blank">凡例</a>'

// 宮崎県航空写真----------------------------------------------------------------------------
function MiyazakiOrt () {
  this.preload = Infinity
  this.extent = transformE([130.66371,31.34280,131.88045,32.87815])
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/ort/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const miyazakiOrtObj = {};
for (let i of mapsStr) {
  miyazakiOrtObj[i] = new TileLayer(new MiyazakiOrt())
}
const miyazakiOrtSumm = '宮崎県県土整備部砂防課が平成25年度に撮影した航空写真をオルソ補正したもの'
// 静岡県航空写真----------------------------------------------------------------------------
function SizuokaOrt () {
  this.preload = Infinity
  this.extent = transformE([138.19778,34.8626474,138.671573,35.213088])
  this.source = new XYZ({
    url: 'https://tile.geospatial.jp/shizuoka_city/h30_aerophoto/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const sizuokaOrtObj = {};
for (let i of mapsStr) {
  sizuokaOrtObj[i] = new TileLayer(new SizuokaOrt())
}
const sizuokaOrtSumm = '<a href="https://www.geospatial.jp/ckan/dataset/h30/resource/cb7f8bc4-0ec7-493b-b7fa-f90e5780ac5e" target="_blank">G空間情報センター</a>'
// 室蘭市航空写真----------------------------------------------------------------------------
function MuroransiOrt () {
  this.preload = Infinity
  this.extent = transformE([140.888332,42.2961046,141.076206,42.44097007]),
    this.source = new XYZ({
      url: 'https://kenzkenz2.xsrv.jp/muroran3/{z}/{x}/{-y}.png',
      crossOrigin: 'Anonymous',
      minZoom: 1,
      maxZoom: 19
    });
}
const muroransiOrtObj = {}
for (let i of mapsStr) {
  muroransiOrtObj[i] = new TileLayer(new MuroransiOrt())
}
const muroransiOrtSumm = '<a href="http://www.city.muroran.lg.jp/main/org2260/odlib.php" target="_blank">むろらんオープンデータライブラリ</a>'
// 富田林市航空写真----------------------------------------------------------------------------
function TondaOrt () {
  this.preload = Infinity
  this.extent = transformE([135.5529, 34.53991,135.6433, 34.43539])
  this.source = new XYZ({
    url: 'https://www.city.tondabayashi.lg.jp/map2/tile/1010/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 12,
    maxZoom: 19
  });
}
const tondaOrtObj = {};
for (let i of mapsStr) {
  tondaOrtObj[i] = new TileLayer(new TondaOrt())
}
const tondaOrtSumm = '<a href="https://www.city.tondabayashi.lg.jp/map2/download/download.html" target="_blank">公開データの利用について（地図等）</a>'
// 糸魚川市航空写真----------------------------------------------------------------------------
function ItoiOrt () {
  this.preload = Infinity
  this.extent = transformE([137.5733, 37.11702,138.1806, 36.79012])
  this.source = new XYZ({
    url: 'https://nyampire.conohawing.com/ortho-itoigawa-shi/{z}/{x}/{-y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 12,
    maxZoom: 19
  });
}
const itoiOrtObj = {};
for (let i of mapsStr) {
  itoiOrtObj[i] = new TileLayer(new ItoiOrt())
}
const itoiOrtSumm = '<a href="https://wiki.openstreetmap.org/wiki/Itoigawa_ortho" target="_blank">Itoigawa ortho</a>'
// 練馬区航空写真----------------------------------------------------------------------------
function NerimaOrt () {
  this.preload = Infinity
  this.extent = transformE([139.55791,35.708959,139.684391,35.78395978])
  this.source = new XYZ({
    url: 'http://nyampire.conohawing.com/ortho-nerima-ku/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 10,
    maxZoom: 19
  });
}
const nerimaOrtObj = {};
for (let i of mapsStr) {
  nerimaOrtObj[i] = new TileLayer(new NerimaOrt())
}
const nerimaOrtSumm = '<a href="https://wiki.openstreetmap.org/wiki/Nerima_ortho" target="_blank">Nerima ortho</a>'
// 深谷市航空写真----------------------------------------------------------------------------
function FukayaOrt () {
  this.preload = Infinity
  this.extent = transformE([139.16936,36.09796,139.343577,36.25483689])
  this.source = new XYZ({
    url: 'http://nyampire.conohawing.com/ortho-fukaya-shi/{z}/{x}/{-y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 12,
    maxZoom: 19
  });
}
const fukayaOrtObj = {};
for (let i of mapsStr) {
  fukayaOrtObj[i] = new TileLayer(new FukayaOrt())
}
const fukayaOrtSumm = '<a href="https://wiki.openstreetmap.org/wiki/Fukaya_ortho" target="_blank">Fukaya ortho</a>'

// 厚木市航空写真----------------------------------------------------------------------------
function AtugiOrt () {
  this.preload = Infinity
  this.extent = transformE([139.2161,35.3932,139.384260,35.529670])
  this.source = new XYZ({
    url: 'https://nyampire.conohawing.com/ortho-atsugi-shi/{z}/{x}/{-y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 12,
    maxZoom: 19
  });
}
const atugiOrtObj = {};
for (let i of mapsStr) {
  atugiOrtObj[i] = new TileLayer(new AtugiOrt())
}
const atugiOrtSumm = '<a href="https://wiki.openstreetmap.org/wiki/Atsugi_ortho" target="_blank">Atsugi ortho</a>'

// 掛川市航空写真----------------------------------------------------------------------------
function KakegawaOrt () {
  this.preload = Infinity
  this.extent = transformE([137.9241, 34.9255, 138.1404, 34.6174])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tile/kakegawa/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 12,
    maxZoom: 18
  });
}
const kakegawaOrtObj = {};
for (let i of mapsStr) {
  kakegawaOrtObj[i] = new TileLayer(new KakegawaOrt())
}
const kakegawaOrtSumm = '<a href="https://www.city.kakegawa.shizuoka.jp/gyosei/docs/452145.html" target="_blank">令和4年度掛川市航空写真(オルソ画像)</a>'

// 半田市航空写真----------------------------------------------------------------------------
function HandaOrt () {
  this.preload = Infinity
  this.extent = transformE([136.8485, 34.9523, 136.9931, 34.8481])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/handasi/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const handaOrtObj = {};
for (let i of mapsStr) {
  handaOrtObj[i] = new TileLayer(new HandaOrt())
}
const handaOrtSumm = '<a href="https://www.city.handa.lg.jp/kikaku/shise/johoseisaku/opendata/data_kokupict_2020.html" target="_blank">2020年（令和2年）行政活動情報・航空写真</a>'


// 鹿児島市航空写真----------------------------------------------------------------------------
function KagosimasiOrt () {
  this.preload = Infinity
  this.extent = transformE([130.370675,31.2819,130.732,31.767])
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/orts/kagoshima/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const kagosimasiOrtObj = {};
for (let i of mapsStr) {
  kagosimasiOrtObj[i] = new TileLayer(new KagosimasiOrt())
}
const kagosimasiOrtSumm = '<a href="https://www.city.kagoshima.lg.jp/ict/opendata.html" target="_blank">鹿児島市オープンデータ</a>'

// PLATEAUオルソ----------------------------------------------------------------------------
function PlateauOrt () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://gic-plateau.s3.ap-northeast-1.amazonaws.com/2020/ortho/tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const plateauOrtObj = {};
for (let i of mapsStr) {
  plateauOrtObj[i] = new TileLayer(new PlateauOrt())
}
const plateauOrtObjSumm = '<a href="https://github.com/Project-PLATEAU/plateau-streaming-tutorial/blob/main/ortho/plateau-ortho-streaming.md" target="_blank">PLATEAUオルソ</a>'

// 2010年の航空写真-------------------------------------------------------------------------------
function Sp10 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/nendophoto2010/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp10Obj = {};
for (let i of mapsStr) {
  sp10Obj[i] = new TileLayer(new Sp10())
}
const sp10Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'

// 87~90年の航空写真-------------------------------------------------------------------------------
function Sp87 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/gazo4/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp87Obj = {};
for (let i of mapsStr) {
  sp87Obj[i] = new TileLayer(new Sp87())
}
const sp87Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'

// 84~86年の航空写真-------------------------------------------------------------------------------
function Sp84 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/gazo3/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp84Obj = {};
for (let i of mapsStr) {
  sp84Obj[i] = new TileLayer(new Sp84())
}
const sp84Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'

// ７9~83年の航空写真-------------------------------------------------------------------------------
function Sp79 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/gazo2/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp79Obj = {};
for (let i of mapsStr) {
  sp79Obj[i] = new TileLayer(new Sp79())
}
const sp79Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'
// ７４~７８年の航空写真-------------------------------------------------------------------------------
function Sp74 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/gazo1/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp74Obj = {};
for (let i of mapsStr) {
  sp74Obj[i] = new TileLayer(new Sp74())
}
const sp74Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'
// ６１~６４年の航空写真-------------------------------------------------------------------------------
function Sp61 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://maps.gsi.go.jp/xyz/ort_old10/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp61Obj = {};
for (let i of mapsStr) {
  sp61Obj[i] = new TileLayer(new Sp61())
}
const sp61Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'

// 45~50年の航空写真-------------------------------------------------------------------------------
function Sp45 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/ort_USA10/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp45Obj = {};
for (let i of mapsStr) {
  sp45Obj[i] = new TileLayer(new Sp45())
}
const sp45Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'

// 36~42年の航空写真-------------------------------------------------------------------------------
function Sp36 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/ort_riku10/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp36Obj = {};
for (let i of mapsStr) {
  sp36Obj[i] = new TileLayer(new Sp36())
}
const sp36Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'

// 28年の航空写真-------------------------------------------------------------------------------
function Sp28 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/ort_1928/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const sp28Obj = {};
for (let i of mapsStr) {
  sp28Obj[i] = new TileLayer(new Sp28())
}
const sp28Summ = '国土地理院作成のタイルです。<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">リンク</a>'

// 川だけ地形地図---------------------------------------------------------------------------
function Kawadake () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'http://www.gridscapes.net/AllRivers/1.0.0/t/{z}/{x}/{-y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 14
  });
}
const kawadakeObj = {};
for (let i of mapsStr) {
  kawadakeObj[i] = new TileLayer(new Kawadake())
}
const kawadakeSumm = '<a href="https://www.gridscapes.net/#AllRiversAllLakesTopography" target="_blank">川だけ地形地図</a>'
// 川と流域地図---------------------------------------------------------------------------
function Ryuuiki () {
  this.preload = Infinity
  this.source = new XYZ({
    // url: 'https://kenzkenz.xsrv.jp/open-hinata/php/proxy-png-curl.php?url=https://tiles.dammaps.jp/ryuiki_t/1/{z}/{x}/{y}.png',
    // url: 'https://hgis.pref.miyazaki.lg.jp/hinata/php/proxy-png-curl.php?url=https://tiles.dammaps.jp/ryuiki_t/1/{z}/{x}/{y}.png',

    // url: 'https://tiles.dammaps.jp/ryuiki_t/1/{z}/{x}/{y}.png',

    url: 'https://kenzkenz3.xsrv.jp/ryuuiki/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 14
  });
}
const ryuuikiObj = {};
for (let i of mapsStr) {
  ryuuikiObj[i] = new TileLayer(new Ryuuiki())
}
const ryuuikiSumm = '<a href="https://tiles.dammaps.jp/ryuiki/" target="_blank">川だけ地形地図</a><br>' +
  '<div style="width: 400px"><small>本図は国土交通省 国土数値情報「河川」「流域メッシュ」「湖沼」（第2.1版）および国土地理院 地球地図日本「行政界」（第２版）をもとに高根たかね様が作成したものです。国土数値情報は国土計画関連業務のために作成されたデータが副次的に公開されたものであり、国土計画関連業務に差しさわりがない範囲で時間的、位置的精度において現況と誤差が含まれています。本地図を利用される場合はその点に十分ご留意の上ご利用ください。また、国土数値情報 利用約款を遵守しご利用ください。</small></div>'
// エコリス植生図---------------------------------------------------------------------------
function Ecoris () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://map.ecoris.info/tiles/vegehill/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 14
  });
}
const ecorisObj = {};
for (let i of mapsStr) {
  ecorisObj[i] = new TileLayer(new Ecoris())
}
const ecorisSumm = '<a href="http://map.ecoris.info/" target="_blank">エコリス地図タイル</a><br>' +
  '<div style="width: 300px"><small>第5回 自然環境保全基礎調査 植生調査結果を着色し、国土地理院 基盤地図情報 数値標高データ10mメッシュから作成した陰影起伏図に重ねたものです。</small></div>'
// 岐阜県CS立体図----------------------------------------------------------------------------
function GihuCs () {
  this.preload = Infinity
  this.extent = transformE([136.257111,35.141011,137.666902,36.482164143934])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/gihucs/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const gihuCsObj = {};
for (let i of mapsStr) {
  gihuCsObj[i] = new TileLayer(new GihuCs())
}
const gihuCsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/cs-2019-geotiff" target="_blank">G空間情報センター</a>'
// 兵庫県CS立体図----------------------------------------------------------------------------
function HyougoCs () {
  this.preload = Infinity
  this.extent = transformE([134.2669714033038, 34.17797854803047,135.47241581374712, 35.783161768341444])
  this.source = new XYZ({
    url: 'https://kenzkenz.xsrv.jp/tile/hyougo/cs/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const hyougoCsObj = {};
for (let i of mapsStr) {
  hyougoCsObj[i] = new TileLayer(new HyougoCs())
}
const hyougoCsSumm = '<a href="https://web.pref.hyogo.lg.jp/kk26/hyogo-geo.html" target="_blank">全国初「全県土分の高精度3次元データ」の公開について</a>';

// 兵庫県CS立体図50cm ----------------------------------------------------------------------------
function HyougoCs50 () {
  this.preload = Infinity
  this.extent = transformE([134.2669714033038, 34.17797854803047,135.47241581374712, 35.783161768341444])
  this.source = new XYZ({
    url: 'https://kenzkenz.xsrv.jp/tile/hyougo/cs50cm/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 19
  });
}
const hyougoCs50Obj = {};
for (let i of mapsStr) {
  hyougoCs50Obj[i] = new TileLayer(new HyougoCs50())
}
const hyougoCs50Summ = '<a href="https://web.pref.hyogo.lg.jp/kk26/hyogo-geo.html" target="_blank">全国初「全県土分の高精度3次元データ」の公開について</a>';
// 兵庫県CS立体図50cm2 ----------------------------------------------------------------------------
function HyougoCs50c2 () {
  this.preload = Infinity
  this.extent = transformE([134.2669714033038, 34.17797854803047,135.47241581374712, 35.783161768341444])
  this.source = new XYZ({
    // url: 'https://rinya-hyogo.geospatial.jp/2023/rinya/tile/csmap/{z}/{x}/{y}.png',
    url: 'https://kenzkenz3.xsrv.jp/cs/hyougo50/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 8,
    maxZoom: 18
  });
}
const hyougoCs50c2Obj = {};
for (let i of mapsStr) {
  hyougoCs50c2Obj[i] = new TileLayer(new HyougoCs50c2())
}
const hyougoCs50c2Summ = '<a href="https://www.geospatial.jp/ckan/dataset/csmap_hyogo" target="_blank">G空間情報センター</a>';
// 兵庫県レーザ林相図 ----------------------------------------------------------------------------
function HyougoRinsou () {
  this.preload = Infinity
  this.extent = transformE([134.2669714033038, 34.17797854803047,135.47241581374712, 35.783161768341444])
  this.source = new XYZ({
    url: 'https://rinya-hyogo.geospatial.jp/2023/rinya/tile/ls_standtype/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 8,
    maxZoom: 18
  });
}
const hyougoRinsouObj = {};
for (let i of mapsStr) {
  hyougoRinsouObj[i] = new TileLayer(new HyougoRinsou())
}
const hyougoRinsouSumm = '<a href="https://www.geospatial.jp/ckan/dataset/ls_standtype_hyogo" target="_blank">G空間情報センター</a>';
// 栃木県CS立体図 ----------------------------------------------------------------------------
function TochigiCs () {
  this.preload = Infinity
  this.extent = transformE([139.1989, 37.2099, 140.4764, 36.14784])
  this.source = new XYZ({
    url: 'https://rinya-tochigi.geospatial.jp/2023/rinya/tile/csmap/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 8,
    maxZoom: 18
  });
}
const tochigicsObj = {};
for (let i of mapsStr) {
  tochigicsObj[i] = new TileLayer(new TochigiCs())
}
const tochigicsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/csmap_tochigi" target="_blank">G空間情報センター</a>';
// 栃木県レーザ林相図 ----------------------------------------------------------------------------
function TochigiRinsou () {
  this.preload = Infinity
  this.extent = transformE([139.1989, 37.2099, 140.4764, 36.14784])
  this.source = new XYZ({
    url: 'https://rinya-tochigi.geospatial.jp/2023/rinya/tile/ls_standtype/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 8,
    maxZoom: 18
  });
}
const tochigiRinsouObj = {};
for (let i of mapsStr) {
  tochigiRinsouObj[i] = new TileLayer(new TochigiRinsou())
}
const tochigiRinsouSumm = '<a href="https://www.geospatial.jp/ckan/dataset/ls_standtype_tochigi" target="_blank">G空間情報センター</a>';

// 高知県CS立体図 ----------------------------------------------------------------------------
function KochiCs () {
  this.preload = Infinity
  this.extent = transformE([132.2401, 33.86599, 134.553, 32.6287])
  this.source = new XYZ({
    url: 'https://rinya-kochi.geospatial.jp/2023/rinya/tile/csmap/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 8,
    maxZoom: 18
  });
}
const kochiCsObj = {};
for (let i of mapsStr) {
  kochiCsObj[i] = new TileLayer(new KochiCs())
}
const kochiCsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/csmap_kochi" target="_blank">G空間情報センター</a>';
// 高知県レーザ林相図 ----------------------------------------------------------------------------
function KochiRinsou () {
  this.preload = Infinity
  this.extent = transformE([132.2401, 33.86599, 134.553, 32.6287])
  this.source = new XYZ({
    url: 'https://rinya-kochi.geospatial.jp/2023/rinya/tile/ls_standtype/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 8,
    maxZoom: 18
  });
}
const kochiRinsouObj = {};
for (let i of mapsStr) {
  kochiRinsouObj[i] = new TileLayer(new KochiRinsou())
}
const kochiRinsouSumm = '<a href="https://www.geospatial.jp/ckan/dataset/ls_standtype_kochi" target="_blank">G空間情報センター</a>';

// // 大阪府CS立体図 ----------------------------------------------------------------------------
// function Chihayaakasakamura () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/chihayaakasakamura/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const chihayaakasakamuraObj = {};
// for (let i of mapsStr) {
//   chihayaakasakamuraObj[i] = new TileLayer(new Chihayaakasakamura())
// }
// const osakaSumm = '<a href="https://www.geospatial.jp/ckan/dataset/cs" target="_blank">G空間情報センター</a>';
//
// function Tondabayashishi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/tondabayashishi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const tondabayashishiObj = {};
// for (let i of mapsStr) {
//   tondabayashishiObj[i] = new TileLayer(new Tondabayashishi())
// }
//
// function Daitoushi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/daitoushi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const daitoushiObj = {};
// for (let i of mapsStr) {
//   daitoushiObj[i] = new TileLayer(new Daitoushi())
// }
// function Hannanshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/hannanshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const hannanshiObj = {};
// for (let i of mapsStr) {
//   hannanshiObj[i] = new TileLayer(new Hannanshi())
// }
// function Higashiosakashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/higashiosakashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const higashiosakashiObj = {};
// for (let i of mapsStr) {
//   higashiosakashiObj[i] = new TileLayer(new Higashiosakashi())
// }
// function Hirakatashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/hirakatashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const hirakatashiObj = {};
// for (let i of mapsStr) {
//   hirakatashiObj[i] = new TileLayer(new Hirakatashi())
// }
// function Ibarakishi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/ibarakishi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const ibarakishiObj = {};
// for (let i of mapsStr) {
//   ibarakishiObj[i] = new TileLayer(new Ibarakishi())
// }
// function Ikedashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/ikedashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const ikedashiObj = {};
// for (let i of mapsStr) {
//   ikedashiObj[i] = new TileLayer(new Ikedashi())
// }
// function Habikinoshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/habikinoshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const habikinoshiObj = {};
// for (let i of mapsStr) {
//   habikinoshiObj[i] = new TileLayer(new Habikinoshi())
// }
// function Izumisanoshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/izumisanoshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const izumisanoshiObj = {};
// for (let i of mapsStr) {
//   izumisanoshiObj[i] = new TileLayer(new Izumisanoshi())
// }
// function Izumishi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/izumishi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const izumiObj = {};
// for (let i of mapsStr) {
//   izumiObj[i] = new TileLayer(new Izumishi())
// }
// function Kaizukashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/kaizukashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const kaizukashiObj = {};
// for (let i of mapsStr) {
//   kaizukashiObj[i] = new TileLayer(new Kaizukashi())
// }
// function Kashiwarashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/kashiwarashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const kashiwarashiObj = {};
// for (let i of mapsStr) {
//   kashiwarashiObj[i] = new TileLayer(new Kashiwarashi())
// }
// function Kananchou () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/kananchou/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const kananchouObj = {};
// for (let i of mapsStr) {
//   kananchouObj[i] = new TileLayer(new Kananchou())
// }
// function Katanoshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/katanoshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const katanoshiObj = {};
// for (let i of mapsStr) {
//   katanoshiObj[i] = new TileLayer(new Katanoshi())
// }
// function Kawachinaganoshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/kawachinaganoshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const kawachinaganoshiObj = {};
// for (let i of mapsStr) {
//   kawachinaganoshiObj[i] = new TileLayer(new Kawachinaganoshi())
// }
// function Kishiwadashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/kishiwadashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const kishiwadashiObj = {};
// for (let i of mapsStr) {
//   kishiwadashiObj[i] = new TileLayer(new Kishiwadashi())
// }
// function Kumatorichou () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/kumatorichou/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const kumatorichouObj = {};
// for (let i of mapsStr) {
//   kumatorichouObj[i] = new TileLayer(new Kumatorichou())
// }
// function Minoshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/minoshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const minoshiObj = {};
// for (let i of mapsStr) {
//   minoshiObj[i] = new TileLayer(new Minoshi())
// }
// function Misakichou () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/misakichou/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const misakichouObj = {};
// for (let i of mapsStr) {
//   misakichouObj[i] = new TileLayer(new Misakichou())
// }
// function Neyagawashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/neyagawashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const neyagawashiObj = {};
// for (let i of mapsStr) {
//   neyagawashiObj[i] = new TileLayer(new Neyagawashi())
// }
// function Nosechou () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/nosechou/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const nosechouObj = {};
// for (let i of mapsStr) {
//   nosechouObj[i] = new TileLayer(new Nosechou())
// }
// function Sakaishi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/sakaishi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const sakaishiObj = {};
// for (let i of mapsStr) {
//   sakaishiObj[i] = new TileLayer(new Sakaishi())
// }
// function Sennanshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/sennanshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const sennanshiObj = {};
// for (let i of mapsStr) {
//   sennanshiObj[i] = new TileLayer(new Sennanshi())
// }
// function Shimamotochou () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/shimamotochou/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const shimamotochouObj = {};
// for (let i of mapsStr) {
//   shimamotochouObj[i] = new TileLayer(new Shimamotochou())
// }
// function Sijounawateshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/sijounawateshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const sijounawateshiObj = {};
// for (let i of mapsStr) {
//   sijounawateshiObj[i] = new TileLayer(new Sijounawateshi())
// }
// function Suitashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/suitashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const suitashiObj = {};
// for (let i of mapsStr) {
//   suitashiObj[i] = new TileLayer(new Suitashi())
// }
// function Taishichou () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/taishichou/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const taishichouObj = {};
// for (let i of mapsStr) {
//   taishichouObj[i] = new TileLayer(new Taishichou())
// }
// function Takaishishi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/takaishishi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const takaishishiObj = {};
// for (let i of mapsStr) {
//   takaishishiObj[i] = new TileLayer(new Takaishishi())
// }
// function Takatukishi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/takatukishi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const takatukishiObj = {};
// for (let i of mapsStr) {
//   takatukishiObj[i] = new TileLayer(new Takatukishi())
// }
// function Toyonakashi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/toyonakashi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const toyonakashiObj = {};
// for (let i of mapsStr) {
//   toyonakashiObj[i] = new TileLayer(new Toyonakashi())
// }
// function Toyonochou () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/toyonochou/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const toyonochouObj = {};
// for (let i of mapsStr) {
//   toyonochouObj[i] = new TileLayer(new Toyonochou())
// }
// function Yaoshi () {
//   this.preload = Infinity
//   // this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
//   this.source = new XYZ({
//     url: 'https://kenzkenz2.xsrv.jp/osaka/yaoshi/{z}/{x}/{y}.png',
//     crossOrigin: 'Anonymous',
//     minZoom: 1,
//     maxZoom: 18
//   });
// }
// const yaoshiObj = {};
// for (let i of mapsStr) {
//   yaoshiObj[i] = new TileLayer(new Yaoshi())
// }
//----------------------
// const osakaCsObj = {};
// for (let i of mapsStr) {
//   osakaCsObj[i] = new LayerGroup({
//     layers: [
//       chihayaakasakamuraObj[i],
//       tondabayashishiObj[i],
//       daitoushiObj[i],
//       hannanshiObj[i],
//       higashiosakashiObj[i],
//       hirakatashiObj[i],
//       ibarakishiObj[i],
//       ikedashiObj[i],
//       habikinoshiObj[i],
//       izumisanoshiObj[i],
//       izumiObj[i],
//       kaizukashiObj[i],
//       kashiwarashiObj[i],
//       kananchouObj[i],
//       katanoshiObj[i],
//       kawachinaganoshiObj[i],
//       kishiwadashiObj[i],
//       kumatorichouObj[i],
//       minoshiObj[i],
//       misakichouObj[i],
//       neyagawashiObj[i],
//       nosechouObj[i],
//       sakaishiObj[i],
//       sennanshiObj[i],
//       shimamotochouObj[i],
//       sijounawateshiObj[i],
//       suitashiObj[i],
//       taishichouObj[i],
//       takaishishiObj[i],
//       takatukishiObj[i],
//       toyonakashiObj[i],
//       toyonochouObj[i],
//       yaoshiObj[i]
//     ]
//   })
// }
// 大阪府CS立体図--------------------------------------------------------
function OsakaCS () {
  this.preload = Infinity
  this.extent = transformE([134.9416, 35.10699,135.8409, 34.2379])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/pref-osaka/osaka-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 18
  });
}
const osakaCsObj = {};
for (let i of mapsStr) {
  osakaCsObj[i] = new TileLayer(new OsakaCS())
}
const osakaCsSumm = '<a href="https://github.com/shi-works/aist-dem-with-cs-on-maplibre-gl-js" target="_blank">aist-dem-with-cs-on-maplibre-gl-jsaist-dem-with-cs-on-maplibre-gl-js</a>';

// 和歌山県CS立体図--------------------------------------------------------
function WakayamaCS () {
  this.preload = Infinity
  this.extent = transformE([134.95532947982784,34.40572624226317, 136.0375257154846,33.41823638210427])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/pref-wakayama/wakayamapc-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 18
  });
}
const wakayamaCsObj = {};
for (let i of mapsStr) {
  wakayamaCsObj[i] = new TileLayer(new WakayamaCS())
}
const wakayamaCsSumm = '<a href="https://github.com/shi-works/aist-dem-with-cs-on-maplibre-gl-js" target="_blank">aist-dem-with-cs-on-maplibre-gl-jsaist-dem-with-cs-on-maplibre-gl-js</a>';

// 東京都多摩地域陰陽図 ----------------------------------------------------------------------------
function Tamainyou () {
  this.preload = Infinity
  this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tamainyou/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tamainyou00Obj = {};
for (let i of mapsStr) {
  tamainyou00Obj[i] = new TileLayer(new Tamainyou())
}
const tamainyouSumm = '<a href="https://www.geospatial.jp/ckan/dataset/tokyopc-tama-2023/resource/e0b49600-9394-4416-99eb-be766eb33006" target="_blank">G空間情報センター</a>';
//------
function Toushonyou01 () {
  this.preload = Infinity
  this.extent = transformE([139.3291, 34.80158, 139.4594, 34.67136])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyoinyou01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyoinyou01Obj = {};
for (let i of mapsStr) {
  tousyoinyou01Obj[i] = new TileLayer(new Toushonyou01())
}
//------
function Toushonyou02 () {
  this.preload = Infinity
  this.extent = transformE([138.9873, 34.5704, 139.3528, 34.16614])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyoinyou02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyoinyou02Obj = {};
for (let i of mapsStr) {
  tousyoinyou02Obj[i] = new TileLayer(new Toushonyou02())
}
//------
function Toushonyou03 () {
  this.preload = Infinity
  this.extent = transformE([139.4534, 34.13815, 139.5832, 34.03666])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyoinyou03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyoinyou03Obj = {};
for (let i of mapsStr) {
  tousyoinyou03Obj[i] = new TileLayer(new Toushonyou03())
}
//------
function Toushonyou04 () {
  this.preload = Infinity
  this.extent = transformE([139.5721, 33.90441, 139.6372, 33.84859])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyoinyou04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyoinyou04Obj = {};
for (let i of mapsStr) {
  tousyoinyou04Obj[i] = new TileLayer(new Toushonyou04())
}
//------
function Toushonyou05 () {
  this.preload = Infinity
  this.extent = transformE([139.6562, 33.16488, 139.8692, 33.03760])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyoinyou05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyoinyou05Obj = {};
for (let i of mapsStr) {
  tousyoinyou05Obj[i] = new TileLayer(new Toushonyou05())
}
//------
function Toushonyou06 () {
  this.preload = Infinity
  this.extent = transformE([139.7514, 32.47644, 139.7881, 32.43893])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyoinyou06/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyoinyou06Obj = {};
for (let i of mapsStr) {
  tousyoinyou06Obj[i] = new TileLayer(new Toushonyou06())
}
//----------------------
const tamainyouObj = {};
for (let i of mapsStr) {
  tamainyouObj[i] = new LayerGroup({
    layers: [
      tamainyou00Obj[i],
      tousyoinyou01Obj[i],
      tousyoinyou02Obj[i],
      tousyoinyou03Obj[i],
      tousyoinyou04Obj[i],
      tousyoinyou05Obj[i],
      tousyoinyou06Obj[i],
    ]
  })
}

// 東京都多摩地域赤色立体地図 ----------------------------------------------------------------------------
function Tamared () {
  this.preload = Infinity
  this.extent = transformE([138.9259, 35.90926,139.6112, 35.46722])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tamasekisyoku/{z}/{x}/{-y}.png',
    // url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyosekisyoku01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 1,
    maxZoom: 18
  })
}
const tamared00Obj = {};
for (let i of mapsStr) {
  tamared00Obj[i] = new TileLayer(new Tamared())
}
const tamaredSumm = '<a href="https://www.geospatial.jp/ckan/dataset/tokyopc-tama-2023/resource/b3f13db5-bfdb-4d94-91bd-0b0f617bc37e" target="_blank">G空間情報センター</a>';

//------
function Toushosekisyoku01 () {
  this.preload = Infinity
  this.extent = transformE([139.3291, 34.80158, 139.4594, 34.67136])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyosekisyoku01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyosekisyoku01Obj = {};
for (let i of mapsStr) {
  tousyosekisyoku01Obj[i] = new TileLayer(new Toushosekisyoku01())
}
//------
function Toushosekisyoku02 () {
  this.preload = Infinity
  this.extent = transformE([138.9873, 34.5704, 139.3528, 34.16614])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyosekisyoku02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyosekisyoku02Obj = {};
for (let i of mapsStr) {
  tousyosekisyoku02Obj[i] = new TileLayer(new Toushosekisyoku02())
}
//------
function Toushosekisyoku03 () {
  this.preload = Infinity
  this.extent = transformE([139.4534, 34.13815, 139.5832, 34.03666])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyosekisyoku03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyosekisyoku03Obj = {};
for (let i of mapsStr) {
  tousyosekisyoku03Obj[i] = new TileLayer(new Toushosekisyoku03())
}
//------
function Toushosekisyoku04 () {
  this.preload = Infinity
  this.extent = transformE([139.5721, 33.90441, 139.6372, 33.84859])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyosekisyoku04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyosekisyoku04Obj = {};
for (let i of mapsStr) {
  tousyosekisyoku04Obj[i] = new TileLayer(new Toushosekisyoku04())
}
//------
function Toushosekisyoku05 () {
  this.preload = Infinity
  this.extent = transformE([139.6562, 33.16488, 139.8692, 33.03760])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyosekisyoku05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyosekisyoku05Obj = {};
for (let i of mapsStr) {
  tousyosekisyoku05Obj[i] = new TileLayer(new Toushosekisyoku05())
}
//------
function Toushosekisyoku06 () {
  this.preload = Infinity
  this.extent = transformE([139.7514, 32.47644, 139.7881, 32.43893])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/tokyo/tousyosekisyoku06/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const tousyosekisyoku06Obj = {};
for (let i of mapsStr) {
  tousyosekisyoku06Obj[i] = new TileLayer(new Toushosekisyoku06())
}
//----------------------
const tamaredObj = {};
for (let i of mapsStr) {
  tamaredObj[i] = new LayerGroup({
    layers: [
      tamared00Obj[i],
      tousyosekisyoku01Obj[i],
      tousyosekisyoku02Obj[i],
      tousyosekisyoku03Obj[i],
      tousyosekisyoku04Obj[i],
      tousyosekisyoku05Obj[i],
      tousyosekisyoku06Obj[i],
    ]
  })
}

// 能登CS立体図 ----------------------------------------------------------------------------
function NotoCs () {
  this.preload = Infinity
  this.extent = transformE([136.5141, 37.55607,137.4426, 36.89691])
  this.source = new XYZ({
    url: 'https://www2.ffpri.go.jp/soilmap/tile/cs_noto/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const notoCsObj = {};
for (let i of mapsStr) {
  notoCsObj[i] = new TileLayer(new NotoCs())
}
const notoCsSumm = '<a href="https://www.ffpri.affrc.go.jp/press/2022/20220928/index.html\n" target="_blank">森林総合研究所</a>';

// 能登西部赤色立体図 ----------------------------------------------------------------------------
function NotoSeibu () {
  this.preload = Infinity
  this.extent = transformE([136.6591, 37.46178 ,137.19235, 36.91536])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/notoseibu/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const notoSeibuObj = {};
for (let i of mapsStr) {
  notoSeibuObj[i] = new TileLayer(new NotoSeibu())
}
const notoSeubuSumm = '<a href="https://www.geospatial.jp/ckan/dataset/2024-notowest-mtopo" target="_blank">G空間情報センター</a>';

// 長野県CS立体図----------------------------------------------------------------------------
function NaganoCs () {
  this.preload = Infinity
  this.extent = transformE([137.34924687267085, 35.181791181300085,138.7683143113627, 37.14523688239089])
  this.source = new XYZ({
    url: 'https://tile.geospatial.jp/CS/VER2/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 10,
    maxZoom: 18
  });
}
const naganoCsObj = {};
for (let i of mapsStr) {
  naganoCsObj[i] = new TileLayer(new NaganoCs())
}
const naganoCsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/nagano-csmap" target="_blank">G空間情報センター</a>'
// 静岡県CS立体図----------------------------------------------------------------------------
function SizuokaCs () {
  this.preload = Infinity
  this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cssizuoka/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const sizuokaCsObj = {};
for (let i of mapsStr) {
  sizuokaCsObj[i] = new TileLayer(new SizuokaCs())
}
const sizuokaCsSumm = '<a href="https://www.geospatial.jp/ckan/dataset/shizuokakencsmap2" target="_blank">G空間情報センター</a>'
// 静岡県CS立体図50cm----------------------------------------------------------------------------
function SizuokaCs50cm () {
  this.preload = Infinity
  this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/sizuoka2/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  });
}
const sizuokaCs2Obj = {};
for (let i of mapsStr) {
  sizuokaCs2Obj[i] = new TileLayer(new SizuokaCs50cm())
}
const sizuokaCs2Summ = '<a href="https://www.geospatial.jp/ckan/dataset/shizuoka-2023-csmap" target="_blank">G空間情報センター</a>'

// 広島県CS立体図 林野庁0.5m----------------------------------------------------------------------------
function HiroshimaCs () {
  this.preload = Infinity
  this.extent = transformE([132.1650338172913, 34.69661995103654,133.3746349811554, 34.03206918961159])
  this.source = new XYZ({
    url: 'https://www2.ffpri.go.jp/soilmap/tile/cs_hiroshima/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  });
}
const hiroshimaCsObj = {};
for (let i of mapsStr) {
  hiroshimaCsObj[i] = new TileLayer(new HiroshimaCs())
}
const hiroshimaCsSumm = '出典：<a href="https://www2.ffpri.go.jp/soilmap/index.html" target="_blank">森林総研・森林土壌デジタルマップ</a>'

// 広島県CS立体図shi-works氏-CS 1m---------------------------------------------------------------------------
function HiroshimaCsShiWorks () {
  this.preload = Infinity
  // this.extent = transformE([132.1650338172913, 34.69661995103654,133.3746349811554, 34.03206918961159])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/pref-hiroshima/hiroshimapc-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 17
  });
}
const hiroshimaCsObj2 = {};
for (let i of mapsStr) {
  hiroshimaCsObj2[i] = new TileLayer(new HiroshimaCsShiWorks())
}
const hiroshimaCs2Summ = '<a href="https://github.com/shi-works/aist-dem-with-cs-on-maplibre-gl-js" target="_blank">aist-dem-with-cs-on-maplibre-gl-js</a>'

// 広島県CS立体図shi-works氏-CS 0.5m---------------------------------------------------------------------------
function HiroshimaCsShiWorks05 () {
  this.preload = Infinity
  // this.extent = transformE([132.1650338172913, 34.69661995103654,133.3746349811554, 34.03206918961159])
  this.source = new XYZ({
    // url: 'https://xs489works.xsrv.jp/raster-tiles/pref-hiroshima/hiroshimapc-cs-tiles/{z}/{x}/{y}.png',
    url: 'https://shiworks.xsrv.jp/raster-tiles/pref-hiroshima/hiroshimapc-2022-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 17
  });
}
const hiroshimaCsObj3 = {};
for (let i of mapsStr) {
  hiroshimaCsObj3[i] = new TileLayer(new HiroshimaCsShiWorks05())
}
// const hiroshimaCs2Summ = '<a href="https://github.com/shi-works/aist-dem-with-cs-on-maplibre-gl-js" target="_blank">aist-dem-with-cs-on-maplibre-gl-js</a>'


// 岡山県CS立体図----------------------------------------------------------------------------
function OkayamaCs () {
  this.preload = Infinity
  // this.extent = transformE([132.1650338172913, 34.69661995103654,133.3746349811554, 34.03206918961159])
  this.source = new XYZ({
    url: 'https://www2.ffpri.go.jp/soilmap/tile/cs_okayama/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  });
}
const okayamaCsObj = {};
for (let i of mapsStr) {
  okayamaCsObj[i] = new TileLayer(new OkayamaCs())
}
const okayamaCsSumm = '出典：<a href="https://www2.ffpri.go.jp/soilmap/index.html" target="_blank">森林総研・森林土壌デジタルマップ</a>'

// 熊本県・大分県CS立体図----------------------------------------------------------------------------
function KumamotoCs () {
  this.preload = Infinity
  this.extent = transformE([130.6688, 33.39105,131.5633, 32.53706])
  this.source = new XYZ({
    url: 'https://www2.ffpri.go.jp/soilmap/tile/cs_kumamoto_oita/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  });
}
const kumamotoCsObj = {};
for (let i of mapsStr) {
  kumamotoCsObj[i] = new TileLayer(new KumamotoCs())
}
const kumamotoCsSumm = '出典：<a href="https://www2.ffpri.go.jp/soilmap/index.html" target="_blank">森林総研・森林土壌デジタルマップ</a>'
// 福島県CS立体図----------------------------------------------------------------------------
function FukusshimaCs () {
  this.preload = Infinity
  this.extent = transformE([139.9634, 37.96571,141.2000, 36.99131])
  this.source = new XYZ({
    url: 'https://www2.ffpri.go.jp/soilmap/tile/cs_fukushima/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  });
}
const fukushimaCsObj = {};
for (let i of mapsStr) {
  fukushimaCsObj[i] = new TileLayer(new FukusshimaCs())
}
const fukushimaCsSumm = '出典：<a href="https://www2.ffpri.go.jp/soilmap/index.html" target="_blank">森林総研・森林土壌デジタルマップ</a>'
// 愛媛県CS立体図----------------------------------------------------------------------------
function EhimeCs () {
  this.preload = Infinity
  this.extent = transformE([132.0778, 34.37512,134.2125, 32.83277])
  this.source = new XYZ({
    url: 'https://www2.ffpri.go.jp/soilmap/tile/cs_ehime/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  });
}
const ehimeCsObj = {};
for (let i of mapsStr) {
  ehimeCsObj[i] = new TileLayer(new EhimeCs())
}
const ehimeCsSumm = '出典：<a href="https://www2.ffpri.go.jp/soilmap/index.html" target="_blank">森林総研・森林土壌デジタルマップ</a>'
// 東京都CS立体図test----------------------------------------------------------------------------
function TamaCs () {
  this.preload = Infinity
  this.extent = transformE([138.93110047834082,35.90551606609344, 139.60311090985996,35.49503296693065])
  this.source = new XYZ({
    url: 'https://shiworks.xsrv.jp/raster-tiles/tokyo-digitaltwin/tokyopc-tama-2023-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 19
  });
}
const tamaCsObj = {};
for (let i of mapsStr) {
  tamaCsObj[i] = new TileLayer(new TamaCs())
}
const tamaCsSumm = '<a href="https://github.com/shi-works/aist-dem-with-cs-on-maplibre-gl-js" target="_blank">aist-dem-with-cs-on-maplibre-gl-js</a>'
// 伊豆大島
function izuooshima () {
  this.preload = Infinity
  this.extent = transformE([139.34043993591177,34.804413371961076, 139.45518445569877,34.67391471650552])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/tokyo-digitaltwin/tokyopc-shima-01-2023-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 19
  });
}
const izuooshimaCsObj = {};
for (let i of mapsStr) {
  izuooshimaCsObj[i] = new TileLayer(new izuooshima())
}
// 利島、新島、式根島、神津島
function tomoshima () {
  this.preload = Infinity
  this.extent = transformE([138.98320733791348,34.56847662565042, 139.39485131984708,34.13658562384532])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/tokyo-digitaltwin/tokyopc-shima-02-2023-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 19
  });
}
const tomoshimaCsObj = {};
for (let i of mapsStr) {
  tomoshimaCsObj[i] = new TileLayer(new tomoshima())
}
//三宅島
function miyakejima () {
  this.preload = Infinity
  this.extent = transformE([139.46296685190651,34.13809622325495, 139.57339784444721,34.041136939996946])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/tokyo-digitaltwin/tokyopc-shima-03-2023-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 19
  });
}
const miyakejimCsObj = {};
for (let i of mapsStr) {
  miyakejimCsObj[i] = new TileLayer(new miyakejima())
}
// 御蔵島
function mikurajima () {
  this.preload = Infinity
  this.extent = transformE([139.57190963346537,33.90455655595973, 139.63541741005005,33.84863773109609])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/tokyo-digitaltwin/tokyopc-shima-04-2023-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 19
  });
}
const mikurajimaCsObj = {};
for (let i of mapsStr) {
  mikurajimaCsObj[i] = new TileLayer(new mikurajima())
}
// 八丈島
function hachijojima () {
  this.preload = Infinity
  this.extent = transformE([139.63696957828407,33.17531101027478, 139.86877396530423,33.03842021632886])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/tokyo-digitaltwin/tokyopc-shima-05-2023-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 19
  });
}
const hachijojimaCsObj = {};
for (let i of mapsStr) {
  hachijojimaCsObj[i] = new TileLayer(new hachijojima())
}
// 青ヶ島
function aogashima () {
  this.preload = Infinity
  this.extent = transformE([139.75174508612426,32.47625962061629, 139.78321093985278,32.440960255575675])
  this.source = new XYZ({
    url: 'https://xs489works.xsrv.jp/raster-tiles/tokyo-digitaltwin/tokyopc-shima-06-2023-cs-tiles/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 19
  });
}
const aogashimaCsObj = {};
for (let i of mapsStr) {
  aogashimaCsObj[i] = new TileLayer(new aogashima())
}

const tokyoCsObj = {};
for (let i of mapsStr) {
  tokyoCsObj[i] = new LayerGroup({
    layers: [
      tamaCsObj[i],
      izuooshimaCsObj[i],
      tomoshimaCsObj[i],
      miyakejimCsObj[i],
      mikurajimaCsObj[i],
      hachijojimaCsObj[i],
      aogashimaCsObj[i]
    ]
  })
}

const cs00Obj = {}
for (let i of mapsStr) {
  cs00Obj[i] = new LayerGroup({
    layers: [
      tochigicsObj[i],
      gihuCsObj[i],
      // hyougoCs50Obj[i],
      hyougoCs50c2Obj[i],
      naganoCsObj[i],
      sizuokaCs2Obj[i],
      hiroshimaCsObj2[i],
      // hiroshimaCsObj[i],
      okayamaCsObj[i],
      fukushimaCsObj[i],
      ehimeCsObj[i],
      kochiCsObj[i],
      kumamotoCsObj[i],
      wakayamaCsObj[i],
      osakaCsObj[i],
      notoCsObj[i],

      tamaCsObj[i],
      izuooshimaCsObj[i],
      tomoshimaCsObj[i],
      miyakejimCsObj[i],
      mikurajimaCsObj[i],
      hachijojimaCsObj[i],
      aogashimaCsObj[i]

    ]
  })
}

// 兵庫県遺跡----------------------------------------------------------------------------
function Mayasanjyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/mayasanjyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const mayasanjyouObj = {};
for (let i of mapsStr) {
  mayasanjyouObj[i] = new TileLayer(new Mayasanjyou())
}
const hyougoIsekiSumm = '<a href="https://www.geospatial.jp/ckan/dataset/2021-2022-hyogo-shiseki" target="_blank">G空間情報センター</a>'


function Takiyamajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/takiyamajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const takiyamajyouObj = {};
for (let i of mapsStr) {
  takiyamajyouObj[i] = new TileLayer(new Takiyamajyou())
}


function Yamashitajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/yamashitajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const yamashitajyouObj = {};
for (let i of mapsStr) {
  yamashitajyouObj[i] = new TileLayer(new Yamashitajyou())
}

function Arikoyamajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/arikoyamajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const arikoyamajyouObj = {};
for (let i of mapsStr) {
  arikoyamajyouObj[i] = new TileLayer(new Arikoyamajyou())
}

function Yagijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/yagijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const yagijyouObj = {};
for (let i of mapsStr) {
  yagijyouObj[i] = new TileLayer(new Yagijyou())
}

function Konosumiyamajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/konosumiyamajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const konosumiyamaObj = {};
for (let i of mapsStr) {
  konosumiyamaObj[i] = new TileLayer(new Konosumiyamajyou())
}

function Iwaojyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/iwaojyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const iwaojyouObj = {};
for (let i of mapsStr) {
  iwaojyouObj[i] = new TileLayer(new Iwaojyou())
}

function Kuroijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/kuroijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const kuroijyouObj = {};
for (let i of mapsStr) {
  kuroijyouObj[i] = new TileLayer(new Kuroijyou())
}

function Sasayamajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/sasayamajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const sasayamajyouObj = {};
for (let i of mapsStr) {
  sasayamajyouObj[i] = new TileLayer(new Sasayamajyou())
}

function Yakamijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/yakamijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const yakamijyouObj = {};
for (let i of mapsStr) {
  yakamijyouObj[i] = new TileLayer(new Yakamijyou())
}

function Sumotojyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/sumotojyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const sumotojyouObj = {};
for (let i of mapsStr) {
  sumotojyouObj[i] = new TileLayer(new Sumotojyou())
}

function Shirasujyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/shirasujyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const shirasujyouObj = {};
for (let i of mapsStr) {
  shirasujyouObj[i] = new TileLayer(new Shirasujyou())
}

function Yurakojyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/yurakojyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const yurakojyouuObj = {};
for (let i of mapsStr) {
  yurakojyouuObj[i] = new TileLayer(new Yurakojyou())
}

function Takenokuchijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/takenokuchijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const takenokuchiObj = {};
for (let i of mapsStr) {
  takenokuchiObj[i] = new TileLayer(new Takenokuchijyou())
}

function Takedajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/takedajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const takedajyouObj = {};
for (let i of mapsStr) {
  takedajyouObj[i] = new TileLayer(new Takedajyou())
}

function Ariokajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/ariokajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const ariokajyouObj = {};
for (let i of mapsStr) {
  ariokajyouObj[i] = new TileLayer(new Ariokajyou())
}

function Kanjyousanjyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/kanjyousanjyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const kanjyousanjyouObj = {};
for (let i of mapsStr) {
  kanjyousanjyouObj[i] = new TileLayer(new Kanjyousanjyou())
}

function Keirousanjyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/keirousanjyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const keirousanjyouObj = {};
for (let i of mapsStr) {
  keirousanjyouObj[i] = new TileLayer(new Keirousanjyou())
}

function Mikijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/mikijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const mikijyouObj = {};
for (let i of mapsStr) {
  mikijyouObj[i] = new TileLayer(new Mikijyou())
}

function Sasanomarujyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/sasanomarujyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const sasanomarujyouObj = {};
for (let i of mapsStr) {
  sasanomarujyouObj[i] = new TileLayer(new Sasanomarujyou())
}

function Kodanijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/kodanijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const kodanijyouObj = {};
for (let i of mapsStr) {
  kodanijyouObj[i] = new TileLayer(new Kodanijyou())
}

function Koudukijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/koudukijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const koudukijyouObj = {};
for (let i of mapsStr) {
  koudukijyouObj[i] = new TileLayer(new Koudukijyou())
}

function Kinoyamajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/kinoyamajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const kinoyamajyouObj = {};
for (let i of mapsStr) {
  kinoyamajyouObj[i] = new TileLayer(new Kinoyamajyou())
}

function Niisanjyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/niisanjyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const niisanjyouObj = {};
for (let i of mapsStr) {
  niisanjyouObj[i] = new TileLayer(new Niisanjyou())
}

function Akooujyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/akoujyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const akoujyouObj = {};
for (let i of mapsStr) {
  akoujyouObj[i] = new TileLayer(new Akooujyou())
}

function Oshiojyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/oshiojyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const oshiojyouObj = {};
for (let i of mapsStr) {
  oshiojyouObj[i] = new TileLayer(new Oshiojyou())
}

function Tyuudousisanjyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/tyuudoushisanjyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const tyuudousisanjyouObj = {};
for (let i of mapsStr) {
  tyuudousisanjyouObj[i] = new TileLayer(new Tyuudousisanjyou())
}

function Takakurayamajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/takakurayamajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const takakurayamajyouObj = {};
for (let i of mapsStr) {
  takakurayamajyouObj[i] = new TileLayer(new Takakurayamajyou())
}

function Shirohatajyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/shirohatajyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const shirohatajyouObj = {};
for (let i of mapsStr) {
  shirohatajyouObj[i] = new TileLayer(new Shirohatajyou())
}

function Himejijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/himejijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const himejijyouObj = {};
for (let i of mapsStr) {
  himejijyouObj[i] = new TileLayer(new Himejijyou())
}

function Akashijyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/akashijyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const akashijyouObj = {};
for (let i of mapsStr) {
  akashijyouObj[i] = new TileLayer(new Akashijyou())
}

function Rikanjyou () {
  this.preload = Infinity
  // this.extent = transformE([137.47545,34.59443,139.1504,35.64359])
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/hyougoiseki/rikanjyou/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 20
  });
}
const rikanjyouObj = {};
for (let i of mapsStr) {
  rikanjyouObj[i] = new TileLayer(new Rikanjyou())
}

// 日本CS立体図------------------------------------------------------------------------------
// function NihonCs () {
//   this.preload = Infinity
//   this.source = new XYZ({
//     url: 'https://main-kouapp.ssl-lolipop.jp/csmap/tile/japan/{z}/{x}/{y}.jpg',
//     // crossOrigin: 'Anonymous',
//     minZoom:9,
//     maxZoom:15
//   })
// }
// const nihonCsObj = {};
// for (let i of mapsStr) {
//   nihonCsObj[i] = new TileLayer(new NihonCs())
// }
// const nihonCsSumm = '<a href="http://kouapp.main.jp/csmap/japan/setumei.html" target="_blank">日本CS立体図</a>'

// 都市圏活断層図------------------------------------------------------------------------------
function Katudansou () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/afm/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:16
  })
}
const katudansouObj = {};
for (let i of mapsStr) {
  katudansouObj[i] = new TileLayer(new Katudansou())
}
const katudansouSumm = '<a href="https://www.gsi.go.jp/common/000084060.pdf" target="_blank">凡例</a>' +
    '<br><a href="https://www.gsi.go.jp/bousaichiri/guidebook.html" target="_blank">解説</a>' +
    '<br><a href="https://www.gsi.go.jp/common/000153506.pdf" target="_blank">利用の手引き</a>'

// 迅速測図 (福岡近郊)----------------------------------------------------------------------------
function Jinsokufukuoka () {
  this.preload = Infinity
  this.extent = transformE([130.2971933139769,33.68404102628524, 130.86856135845176,33.304081408031806])
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/00fukuoka50000/merge/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom:0,
    maxZoom:17
  })
}
const jinsokuFukuokaObj = {};
for (let i of mapsStr) {
  jinsokuFukuokaObj[i] = new TileLayer(new Jinsokufukuoka())
}
const jinsokuFukuokaSumm = '<a target="_blank"href="https://info.qchizu.xyz">Q地図タイル</a>(<a target="_blank"href="https://www.ndl.go.jp/">国立国会図書館</a>蔵)'
// 迅速測図 (小倉近郊)----------------------------------------------------------------------------
function Jinsokukokura () {
  this.preload = Infinity
  this.extent = transformE([130.32556511442056,34.00346840440295, 131.34746642964214,33.47818885837762])
  this.source = new XYZ({
    url: 'https://mapdata.qchizu.xyz/00kokura50000/merge/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom:0,
    maxZoom:17
  })
}
const jinsokuKokuraObj = {};
for (let i of mapsStr) {
  jinsokuKokuraObj[i] = new TileLayer(new Jinsokukokura())
}
const jinsokuKokuraSumm = '<a target="_blank"href="https://info.qchizu.xyz">Q地図タイル</a>(<a target="_blank"href="https://www.ndl.go.jp/">国立国会図書館</a>蔵)'
// 迅速測図 (関東)----------------------------------------------------------------------------
function Jinsoku () {
  this.preload = Infinity
  this.extent = transformE([138.954453,34.86946,140.8793163,36.45969967])
  this.source = new XYZ({
    url: 'https://boiledorange73.sakura.ne.jp/ws/tile/Kanto_Rapid-900913/{z}/{x}/{y}.png', // 応急処置
    // url: 'https://boiledorange73.sakura.ne.jp/ws/tile/Kanto_Rapid-900913/{z}/{x}/{y}.jpg', // 応急処置
    // url: 'https://habs.rad.naro.go.jp/rapid16/{z}/{x}/{-y}.png',// 正
    // url: 'https://habs.rad.naro.go.jp/rapid16/{z}/{x}/{-y}.png',
    // url: 'https://aginfo.cgk.affrc.go.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    // minZoom:1,
    maxZoom:16
  });
}
const jinsokuObj = {};
for (let i of mapsStr) {
  jinsokuObj[i] = new TileLayer(new Jinsoku())
}
const jinsokuSumm = '出典：<a href=\'https://boiledorange73.sakura.ne.jp/\' target=\'_blank\'>boiledorange73@sakura</a>'
// 東京5000分の1----------------------------------------------------------------------------
function Tokyo5000 () {
  this.preload = Infinity
  this.extent = transformE([138.954453,34.86946,140.8793163,36.45969967])
  this.source = new XYZ({
    url: 'https://boiledorange73.sakura.ne.jp/ws/tile/Tokyo5000-900913/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:18
  });
}
const tokyo5000Obj = {};
for (let i of mapsStr) {
  tokyo5000Obj[i] = new TileLayer(new Tokyo5000())
}
const tokyo5000Summ = '出典：<a href=\'https://boiledorange73.sakura.ne.jp/\' target=\'_blank\'>boiledorange73@sakura</a>' +
    '<br>明治17年（1884）に、参謀本部陸軍部測量局が<br>作成した五千分一東京図測量原図'

// CS立体図10Mここから-----------------------------------------------------------------------
function Cs10m01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/1/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([128.4,32.5,129.530,34.7])
}
function Cs10m02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/2/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([129.02,30.2,132.9,34])
}
function Cs10m03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/3/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([129.99,33.33,133.7,36.6])
}
function Cs10m04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/4/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([131.99,32.68,134.98,34.67])
}
function Cs10m05 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/5/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([132.99,34.00,135.48,35.8])
}
function Cs10m06 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/6/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([134.51,33.40,137.02,36.34])
}
function Cs10m07 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/7/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([135.99,34.00,137.90,37.66])
}
function Cs10m08 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/8/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([137.00,38.68,139.97,34.56])
}
function Cs10m09 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/9/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([138.05,38.00,140.99,32.43])
}
function Cs10m10 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/10/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([139.46,41.65,142.12,37.66])
}
function Cs10m11 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/11/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([139.00,43.35,141.19,41.33])
}
function Cs10m12 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/12/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([140.93,45.65,144.05,41.85])
}
function Cs10m13 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/13/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([143.95,44.35,145.95,42.70])
}
function Cs10m15 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mtile.pref.miyazaki.lg.jp/tile/cs/15/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom:1,
    maxZoom:15
  });
  this.extent = transformE([126.60,27.37,128.82,26.00])
}
const cs10mObj = {}
for (let i of mapsStr) {
  cs10mObj[i] = new LayerGroup({
    layers: [
      new TileLayer(new Cs10m01()),
      new TileLayer(new Cs10m02()),
      new TileLayer(new Cs10m03()),
      new TileLayer(new Cs10m04()),
      new TileLayer(new Cs10m05()),
      new TileLayer(new Cs10m06()),
      new TileLayer(new Cs10m07()),
      new TileLayer(new Cs10m08()),
      new TileLayer(new Cs10m09()),
      new TileLayer(new Cs10m10()),
      new TileLayer(new Cs10m11()),
      new TileLayer(new Cs10m12()),
      new TileLayer(new Cs10m13()),
      new TileLayer(new Cs10m15())
    ]
  })
}

const cs10mSumm = ''
// CS立体図10Mここまで-----------------------------------------------------------------------
// 日本版mapwarper５万分の１ここから------------------------------------------------------
// 5万分の1,20万分の1の共用コンストラクタなど
// 共用スタイル
const style = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1
  }),
  text: new Text({
    font: '12px Calibri,sans-serif',
    fill: new Fill({
      color: '#000'
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3
    })
  })
});
// タイル
function Mapwarper (url,bbox,maxResolution) {
  this.preload = Infinity
  this.source = new XYZ({
    url: url,
    crossOrigin: 'Anonymous',
    // minZoom: 1,
    // maxZoom: 18
  });
  //mymapのwatchLayerで実際にextentを作っている。
  this.extent2 = transformE(bbox)
  this.maxResolution = maxResolution
}
// 地図上に地区名を表示する。
function Mw5center () {
  this.preload = Infinity
  this.name = 'Mw5center'
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/mw5centerNew.geojson',
    format: new GeoJSON()
  });
  // this.maxResolution = 1222.99
  this.maxResolution = 611.496226 // zoom8
  this.style = function(feature) {
    style.getText().setText(feature.get('title') );
    return style
  }
}
export const mw5Obj = {}
for (let i of mapsStr) {
  const layerGroup = []
  const length =  mw5.length
  for (let j = 0; j < length; j++) {
    const id = mw5[j].id
    const url = 'https://mapwarper.h-gis.jp/maps/tile/' + id + '/{z}/{x}/{y}.png'
    const bbox = mw5[j].extent
    const layer = new TileLayer(new Mapwarper(url,bbox,611.496226))
    layerGroup.push(layer)
  }
  const mw5centerLayer = new VectorLayer(new Mw5center())
  layerGroup.push(mw5centerLayer)
  mw5Obj[i] = new LayerGroup({
    layers: layerGroup
  })
}
for (let i of mapsStr) {
  mw5Obj[i].values_['mw'] = true
}
const mw5Summ = '<a href="https://mapwarper.h-gis.jp/" target="_blank">日本版 Map Warper</a><br>' +
  '<a href="https://stanford.maps.arcgis.com/apps/SimpleViewer/index.html?appid=733446cc5a314ddf85c59ecc10321b41" target="_blank">スタンフォード大学</a>';

// 日本版mapwarper５万分の１ここまで------------------------------------------------------
// 日本版mapwarper20万分の１ここから------------------------------------------------------
// 地区名
function Mw20center () {
  this.name = 'Mw20center'
  // this.preload = Infinity
  this.source = new VectorSource({
    url:'https://kenzkenz.xsrv.jp/open-hinata/geojson/mw20center.geojson',
    format: new GeoJSON()
  })
  this.maxResolution = 611.496226 // zoom8
  this.style = function(feature) {
    style.getText().setText(feature.get('title') )
    return style
  }
}
export const mw20Obj = {}
for (let i of mapsStr) {
  const layerGroup = []
  const length =  mw20.length
  for (let j = 0; j < length; j++) {
    const id = mw20[j].id
    const url = 'https://mapwarper.h-gis.jp/maps/tile/' + id + '/{z}/{x}/{y}.png'
    const bbox = mw20[j].extent
    const layer = new TileLayer(new Mapwarper(url,bbox,156543.03))
    layerGroup.push(layer)
  }
  const mw20centerLayer = new VectorLayer(new Mw20center())
  layerGroup.push(mw20centerLayer)
  mw20Obj[i] = new LayerGroup({
    layers: layerGroup
  })
}
const mw20Summ = '<a href="https://mapwarper.h-gis.jp/" target="_blank">日本版 Map Warper</a><br>'
// 日本版mapwarper20万分の１ここまで------------------------------------------------------

// 	東西蝦夷山川地理取調図-------------------------------------------------------------------------------
function Ezosansen () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://kenzkenz2.xsrv.jp/hokkaidou/touzai/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const ezosansenObj = {}
for (let i of mapsStr) {
  ezosansenObj[i] = new TileLayer(new Ezosansen())
}
const ezosansenSumm = '<a href="https://github.com/koukita/touzaiezo" target="_blank">喜多氏のgithub</a>'

function Ezosansen2 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://koukita.github.io/touzaiezo/tile/{z}/{x}/{y}.jpg',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const ezosansen2Obj = {}
for (let i of mapsStr) {
  ezosansen2Obj[i] = new TileLayer(new Ezosansen2())
}
const ezosansenSumm2 = '<a href="https://github.com/koukita/touzaiezo" target="_blank">喜多氏のgithub</a>'
// 	東西蝦夷山川地理取調図ここまで------------------------------------------------------------------------

const SSK = '<a href="https://dl.ndl.go.jp/pid/1880805" target="_blank">最新詳密金刺分縣圖</a>です。'
// 	北海道古地図-------------------------------------------------------------------------------
function Kotizu01hokkaidou () {
  this.preload = Infinity
  this.extent = transformE([139.53735724663997, 41.186004293591395,146.42212376570964, 46.26259923231669])
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu4/tile/01hokkaidou0/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const kotizu01hokkaidouObj = {}
for (let i of mapsStr) {
  kotizu01hokkaidouObj[i] = new TileLayer(new Kotizu01hokkaidou())
}
const kotizu01hokkaidouSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu4/image/01hokkaidou.jpg" target="_blank">jpg</a>'
// 	北海道古地図ここまで------------------------------------------------------------------------
//  レイヤーをマスクする関数
export  function mask (dep,layer) {
  const coords = dep.geometry.coordinates
  // epsg4326(WGS84)のときだけ実行する。
  if(coords[0][0][0]< 1000) {
    for (let i = 0; i < coords[0].length; i++) {
      coords[0][i] = fromLonLat(coords[0][i])
    }
  }
  const f = new Feature(new Polygon(coords))
  const crop = new Crop({
    feature: f,
    wrapX: true,
    inner: false
  });
  layer.addFilter(crop)
  const mask = new Mask({
    feature: f,
    wrapX: true,
    inner: false,
    fill: new Fill({ color:[255,255,255,0.8] })
  });
  layer.addFilter(mask)
  mask.set('active', false)
}
// 	02青森県古地図-------------------------------------------------------------------------------
function Kotizu01aomori () {
  this.preload = Infinity
  this.extent = transformE([139.14337531230578, 40.07947328862201,141.90826803012916, 41.65330584813219]);
  this.dep = MaskDep.aomori
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/02aomoriken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu01aomoriObj = {}
for (let i of mapsStr) {
  kotizu01aomoriObj[i] = new TileLayer(new Kotizu01aomori())
  const dep = kotizu01aomoriObj[i].values_.dep
  mask(dep,kotizu01aomoriObj[i])
}
const kotizu01aomoriSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/02aomoriken.jpg" target="_blank">jpg</a>'
// 	03岩手県古地図-------------------------------------------------------------------------------
function Kotizu03iwate () {
  this.preload = Infinity
  this.extent = transformE([140.4647865251053, 38.60447110081623,142.43317043781053, 40.58197617127430])
  this.dep = MaskDep.iwate
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/3iwateken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu03iwateObj = {}
for (let i of mapsStr) {
  kotizu03iwateObj[i] = new TileLayer(new Kotizu03iwate())
  const dep = kotizu03iwateObj[i].values_.dep
  mask(dep,kotizu03iwateObj[i])
}
const kotizu03iwateSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/3iwateken.jpg" target="_blank">jpg</a>'
// 	04宮城県古地図-------------------------------------------------------------------------------
function Kotizu04miyagi () {
  this.preload = Infinity
  this.extent = transformE([140.1290931689802, 37.70458850846947,141.80756014280652, 39.4555183388096])
  this.dep = MaskDep.miyagi;
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/04miyagiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu04miyagiObj = {}
for (let i of mapsStr) {
  kotizu04miyagiObj[i] = new TileLayer(new Kotizu04miyagi())
  const dep = kotizu04miyagiObj[i].values_.dep
  mask(dep,kotizu04miyagiObj[i])
}
const kotizu04miyagiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/04miyagiken.jpg" target="_blank">jpg</a>'
// 	05秋田県古地図-------------------------------------------------------------------------------
function Kotizu05akita () {
  this.preload = Infinity
  this.extent = transformE([139.57672496186024, 38.80927604504396,141.46576302917126, 40.69313501471041])
  this.dep = MaskDep.akita
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/5akitaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu05akitaObj = {}
for (let i of mapsStr) {
  kotizu05akitaObj[i] = new TileLayer(new Kotizu05akita())
  const dep = kotizu05akitaObj[i].values_.dep
  mask(dep,kotizu05akitaObj[i])
}
const kotizu05akitaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/5akitaken.jpg" target="_blank">jpg</a>'
// 	06山形県古地図-------------------------------------------------------------------------------
function Kotizu06yamagata () {
  this.preload = Infinity
  this.extent = transformE([139.30206674295448, 37.6200337575343,141.1026040665337, 39.26439508091832])
  this.dep = MaskDep.yamagata
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/6yamagataken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu06yamagataObj = {}
for (let i of mapsStr) {
  kotizu06yamagataObj[i] = new TileLayer(new Kotizu06yamagata())
  const dep = kotizu06yamagataObj[i].values_.dep
  mask(dep,kotizu06yamagataObj[i])
}
const kotizu06yamagataSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/6yamagataken.jpg" target="_blank">jpg</a>'
// 	07福島県古地図-------------------------------------------------------------------------------
function Kotizu07hukusima () {
  this.preload = Infinity
  this.extent = transformE([138.9297523319492, 36.715403688409765,141.32538223338815, 38.145118377199196])
  this.dep = MaskDep.hukusima
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/7hukusimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu07hukusimaObj = {}
for (let i of mapsStr) {
  kotizu07hukusimaObj[i] = new TileLayer(new Kotizu07hukusima())
  const dep = kotizu07hukusimaObj[i].values_.dep
  mask(dep,kotizu07hukusimaObj[i])
}
const kotizu07hukusimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/7hukusimaken.jpg" target="_blank">jpg</a>'
// 08茨城県古地図-------------------------------------------------------------------------------
function Kotizu08ibaraki () {
  this.preload = Infinity
  this.extent = transformE([139.58588029093454, 35.584363236024984,141.05682751930664, 37.05225527704674])
  this.dep = MaskDep.ibaraki
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/8ibarakiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu08ibarakiObj = {}
for (let i of mapsStr) {
  kotizu08ibarakiObj[i] = new TileLayer(new Kotizu08ibaraki())
  const dep = kotizu08ibarakiObj[i].values_.dep
  mask(dep,kotizu08ibarakiObj[i])
}
const kotizu08ibarakiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/8ibarakiken.jpg" target="_blank">jpg</a>'
// 09栃木県古地図-------------------------------------------------------------------------------
function Kotizu09tochigi () {
  this.preload = Infinity
  this.extent = transformE([139.16473762415603, 36.034787548044235,140.3640785003479,37.28813719296335])
  this.dep = MaskDep.tochigi
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/9tochigiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu09tochigiObj = {}
for (let i of mapsStr) {
  kotizu09tochigiObj[i] = new TileLayer(new Kotizu09tochigi())
  const dep = kotizu09tochigiObj[i].values_.dep
  mask(dep,kotizu09tochigiObj[i])
}
const kotizu09tochigiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/9tochigiken.jpg" target="_blank">jpg</a>'
// 10群馬県古地図-------------------------------------------------------------------------------
function Kotizu10gunma () {
  this.preload = Infinity
  this.extent = transformE([137.94708623489814, 35.728182291196276,140.03754030889286, 37.35366397666763])
  this.dep = MaskDep.gunma
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu3/tile/10gunmaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu10gunmaObj = {}
for (let i of mapsStr) {
  kotizu10gunmaObj[i] = new TileLayer(new Kotizu10gunma())
  const dep = kotizu10gunmaObj[i].values_.dep
  mask(dep,kotizu10gunmaObj[i])
}
const kotizu10gunmaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu3/image/10gunmaken.jpg" target="_blank">jpg</a>'
// 11埼玉県古地図-------------------------------------------------------------------------------
function Kotizu11saitama () {
  this.preload = Infinity
  this.extent = transformE([138.5177649935174, 35.56202325676628,140.11993795683864, 36.48019691910925])
  this.dep = MaskDep.saitama
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/11saitamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu11saitamaObj = {}
for (let i of mapsStr) {
  kotizu11saitamaObj[i] = new TileLayer(new Kotizu11saitama())
  const dep = kotizu11saitamaObj[i].values_.dep
  mask(dep,kotizu11saitamaObj[i])
}
const kotizu11saitamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/11saitamaken.jpg" target="_blank">jpg</a>'
// 12千葉県古地図-------------------------------------------------------------------------------
function Kotizu12chibaken () {
  this.preload = Infinity
  this.extent = transformE([139.5767250328089, 34.76869219518032,141.05072411212575, 36.23442834465834])
  this.dep = MaskDep.chiba
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/12chibaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu12chibakenObj = {}
for (let i of mapsStr) {
  kotizu12chibakenObj[i] = new TileLayer(new Kotizu12chibaken())
  const dep = kotizu12chibakenObj[i].values_.dep
  mask(dep,kotizu12chibakenObj[i])
}
const kotizu12chibakenSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/12chibaken.jpg" target="_blank">jpg</a>'
// 13東京都古地図-------------------------------------------------------------------------------
function Kotizu13tokyo () {
  this.preload = Infinity
  this.extent = transformE([138.82294073937393, 35.30093068425302,140.05279928682307, 36.0421907297518])
  this.dep = MaskDep.tokyo
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/13tokyo/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu13tokyoObj = {}
for (let i of mapsStr) {
  kotizu13tokyoObj[i] = new TileLayer(new Kotizu13tokyo())
  const dep = kotizu13tokyoObj[i].values_.dep
  mask(dep,kotizu13tokyoObj[i])
}
const kotizu13tokyoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/13tokyo.jpg" target="_blank">jpg</a>'
// 14神奈川県古地図-------------------------------------------------------------------------------
function Kotizu14kanagawa () {
  this.preload = Infinity
  this.extent = transformE([138.83819963744648, 35.0314965123706,140.05585111639266, 35.7975195233328])
  this.dep = MaskDep.kanagawa
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/14kanagawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu14kanagawaObj = {}
for (let i of mapsStr) {
  kotizu14kanagawaObj[i] = new TileLayer(new Kotizu14kanagawa())
  const dep = kotizu14kanagawaObj[i].values_.dep
  mask(dep,kotizu14kanagawaObj[i])
}
const kotizu14kanagawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/14kanagawaken.jpg" target="_blank">jpg</a>'
// 15新潟県古地図-------------------------------------------------------------------------------
function Kotizu15niigata () {
  this.preload = Infinity
  this.extent = transformE([137.0758093644289, 36.14674733860816,140.71960875134744, 39.0997531252250]);
  this.dep = MaskDep.niigata
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/15niigataken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu15niigataObj = {}
for (let i of mapsStr) {
  kotizu15niigataObj[i] = new TileLayer(new Kotizu15niigata())
  const dep = kotizu15niigataObj[i].values_.dep
  mask(dep,kotizu15niigataObj[i])
}
const kotizu15niigataSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/15niigataken.jpg" target="_blank">jpg</a>'
// 16富山県古地図-------------------------------------------------------------------------------
function Kotizu16toyama () {
  this.preload = Infinity
  this.extent = transformE([136.41205200872534, 36.13097429396195,137.95929333142155, 37.2031100807304]);
  this.dep = MaskDep.toyama
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/16toyamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu16toyamaObj = {}
for (let i of mapsStr) {
  kotizu16toyamaObj[i] = new TileLayer(new Kotizu16toyama())
  const dep = kotizu16toyamaObj[i].values_.dep
  mask(dep,kotizu16toyamaObj[i])
}
const kotizu16toyamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/16toyamaken.jpg" target="_blank">jpg</a>'
// 17石川県古地図-------------------------------------------------------------------------------
function Kotizu17isikawa () {
  this.preload = Infinity
  this.extent = transformE([136.04278934906503, 35.9533069414312,137.7151526210018, 37.68527021748923]);
  this.dep = MaskDep.isikawa
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/17isikawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu17isikawaObj = {}
for (let i of mapsStr) {
  kotizu17isikawaObj[i] = new TileLayer(new Kotizu17isikawa())
  const dep = kotizu17isikawaObj[i].values_.dep
  mask(dep,kotizu17isikawaObj[i])
}
const kotizu17isikawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/17isikawaken.jpg" target="_blank">jpg</a>'
// 18福井県古地図-------------------------------------------------------------------------------
function Kotizu18fukuii () {
  this.preload = Infinity
  this.extent = transformE([135.17456465674059, 35.2416321191818,137.07886130822314, 36.4782335734440]);
  this.dep = MaskDep.fukui
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/18fukuiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu18fukuiiObj = {}
for (let i of mapsStr) {
  kotizu18fukuiiObj[i] = new TileLayer(new Kotizu18fukuii())
  const dep = kotizu18fukuiiObj[i].values_.dep
  mask(dep,kotizu18fukuiiObj[i])
}
const kotizu18fukuiiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/18fukuiken.jpg" target="_blank">jpg</a>'
// 19山梨県古地図-------------------------------------------------------------------------------
function Kotizu19yamanasi () {
  this.preload = Infinity
  this.extent = transformE([138.03558732341338, 35.11391818719886,139.4638098120253, 36.0594620601866])
  this.dep = MaskDep.yamanasi
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/19yamanasiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu19yamanasiObj = {}
for (let i of mapsStr) {
  kotizu19yamanasiObj[i] = new TileLayer(new Kotizu19yamanasi())
  const dep = kotizu19yamanasiObj[i].values_.dep
  mask(dep,kotizu19yamanasiObj[i])
}
const kotizu19yamanasiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/19yamanasiken.jpg" target="_blank">jpg</a>'
// 20長野県古地図-------------------------------------------------------------------------------
function Kotizu20nagano () {
  this.preload = Infinity
  this.extent = transformE([137.1063270425094, 35.039992106599726,139.2608680953873, 37.28182417551734])
  this.dep = MaskDep.nagano
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/20naganoken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu20naganoObj = {}
for (let i of mapsStr) {
  kotizu20naganoObj[i] = new TileLayer(new Kotizu20nagano())
  const dep = kotizu20naganoObj[i].values_.dep
  mask(dep,kotizu20naganoObj[i])
}
const kotizu20naganoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/20naganoken.jpg" target="_blank">jpg</a>'
// 21岐阜県古地図-------------------------------------------------------------------------------
function Kotizu21gihu () {
  this.preload = Infinity
  this.extent = transformE([136.07330690248412, 34.96399858992143,137.95929328648847, 36.712957336663806])
  this.dep = MaskDep.gihu
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu2/tile/21gihuken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu21gihuObj = {}
for (let i of mapsStr) {
  kotizu21gihuObj[i] = new TileLayer(new Kotizu21gihu())
  const dep = kotizu21gihuObj[i].values_.dep
  mask(dep,kotizu21gihuObj[i])
}
const kotizu21gihuSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu2/image/21gihuken.jpg" target="_blank">jpg</a>'
// 22静岡県古地図-------------------------------------------------------------------------------
function Kotizu22sizuoka () {
  this.preload = Infinity
  this.extent = transformE([137.18109503768795, 34.49498828796092,139.40582648300045, 35.802469846963874])
  this.dep = MaskDep.sizuoka
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/22sizuokaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu22sizuokaObj = {}
for (let i of mapsStr) {
  kotizu22sizuokaObj[i] = new TileLayer(new Kotizu22sizuoka())
  const dep = kotizu22sizuokaObj[i].values_.dep
  mask(dep,kotizu22sizuokaObj[i])
}
const kotizu22sizuokaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/22sizuokaken.jpg" target="_blank">jpg</a>'
// 23愛知県古地図-------------------------------------------------------------------------------
function Kotizu23aichi () {
  this.preload = Infinity
  this.extent = transformE([136.28692998417054, 34.54276315991859,137.90436161548232, 35.5371938249228])
  this.dep = MaskDep.aichi
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/23aichiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu23aichiObj = {}
for (let i of mapsStr) {
  kotizu23aichiObj[i] = new TileLayer(new Kotizu23aichi())
  const dep = kotizu23aichiObj[i].values_.dep
  mask(dep,kotizu23aichiObj[i])
}
const kotizu23aichiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/23aichiken.jpg" target="_blank">jpg</a>'
// 24三重県古地図-------------------------------------------------------------------------------
function Kotizu24mieken () {
  this.preload = Infinity
  this.extent = transformE([135.55755979081184, 33.668481789114,137.21161279527038, 35.41790535710936])
  this.dep = MaskDep.mie
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/24mieken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu24miekenObj = {}
for (let i of mapsStr) {
  kotizu24miekenObj[i] = new TileLayer(new Kotizu24mieken())
  const dep = kotizu24miekenObj[i].values_.dep
  mask(dep,kotizu24miekenObj[i])
}
const kotizu24miekenSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/24mieken.jpg" target="_blank">jpg</a>'
// 25滋賀県古地図-------------------------------------------------------------------------------
function Kotizu25sigaken () {
  this.preload = Infinity
  this.extent = transformE([135.6308020908143, 34.77370586704984,136.64398559143208, 35.76038208455544])
  this.dep = MaskDep.siga
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/25sigaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu25sigakenObj = {}
for (let i of mapsStr) {
  kotizu25sigakenObj[i] = new TileLayer(new Kotizu25sigaken())
  const dep = kotizu25sigakenObj[i].values_.dep
  mask(dep,kotizu25sigakenObj[i])
}
const kotizu25sigakenSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/25sigaken.jpg" target="_blank">jpg</a>'
// 26京都府古地図-------------------------------------------------------------------------------
function Kotizu26kyoutohu () {
  this.preload = Infinity
  this.extent = transformE([134.666446509287, 34.50504839149191,136.17096309222305, 36.0865950828696])
  this.dep = MaskDep.kyouto
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/26kyoutohu/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu26kyoutohuObj = {}
for (let i of mapsStr) {
  kotizu26kyoutohuObj[i] = new TileLayer(new Kotizu26kyoutohu())
  const dep = kotizu26kyoutohuObj[i].values_.dep
  mask(dep,kotizu26kyoutohuObj[i])
}
const kotizu26kyoutohuSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/26kyoutohu.jpg" target="_blank">jpg</a>'
// 27大阪府古地図-------------------------------------------------------------------------------
function Kotizu27osaka () {
  this.preload = Infinity
  this.extent = transformE([134.89227668426307, 34.16232390373379,135.85968392945202, 35.12889509173576])
  this.dep = MaskDep.osaka
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/27osaka/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu27osakaObj = {}
for (let i of mapsStr) {
  kotizu27osakaObj[i] = new TileLayer(new Kotizu27osaka())
  const dep = kotizu27osakaObj[i].values_.dep
  mask(dep,kotizu27osakaObj[i])
}
const kotizu27osakaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/27osaka.jpg" target="_blank">jpg</a>'
// 28兵庫県古地図-------------------------------------------------------------------------------
function Kotizu28hyogo () {
  this.preload = Infinity
  this.extent = transformE([134.0530432033324, 34.08147963860071,135.71625142534907, 35.84700903949149]);
  this.dep = MaskDep.hyogo
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/28hyogoken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu28hyogoObj = {}
for (let i of mapsStr) {
  kotizu28hyogoObj[i] = new TileLayer(new Kotizu28hyogo())
  const dep = kotizu28hyogoObj[i].values_.dep
  mask(dep,kotizu28hyogoObj[i])
}
const kotizu28hyogoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/28hyogoken.jpg" target="_blank">jpg</a>'
// 29奈良県古地図-------------------------------------------------------------------------------
function Kotizu29nara () {
  this.preload = Infinity
  this.extent = transformE([135.3622472647639, 33.800452639216985,136.30218885727842, 34.82382560320653])
  this.dep = MaskDep.nara
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/29naraken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu29naraObj = {}
for (let i of mapsStr) {
  kotizu29naraObj[i] = new TileLayer(new Kotizu29nara())
  const dep = kotizu29naraObj[i].values_.dep
  mask(dep,kotizu29naraObj[i])
}
const kotizu29naraSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/29naraken.jpg" target="_blank">jpg</a>'
// 30和歌山県古地図-------------------------------------------------------------------------------
function Kotizu30wakayama () {
  this.preload = Infinity
  this.extent = transformE([134.88006961357738, 33.28666157470339,136.13129027944944, 34.57794810432477])
  this.dep = MaskDep.wakayama
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/30wakayamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu30wakayamaObj = {}
for (let i of mapsStr) {
  kotizu30wakayamaObj[i] = new TileLayer(new Kotizu30wakayama())
  const dep = kotizu30wakayamaObj[i].values_.dep
  mask(dep,kotizu30wakayamaObj[i])
}
const kotizu30wakayamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/30wakayamaken.jpg" target="_blank">jpg</a>'
// 31鳥取県古地図-------------------------------------------------------------------------------
function Kotizu31tottori () {
  this.preload = Infinity
  this.extent = transformE([132.87201291366142, 34.6884324206926,134.9166908529274, 36.09399334219408]);
  this.dep = MaskDep.tottori
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/31tottoriken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu31tottoriObj = {}
for (let i of mapsStr) {
  kotizu31tottoriObj[i] = new TileLayer(new Kotizu31tottori())
  const dep = kotizu31tottoriObj[i].values_.dep
  mask(dep,kotizu31tottoriObj[i])
}
const kotizu31tottoriSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/31tottoriken.jpg" target="_blank">jpg</a>'
// 32島根県古地図-------------------------------------------------------------------------------
function Kotizu32shimane () {
  this.preload = Infinity
  this.extent = transformE([131.10504508513685, 33.96006826212876,133.78143672104184, 36.07672962939766])
  this.dep = MaskDep.shimane
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/32shimaneken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu32shimaneObj = {}
for (let i of mapsStr) {
  kotizu32shimaneObj[i] = new TileLayer(new Kotizu32shimane())
  const dep = kotizu32shimaneObj[i].values_.dep
  mask(dep,kotizu32shimaneObj[i])
}
const kotizu32shimaneSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/32shimaneken.jpg" target="_blank">jpg</a>'
// 33岡山県古地図-------------------------------------------------------------------------------
function Kotizu33okayama () {
  this.preload = Infinity
  this.extent = transformE([133.12836056797116, 34.07389642661967,134.5626867584726, 35.49745065211569])
  this.dep = MaskDep.okayama
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/33okayamaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu33okayamaObj = {}
for (let i of mapsStr) {
  kotizu33okayamaObj[i] = new TileLayer(new Kotizu33okayama())
  const dep = kotizu33okayamaObj[i].values_.dep
  mask(dep,kotizu33okayamaObj[i])
}
const kotizu33okayamaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/33okayamaken.jpg" target="_blank">jpg</a>'
// 34広島県古地図-------------------------------------------------------------------------------
function Kotizu34hiroshima () {
  this.preload = Infinity
  this.extent = transformE([131.67267205452762, 33.77508941185097,133.9584387585356, 35.363172325219395])
  this.dep = MaskDep.hiroshima
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/34hiroshimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu34hiroshimaObj = {}
for (let i of mapsStr) {
  kotizu34hiroshimaObj[i] = new TileLayer(new Kotizu34hiroshima())
  const dep = kotizu34hiroshimaObj[i].values_.dep
  mask(dep,kotizu34hiroshimaObj[i])
}
const kotizu34hiroshimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/34hiroshimaken.jpg" target="_blank">jpg</a>'
// 35山口県古地図-------------------------------------------------------------------------------
function Kotizu35yamaguchi () {
  this.preload = Infinity
  this.extent = transformE([130.48858997221657, 33.62275225666322,132.73468370359012, 34.97400177667768])
  this.dep = MaskDep.yamaguchi
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/35yamaguchiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu35yamaguchiObj = {}
for (let i of mapsStr) {
  kotizu35yamaguchiObj[i] = new TileLayer(new Kotizu35yamaguchi())
  const dep = kotizu35yamaguchiObj[i].values_.dep
  mask(dep,kotizu35yamaguchiObj[i])
}
const kotizu35yamaguchiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/35yamagutiken.jpg" target="_blank">jpg</a>'
// 36徳島県古地図-------------------------------------------------------------------------------
function Kotizu36tokusima () {
  this.preload = Infinity
  this.extent = transformE([133.56171013343172, 33.4752365140107,134.95025990086629, 34.4018746044325])
  this.dep = MaskDep.tokusima
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/36tokusimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu36tokusimaObj = {}
for (let i of mapsStr) {
  kotizu36tokusimaObj[i] = new TileLayer(new Kotizu36tokusima())
  const dep = kotizu36tokusimaObj[i].values_.dep
  mask(dep,kotizu36tokusimaObj[i])
}
const kotizu36tokusimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/36tokusimaken.jpg" target="_blank">jpg</a>'
// 37香川県古地図-------------------------------------------------------------------------------
function Kotizu37kagawa () {
  this.preload = Infinity
  this.extent = transformE([133.39386355863118, 33.93222049322577,134.59320443482304, 34.72355570107369])
  this.dep = MaskDep.kagawa
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/37kagawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu37kagawaObj = {}
for (let i of mapsStr) {
  kotizu37kagawaObj[i] = new TileLayer(new Kotizu37kagawa())
  const dep = kotizu37kagawaObj[i].values_.dep
  mask(dep,kotizu37kagawaObj[i])
}
const kotizu37kagawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/37kagawaken.jpg" target="_blank">jpg</a>'
// 38愛媛県古地図-------------------------------------------------------------------------------
function Kotizu38ehime () {
  this.preload = Infinity
  this.extent = transformE([131.52008412875165, 32.48968656547299,134.25445930602635, 34.82382560341891])
  this.dep = MaskDep.ehime
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/38ehimeken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu38ehimeObj = {}
for (let i of mapsStr) {
  kotizu38ehimeObj[i] = new TileLayer(new Kotizu38ehime())
  const dep = kotizu38ehimeObj[i].values_.dep
  mask(dep,kotizu38ehimeObj[i])
}
const kotizu38ehimeSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/38ehimeken.jpg" target="_blank">jpg</a>'
// 39高知県古地図-------------------------------------------------------------------------------
function Kotizu39kochi () {
  this.preload = Infinity
  this.extent = transformE([132.22809198188384, 32.58744998236202,134.50775506782134, 34.0460859519771])
  this.dep = MaskDep.kochi
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/39kochiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu39kochiObj = {}
for (let i of mapsStr) {
  kotizu39kochiObj[i] = new TileLayer(new Kotizu39kochi())
  const dep = kotizu39kochiObj[i].values_.dep
  mask(dep,kotizu39kochiObj[i])
}
const kotizu39kochiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/39kochiken.jpg" target="_blank">jpg</a>'
// 40福岡県古地図-------------------------------------------------------------------------------
function Kotizu40fukuoka () {
  this.preload = Infinity
  this.extent = transformE([129.91791120950657, 32.79291937264675,131.31256467883068, 34.311177873747454])
  this.dep = MaskDep.fukuoka
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/40fukuokaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu40fukuokaObj = {}
for (let i of mapsStr) {
  kotizu40fukuokaObj[i] = new TileLayer(new Kotizu40fukuoka())
  const dep = kotizu40fukuokaObj[i].values_.dep
  mask(dep,kotizu40fukuokaObj[i])
}
const kotizu40fukuokaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/40fukuokaken.jpg" target="_blank">jpg</a>'
// 41佐賀県古地図-------------------------------------------------------------------------------
function Kotizu41saga () {
  this.preload = Infinity
  this.extent = transformE([129.62189076189054, 32.89803887690721,130.87005974445592, 33.68625888712265])
  this.dep = MaskDep.saga
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/41sagaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu41sagaObj = {}
for (let i of mapsStr) {
  kotizu41sagaObj[i] = new TileLayer(new Kotizu41saga())
  const dep = kotizu41sagaObj[i].values_.dep
  mask(dep,kotizu41sagaObj[i])
}
const kotizu41sagaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/41sagaken.jpg" target="_blank">jpg</a>'
// 42長崎県古地図-------------------------------------------------------------------------------
function Kotizu42nagasaki () {
  this.preload = Infinity
  this.extent = transformE([128.26996196165274, 32.47681505638525,130.68085078253935, 33.99549789518811])
  this.dep = MaskDep.nagasaki
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/42nagasakiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu42nagasakiObj = {}
for (let i of mapsStr) {
  kotizu42nagasakiObj[i] = new TileLayer(new Kotizu42nagasaki())
  const dep = kotizu42nagasakiObj[i].values_.dep
  mask(dep,kotizu42nagasakiObj[i])
}
const kotizu42nagasakiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/42nagasakiken.jpg" target="_blank">jpg</a>'
// 43熊本県古地図-------------------------------------------------------------------------------
function Kotizu43kumamoto () {
  this.preload = Infinity
  this.extent = transformE([129.99725691618875, 32.0225671681847,131.37970331700993, 33.51595568942747])
  this.dep = MaskDep.kumamoto
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/43kumamotoken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu43kumamotoObj = {}
for (let i of mapsStr) {
  kotizu43kumamotoObj[i] = new TileLayer(new Kotizu43kumamoto())
  const dep = kotizu43kumamotoObj[i].values_.dep
  mask(dep,kotizu43kumamotoObj[i])
}
const kotizu43kumamotoSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/43kumamotoken.jpg" target="_blank">jpg</a>'
// 44大分県古地図-------------------------------------------------------------------------------
function Kotizu44oita () {
  this.preload = Infinity
  this.extent = transformE([130.71747183513978, 32.71335609592143,132.48749157128074, 33.86636200310696])
  this.dep = MaskDep.oita
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/44oitaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu44oitaObj = {}
for (let i of mapsStr) {
  kotizu44oitaObj[i] = new TileLayer(new Kotizu44oita())
  const dep = kotizu44oitaObj[i].values_.dep
  mask(dep,kotizu44oitaObj[i])
}
const kotizu44oitaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/44oitaken.jpg" target="_blank">jpg</a>'
// 45宮崎県古地図-------------------------------------------------------------------------------
function Kotizu45miyazaki () {
  this.preload = Infinity
  this.extent = transformE([130.46417593144741, 31.2717699691664,132.07855579563346, 32.99279597868028])
  this.dep = MaskDep.miyazaki
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/45miyazakiken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu45miyazakiObj = {}
for (let i of mapsStr) {
  kotizu45miyazakiObj[i] = new TileLayer(new Kotizu45miyazaki())
  const dep = kotizu45miyazakiObj[i].values_.dep
  mask(dep,kotizu45miyazakiObj[i])
}
const kotizu45miyazakiSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/45miyazakiken.jpg" target="_blank">jpg</a>'
// 46鹿児島県古地図-------------------------------------------------------------------------------
function Kotizu46kagoshima () {
  this.preload = Infinity
  this.extent = transformE([129.98199816146874, 30.87446474904796,131.33087504008793, 32.366043938734606])
  this.dep = MaskDep.kagoshima
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/46kagoshimaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu46kagoshimaObj = {}
for (let i of mapsStr) {
  kotizu46kagoshimaObj[i] = new TileLayer(new Kotizu46kagoshima())
  const dep = kotizu46kagoshimaObj[i].values_.dep
  mask(dep,kotizu46kagoshimaObj[i])
}
const kotizu46kagoshimaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/46kagoshimaken.jpg" target="_blank">jpg</a>'
// 47沖縄県県古地図-------------------------------------------------------------------------------
function Kotizu47okinawa () {
  this.preload = Infinity
  this.extent = transformE([126.3076817147321, 25.88283898762164,128.71246700136726, 27.431915559934936])
  this.dep = MaskDep.okinawa
  this.source = new XYZ({
    url: 'https://kenzkenz.github.io/bunkenzu/tile/47okinawaken/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 13
  })
}
const kotizu47okinawaObj = {}
for (let i of mapsStr) {
  kotizu47okinawaObj[i] = new TileLayer(new Kotizu47okinawa())
  const dep = kotizu47okinawaObj[i].values_.dep
  mask(dep,kotizu47okinawaObj[i])
}
const kotizu47okinawaSumm = SSK + '<br><a href="https://kenzkenz.github.io/bunkenzu/image/47okinawaken.jpg" target="_blank">jpg</a>'
// 古地図全部を一つのレイヤーに-------------------------------------------------------------------------------
const kotizu00Obj = {}
for (let i of mapsStr) {
  kotizu00Obj[i] = new LayerGroup({
    layers: [
      kotizu01hokkaidouObj[i],
      kotizu01aomoriObj[i],
      kotizu03iwateObj[i],
      kotizu04miyagiObj[i],
      kotizu05akitaObj[i],
      kotizu06yamagataObj[i],
      kotizu07hukusimaObj[i],
      kotizu08ibarakiObj[i],
      kotizu09tochigiObj[i],
      kotizu10gunmaObj[i],
      kotizu11saitamaObj[i],
      kotizu12chibakenObj[i],
      kotizu13tokyoObj[i],
      kotizu14kanagawaObj[i],
      kotizu15niigataObj[i],
      kotizu16toyamaObj[i],
      kotizu17isikawaObj[i],
      kotizu18fukuiiObj[i],
      kotizu19yamanasiObj[i],
      kotizu20naganoObj[i],
      kotizu21gihuObj[i],
      kotizu22sizuokaObj[i],
      kotizu23aichiObj[i],
      kotizu24miekenObj[i],
      kotizu25sigakenObj[i],
      kotizu26kyoutohuObj[i],
      kotizu27osakaObj[i],
      kotizu28hyogoObj[i],
      kotizu29naraObj[i],
      kotizu30wakayamaObj[i],
      kotizu31tottoriObj[i],
      kotizu32shimaneObj[i],
      kotizu33okayamaObj[i],
      kotizu34hiroshimaObj[i],
      kotizu35yamaguchiObj[i],
      kotizu36tokusimaObj[i],
      kotizu37kagawaObj[i],
      kotizu38ehimeObj[i],
      kotizu39kochiObj[i],
      kotizu40fukuokaObj[i],
      kotizu41sagaObj[i],
      kotizu42nagasakiObj[i],
      kotizu43kumamotoObj[i],
      kotizu44oitaObj[i],
      kotizu45miyazakiObj[i],
      kotizu46kagoshimaObj[i],
      kotizu47okinawaObj[i]
    ]
  })
}
for (let i of mapsStr) {
  kotizu00Obj[i].values_['dep'] = true
}
const kotizu00Summ = SSK
// 洪水浸水想定（想定最大規模）-------------------------------------------------------------------------------
function Shinsuishin () {
  this.name = 'shinsuishin'

  // this.className = 'shinsuishin'

  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const shinsuishinObj = {};
for (let i of mapsStr) {
  shinsuishinObj[i] = new TileLayer(new Shinsuishin())
}
const shinsuishinSumm = '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br> <img src="https://kenzkenz.xsrv.jp/open-hinata/img/shinsui_legend2-1.png">';
// 洪水浸水想定（計画規模）-------------------------------------------------------------------------------
function ShinsuishinK () {
  this.name = 'shinsuishinK'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_kuni_data/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const shinsuishinKObj = {};
for (let i of mapsStr) {
  shinsuishinKObj[i] = new TileLayer(new ShinsuishinK())
}
const shinsuishinKSumm = '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br> <img src="https://kenzkenz.xsrv.jp/open-hinata/img/shinsui_legend2-1.png">';
// 津波浸水想定-------------------------------------------------------------------------------
function Tsunami () {
  this.name = 'tunami'


  // this.className = 'Tsunami'

  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png',
    // url: 'https://disaportaldata.gsi.go.jp/raster/04_tsunami_oldlegend/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const tsunamiObj = {};
for (let i of mapsStr) {
  tsunamiObj[i] = new TileLayer(new Tsunami())
}
const tunamiSumm =  '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><img src="https://kenzkenz.xsrv.jp/open-hinata/img/tsunami_newlegend.png">';
// 浸水継続-------------------------------------------------------------------------------
function Keizoku () {
  this.name = 'keizoku'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_keizoku_kuni_data/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const keizokuObj = {};
for (let i of mapsStr) {
  keizokuObj[i] = new TileLayer(new Keizoku())
}
const keizokuSumm =  '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><img src="https://kenzkenz.xsrv.jp/open-hinata/img/shinsui_legend_l2_keizoku.png">';
// 高潮-------------------------------------------------------------------------------
function Takasio () {
  this.name = 'takasio'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const takasioObj = {};
for (let i of mapsStr) {
  takasioObj[i] = new TileLayer(new Takasio())
}
const takasioSumm =  '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><img src="https://kenzkenz.xsrv.jp/open-hinata/img/tsunami_newlegend.png">';
//ため池-------------------------------------------------------------------------------------------------
function Tameike () {
  this.name = 'tameike'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportal.gsi.go.jp/data/raster/07_tameike/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const tameikeObj = {};
for (let i of mapsStr) {
  tameikeObj[i] = new TileLayer(new Tameike())
}
const tameikeSumm = '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>';
//家屋倒壊等氾濫想定区域（氾濫流）-------------------------------------------------------------------------------------------------
function Toukai () {
  this.name = 'toukai'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_kaokutoukai_hanran_data/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 4,
    maxZoom: 17
  })
}
const toukaiObj = {};
for (let i of mapsStr) {
  toukaiObj[i] = new TileLayer(new Toukai())
}
const toukaiSumm = '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br>洪水時に家屋が流出・倒壊等のおそれがある範囲です。';
// 土砂災害警戒区域（土石流-------------------------------------------------------------------------------
function Dosya () {
  this.name = 'dosya'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const dosyaObj = {};
for (let i of mapsStr) {
  dosyaObj[i] = new TileLayer(new Dosya())
}
const dosyaSumm =  '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><a href="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_keikai.png" target="_blank" ><img width="600" src="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_keikai.png"></a>  ';
// 土石流危険渓流-------------------------------------------------------------------------------
function Doseki () {
  this.name = 'doseki'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukikenkeiryu/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const dosekiObj = {};
for (let i of mapsStr) {
  dosekiObj[i] = new TileLayer(new Doseki())
}
const dosekiSumm =   '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><img width="300" src="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_kiken.png">';
// 急傾斜地崩壊危険箇所-------------------------------------------------------------------------------
function Kyuukeisya () {
  this.name = 'kyuukeisya'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/05_kyukeisyachihoukai/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const kyuukeisyaObj = {};
for (let i of mapsStr) {
  kyuukeisyaObj[i] = new TileLayer(new Kyuukeisya())
}
const kyuukeisyaSumm =   '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><img width="300" src="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_kiken.png">';
// 地すべり危険箇所-------------------------------------------------------------------------------
function Zisuberi () {
  this.name = 'zisuberi'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/05_jisuberikikenkasyo/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const zisuberiObj = {};
for (let i of mapsStr) {
  zisuberiObj[i] = new TileLayer(new Zisuberi())
}
const zisuberiSumm =   '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><img width="300" src="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_kiken.png">';
// 雪崩危険箇所-------------------------------------------------------------------------------
function Nadare () {
  this.name = 'nadare'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/05_nadarekikenkasyo/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const nadareObj = {};
for (let i of mapsStr) {
  nadareObj[i] = new TileLayer(new Nadare())
}
const nadareSumm =   '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a><br><img width="300" src="https://kenzkenz.xsrv.jp/open-hinata/img/dosha_kiken.png">';
//----------------------------------------------------------------------------
const dosyaSaigaiObj = {};
for (let i of mapsStr) {
  dosyaSaigaiObj[i] = new LayerGroup({
    layers: [
      nadareObj[i],
      zisuberiObj[i],
      kyuukeisyaObj[i],
      dosekiObj[i],
      dosyaObj[i],
      ]
  })
}
for (let i of mapsStr) {
  dosyaSaigaiObj[i].values_['name'] = 'dosyaSaigai'
  dosyaSaigaiObj[i].values_['pointer'] = true
}
const dosyaSaigaiSumm = '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>';
// 大規模盛土造成地-------------------------------------------------------------------------------
function Morido () {
  this.name = 'morido'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportaldata.gsi.go.jp/raster/daikiboumoritsuzouseichi/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 16
  })
}
const moridoObj = {};
for (let i of mapsStr) {
  moridoObj[i] = new TileLayer(new Morido())
}
const moridoSumm =   '出典：<br><a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>';
// 地形区分に基づく液状化の発生傾向図-------------------------------------------------------------------------------
function Ekizyouka () {
  this.name = 'ekizyouka'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://disaportal.gsi.go.jp/raster/08_03_ekijoka_zenkoku/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 15
  })
}
const ekizyoukaObj = {};
for (let i of mapsStr) {
  ekizyoukaObj[i] = new TileLayer(new Ekizyouka())
}
const ekizyouka0Summ =   '<div style=width:300px;font-size:smaller>これまでの地震において発生した液状化被害を地形区分ごとに集計し、全国を対象におよそ250m四方のメッシュごとに液状化の発生傾向の強弱を5段階で表したもの' +
                         '<br>出典：<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">ハザードマップポータルサイト</a>' +
                         '<br> <img src="https://kenzkenz.xsrv.jp/open-hinata/img/ekijouka_legend.jpg" width="300px">' +
                         '<br><a href="https://www.mlit.go.jp/toshi/content/001388130.pdf" target="_blank">詳しい凡例</a>' +
                         '<br>本図は、地形が示す一般的な地盤特性に対応した相対的な液状化の発生傾向の強弱を表したものであり、特定の地震に対する液状化予測を示したものではありません。また、メッシュデータであることからメッシュの代表的な地形に対応した液状化発生傾向を示しており、個別の宅地に対応した液状化発生傾向を示したものではありません。' +
                         '<br><a href="https://www.mlit.go.jp/toshi/toshi_tobou_tk_000038.html" target="_blank">詳しい解説</a></div>';


// 今昔マップ-----------------------------------------------------------------------------------
// 首都圏
function Kz_tokyo502man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo502manObj = {};
for (let i of mapsStr) {
  kz_tokyo502manObj[i] = new TileLayer(new Kz_tokyo502man())
}
function Kz_tokyo5000 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5000Obj = {};
for (let i of mapsStr) {
  kz_tokyo5000Obj[i] = new TileLayer(new Kz_tokyo5000())
}
function Kz_tokyo5001 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5001Obj = {};
for (let i of mapsStr) {
  kz_tokyo5001Obj[i] = new TileLayer(new Kz_tokyo5001())
}
function Kz_tokyo5002 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5002Obj = {};
for (let i of mapsStr) {
  kz_tokyo5002Obj[i] = new TileLayer(new Kz_tokyo5002())
}
function Kz_tokyo5003 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5003Obj = {};
for (let i of mapsStr) {
  kz_tokyo5003Obj[i] = new TileLayer(new Kz_tokyo5003())
}
function Kz_tokyo5004 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5004Obj = {};
for (let i of mapsStr) {
  kz_tokyo5004Obj[i] = new TileLayer(new Kz_tokyo5004())
}
function Kz_tokyo5005 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5005Obj = {};
for (let i of mapsStr) {
  kz_tokyo5005Obj[i] = new TileLayer(new Kz_tokyo5005())
}
function Kz_tokyo5006 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/06/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5006Obj = {};
for (let i of mapsStr) {
  kz_tokyo5006Obj[i] = new TileLayer(new Kz_tokyo5006())
}
function Kz_tokyo5007 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokyo50/07/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.2055, 36.03780, 140.3430, 35.21344])
}
const kz_tokyo5007Obj = {};
for (let i of mapsStr) {
  kz_tokyo5007Obj[i] = new TileLayer(new Kz_tokyo5007())
}

// 中京圏
function Kz_chukyo2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo2manObj = {};
for (let i of mapsStr) {
  kz_chukyo2manObj[i] = new TileLayer(new Kz_chukyo2man())
}
function Kz_chukyo00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo00Obj = {};
for (let i of mapsStr) {
  kz_chukyo00Obj[i] = new TileLayer(new Kz_chukyo00())
}
function Kz_chukyo01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo01Obj = {};
for (let i of mapsStr) {
  kz_chukyo01Obj[i] = new TileLayer(new Kz_chukyo01())
}
function Kz_chukyo02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo02Obj = {};
for (let i of mapsStr) {
  kz_chukyo02Obj[i] = new TileLayer(new Kz_chukyo02())
}
function Kz_chukyo03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo03Obj = {};
for (let i of mapsStr) {
  kz_chukyo03Obj[i] = new TileLayer(new Kz_chukyo03())
}
function Kz_chukyo04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo04Obj = {};
for (let i of mapsStr) {
  kz_chukyo04Obj[i] = new TileLayer(new Kz_chukyo04())
}
function Kz_chukyo05 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo05Obj = {};
for (let i of mapsStr) {
  kz_chukyo05Obj[i] = new TileLayer(new Kz_chukyo05())
}
function Kz_chukyo06 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/06/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo06Obj = {};
for (let i of mapsStr) {
  kz_chukyo06Obj[i] = new TileLayer(new Kz_chukyo06())
}
function Kz_chukyo07 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/07/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo07Obj = {};
for (let i of mapsStr) {
  kz_chukyo07Obj[i] = new TileLayer(new Kz_chukyo07())
}
function Kz_chukyo08 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/chukyo/08/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.4403, 35.51756, 137.2780, 34.80693])
}
const kz_chukyo08Obj = {};
for (let i of mapsStr) {
  kz_chukyo08Obj[i] = new TileLayer(new Kz_chukyo08())
}

// 京阪神圏
function Kz_keihansin2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin2manObj = {};
for (let i of mapsStr) {
  kz_keihansin2manObj[i] = new TileLayer(new Kz_keihansin2man())
}
function Kz_keihansin00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin00Obj = {};
for (let i of mapsStr) {
  kz_keihansin00Obj[i] = new TileLayer(new Kz_keihansin00())
}
function Kz_keihansin01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin01Obj = {};
for (let i of mapsStr) {
  kz_keihansin01Obj[i] = new TileLayer(new Kz_keihansin01())
}
function Kz_keihansin02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin02Obj = {};
for (let i of mapsStr) {
  kz_keihansin02Obj[i] = new TileLayer(new Kz_keihansin02())
}
function Kz_keihansin03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin03Obj = {};
for (let i of mapsStr) {
  kz_keihansin03Obj[i] = new TileLayer(new Kz_keihansin03())
}
function Kz_keihansin03x () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/03x/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin03xObj = {};
for (let i of mapsStr) {
  kz_keihansin03xObj[i] = new TileLayer(new Kz_keihansin03x())
}
function Kz_keihansin04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin04Obj = {};
for (let i of mapsStr) {
  kz_keihansin04Obj[i] = new TileLayer(new Kz_keihansin04())
}
function Kz_keihansin05 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin05Obj = {};
for (let i of mapsStr) {
  kz_keihansin05Obj[i] = new TileLayer(new Kz_keihansin05())
}
function Kz_keihansin06 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/06/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin06Obj = {};
for (let i of mapsStr) {
  kz_keihansin06Obj[i] = new TileLayer(new Kz_keihansin06())
}
function Kz_keihansin07 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/keihansin/07/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9547, 35.16172, 136.0506, 34.24785])
}
const kz_keihansin07Obj = {};
for (let i of mapsStr) {
  kz_keihansin07Obj[i] = new TileLayer(new Kz_keihansin07())
}

// 札幌
function Kz_sapporo00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.8138, 43.28177, 141.6423, 42.89743])
}
const kz_sapporo00Obj = {};
for (let i of mapsStr) {
  kz_sapporo00Obj[i] = new TileLayer(new Kz_sapporo00())
}
function Kz_sapporo01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.8138, 43.28177, 141.6423, 42.89743])
}
const kz_sapporo01Obj = {};
for (let i of mapsStr) {
  kz_sapporo01Obj[i] = new TileLayer(new Kz_sapporo01())
}
function Kz_sapporo02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.8138, 43.28177, 141.6423, 42.89743])
}
const kz_sapporo02Obj = {};
for (let i of mapsStr) {
  kz_sapporo02Obj[i] = new TileLayer(new Kz_sapporo02())
}
function Kz_sapporo03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.8138, 43.28177, 141.6423, 42.89743])
}
const kz_sapporo03Obj = {};
for (let i of mapsStr) {
  kz_sapporo03Obj[i] = new TileLayer(new Kz_sapporo03())
}
function Kz_sapporo04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sapporo/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.8138, 43.28177, 141.6423, 42.89743])
}
const kz_sapporo04Obj = {};
for (let i of mapsStr) {
  kz_sapporo04Obj[i] = new TileLayer(new Kz_sapporo04())
}

// 仙台
function Kz_sendai00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sendai/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.7323, 38.43329, 141.2941, 38.05300])
}
const kz_sendai00Obj = {};
for (let i of mapsStr) {
  kz_sendai00Obj[i] = new TileLayer(new Kz_sendai00())
}
function Kz_sendai01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sendai/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.7323, 38.43329, 141.2941, 38.05300])
}
const kz_sendai01Obj = {};
for (let i of mapsStr) {
  kz_sendai01Obj[i] = new TileLayer(new Kz_sendai01())
}
function Kz_sendai02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sendai/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.7323, 38.43329, 141.2941, 38.05300])
}
const kz_sendai02Obj = {};
for (let i of mapsStr) {
  kz_sendai02Obj[i] = new TileLayer(new Kz_sendai02())
}
function Kz_sendai03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sendai/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.7323, 38.43329, 141.2941, 38.05300])
}
const kz_sendai03Obj = {};
for (let i of mapsStr) {
  kz_sendai03Obj[i] = new TileLayer(new Kz_sendai03())
}
function Kz_sendai04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sendai/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.7323, 38.43329, 141.2941, 38.05300])
}
const kz_sendai04Obj = {};
for (let i of mapsStr) {
  kz_sendai04Obj[i] = new TileLayer(new Kz_sendai04())
}

// 東北地方太平洋岸
function Kz_tohoku_pacific_coast00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([140.52184, 40.76320, 142.4267, 36.67445])
}
const kz_tohoku_pacific_coast00Obj = {};
for (let i of mapsStr) {
  kz_tohoku_pacific_coast00Obj[i] = new TileLayer(new Kz_tohoku_pacific_coast00())
}
function Kz_tohoku_pacific_coast01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([140.52184, 40.76320, 142.4267, 36.67445])
}
const kz_tohoku_pacific_coast01Obj = {};
for (let i of mapsStr) {
  kz_tohoku_pacific_coast01Obj[i] = new TileLayer(new Kz_tohoku_pacific_coast01())
}
function Kz_tohoku_pacific_coast02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([140.52184, 40.76320, 142.4267, 36.67445])
}
const kz_tohoku_pacific_coast02Obj = {};
for (let i of mapsStr) {
  kz_tohoku_pacific_coast02Obj[i] = new TileLayer(new Kz_tohoku_pacific_coast02())
}
function Kz_tohoku_pacific_coast03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tohoku_pacific_coast/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([140.52184, 40.76320, 142.4267, 36.67445])
}
const kz_tohoku_pacific_coast03Obj = {};
for (let i of mapsStr) {
  kz_tohoku_pacific_coast03Obj[i] = new TileLayer(new Kz_tohoku_pacific_coast03())
}

// 姫路
function Kz_himeji2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/himeji/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.4642, 34.95249, 135.1670, 34.53810])
}
const kz_himeji2manObj = {};
for (let i of mapsStr) {
  kz_himeji2manObj[i] = new TileLayer(new Kz_himeji2man())
}
function Kz_himeji00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/himeji/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.4642, 34.95249, 135.1670, 34.53810])
}
const kz_himeji00Obj = {};
for (let i of mapsStr) {
  kz_himeji00Obj[i] = new TileLayer(new Kz_himeji00())
}
function Kz_himeji01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/himeji/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.4642, 34.95249, 135.1670, 34.53810])
}
const kz_himeji01Obj = {};
for (let i of mapsStr) {
  kz_himeji01Obj[i] = new TileLayer(new Kz_himeji01())
}
function Kz_himeji02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/himeji/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.4642, 34.95249, 135.1670, 34.53810])
}
const kz_himeji02Obj = {};
for (let i of mapsStr) {
  kz_himeji02Obj[i] = new TileLayer(new Kz_himeji02())
}
function Kz_himeji03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/himeji/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.4642, 34.95249, 135.1670, 34.53810])
}
const kz_himeji03Obj = {};
for (let i of mapsStr) {
  kz_himeji03Obj[i] = new TileLayer(new Kz_himeji03())
}

// 岡山・福山
function Kz_okayama2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okayama/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.9334, 34.78731, 134.2442, 34.27248])
}
const kz_okayama2manObj = {};
for (let i of mapsStr) {
  kz_okayama2manObj[i] = new TileLayer(new Kz_okayama2man())
}
function Kz_okayama00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okayama/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.9334, 34.78731, 134.2442, 34.27248])
}
const kz_okayama00Obj = {};
for (let i of mapsStr) {
  kz_okayama00Obj[i] = new TileLayer(new Kz_okayama00())
}
function Kz_okayama01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okayama/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.9334, 34.78731, 134.2442, 34.27248])
}
const kz_okayama01Obj = {};
for (let i of mapsStr) {
  kz_okayama01Obj[i] = new TileLayer(new Kz_okayama01())
}
function Kz_okayama02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okayama/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.9334, 34.78731, 134.2442, 34.27248])
}
const kz_okayama02Obj = {};
for (let i of mapsStr) {
  kz_okayama02Obj[i] = new TileLayer(new Kz_okayama02())
}
function Kz_okayama03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okayama/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.9334, 34.78731, 134.2442, 34.27248])
}
const kz_okayama03Obj = {};
for (let i of mapsStr) {
  kz_okayama03Obj[i] = new TileLayer(new Kz_okayama03())
}


// 浜松・豊橋
function Kz_hamamatsu2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.0838, 34.95158, 138.1734, 34.55129])
}
const kz_hamamatsu2manObj = {};
for (let i of mapsStr) {
  kz_hamamatsu2manObj[i] = new TileLayer(new Kz_hamamatsu2man())
}
function Kz_hamamatsu00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.0838, 34.95158, 138.1734, 34.55129])
}
const kz_hamamatsu00Obj = {};
for (let i of mapsStr) {
  kz_hamamatsu00Obj[i] = new TileLayer(new Kz_hamamatsu00())
}
function Kz_hamamatsu01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.0838, 34.95158, 138.1734, 34.55129])
}
const kz_hamamatsu01Obj = {};
for (let i of mapsStr) {
  kz_hamamatsu01Obj[i] = new TileLayer(new Kz_hamamatsu01())
}
function Kz_hamamatsu02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.0838, 34.95158, 138.1734, 34.55129])
}
const kz_hamamatsu02Obj = {};
for (let i of mapsStr) {
  kz_hamamatsu02Obj[i] = new TileLayer(new Kz_hamamatsu02())
}
function Kz_hamamatsu03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.0838, 34.95158, 138.1734, 34.55129])
}
const kz_hamamatsu03Obj = {};
for (let i of mapsStr) {
  kz_hamamatsu03Obj[i] = new TileLayer(new Kz_hamamatsu03())
}
function Kz_hamamatsu04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.0838, 34.95158, 138.1734, 34.55129])
}
const kz_hamamatsu04Obj = {};
for (let i of mapsStr) {
  kz_hamamatsu04Obj[i] = new TileLayer(new Kz_hamamatsu04())
}
function Kz_hamamatsu05 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hamamatsu/05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.0838, 34.95158, 138.1734, 34.55129])
}
const kz_hamamatsu05Obj = {};
for (let i of mapsStr) {
  kz_hamamatsu05Obj[i] = new TileLayer(new Kz_hamamatsu05())
}

// 広島
function Kz_hiroshima2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.0764, 34.63549, 133.0733, 34.06630])
}
const kz_hiroshima2manObj = {};
for (let i of mapsStr) {
  kz_hiroshima2manObj[i] = new TileLayer(new Kz_hiroshima2man())
}
function Kz_hiroshima00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.0764, 34.63549, 133.0733, 34.06630])
}
const kz_hiroshima00Obj = {};
for (let i of mapsStr) {
  kz_hiroshima00Obj[i] = new TileLayer(new Kz_hiroshima00())
}
function Kz_hiroshima01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.0764, 34.63549, 133.0733, 34.06630])
}
const kz_hiroshima01Obj = {};
for (let i of mapsStr) {
  kz_hiroshima01Obj[i] = new TileLayer(new Kz_hiroshima01())
}
function Kz_hiroshima02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.0764, 34.63549, 133.0733, 34.06630])
}
const kz_hiroshima02Obj = {};
for (let i of mapsStr) {
  kz_hiroshima02Obj[i] = new TileLayer(new Kz_hiroshima02())
}
function Kz_hiroshima03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.0764, 34.63549, 133.0733, 34.06630])
}
const kz_hiroshima03Obj = {};
for (let i of mapsStr) {
  kz_hiroshima03Obj[i] = new TileLayer(new Kz_hiroshima03())
}
function Kz_hiroshima04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hiroshima/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.0764, 34.63549, 133.0733, 34.06630])
}
const kz_hiroshima04Obj = {};
for (let i of mapsStr) {
  kz_hiroshima04Obj[i] = new TileLayer(new Kz_hiroshima04())
}

// 関東
function Kz_kanto00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanto/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([138.1383, 37.24556, 141.1668, 34.60537])
}
const kz_kanto00Obj = {};
for (let i of mapsStr) {
  kz_kanto00Obj[i] = new TileLayer(new Kz_kanto00())
}
function Kz_kanto01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanto/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([138.1383, 37.24556, 141.1668, 34.60537])
}
const kz_kanto01Obj = {};
for (let i of mapsStr) {
  kz_kanto01Obj[i] = new TileLayer(new Kz_kanto01())
}
function Kz_kanto02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanto/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([138.1383, 37.24556, 141.1668, 34.60537])
}
const kz_kanto02Obj = {};
for (let i of mapsStr) {
  kz_kanto02Obj[i] = new TileLayer(new Kz_kanto02())
}
function Kz_kanto03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanto/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 15
  })
  this.extent = transformE([138.1383, 37.24556, 141.1668, 34.60537])
}
const kz_kanto03Obj = {};
for (let i of mapsStr) {
  kz_kanto03Obj[i] = new TileLayer(new Kz_kanto03())
}

// 鹿児島
function Kz_kagoshima5man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/5man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.3444, 31.84601, 130.7926, 31.45388])
}
const kz_kagoshima5manObj = {};
for (let i of mapsStr) {
  kz_kagoshima5manObj[i] = new TileLayer(new Kz_kagoshima5man())
}
function Kz_kagoshima2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.3444, 31.84601, 130.7926, 31.45388])
}
const kz_kagoshima2manObj = {};
for (let i of mapsStr) {
  kz_kagoshima2manObj[i] = new TileLayer(new Kz_kagoshima2man())
}
function Kz_kagoshima00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.3444, 31.84601, 130.7926, 31.45388])
}
const kz_kagoshima00Obj = {};
for (let i of mapsStr) {
  kz_kagoshima00Obj[i] = new TileLayer(new Kz_kagoshima00())
}
function Kz_kagoshima01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.3444, 31.84601, 130.7926, 31.45388])
}
const kz_kagoshima01Obj = {};
for (let i of mapsStr) {
  kz_kagoshima01Obj[i] = new TileLayer(new Kz_kagoshima01())
}
function Kz_kagoshima02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.3444, 31.84601, 130.7926, 31.45388])
}
const kz_kagoshima02Obj = {};
for (let i of mapsStr) {
  kz_kagoshima02Obj[i] = new TileLayer(new Kz_kagoshima02())
}
function Kz_kagoshima03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kagoshima/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.3444, 31.84601, 130.7926, 31.45388])
}
const kz_kagoshima03Obj = {};
for (let i of mapsStr) {
  kz_kagoshima03Obj[i] = new TileLayer(new Kz_kagoshima03())
}

// 秋田
function Kz_akita00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/akita/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9861, 39.92753, 140.2590, 39.57517])
}
const kz_akita00Obj = {};
for (let i of mapsStr) {
  kz_akita00Obj[i] = new TileLayer(new Kz_akita00())
}
function Kz_akita01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/akita/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9861, 39.92753, 140.2590, 39.57517])
}
const kz_akita01Obj = {};
for (let i of mapsStr) {
  kz_akita01Obj[i] = new TileLayer(new Kz_akita01())
}
function Kz_akita02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/akita/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9861, 39.92753, 140.2590, 39.57517])
}
const kz_akita02Obj = {};
for (let i of mapsStr) {
  kz_akita02Obj[i] = new TileLayer(new Kz_akita02())
}
function Kz_akita03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/akita/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9861, 39.92753, 140.2590, 39.57517])
}
const kz_akita03Obj = {};
for (let i of mapsStr) {
  kz_akita03Obj[i] = new TileLayer(new Kz_akita03())
}

// 盛岡
function Kz_morioka00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/morioka/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([40.9799, 39.84484, 141.2624, 39.49430])
}
const kz_morioka00Obj = {};
for (let i of mapsStr) {
  kz_morioka00Obj[i] = new TileLayer(new Kz_morioka00())
}
function Kz_morioka01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/morioka/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([40.9799, 39.84484, 141.2624, 39.49430])
}
const kz_morioka01Obj = {};
for (let i of mapsStr) {
  kz_morioka01Obj[i] = new TileLayer(new Kz_morioka01())
}
function Kz_morioka02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/morioka/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([40.9799, 39.84484, 141.2624, 39.49430])
}
const kz_morioka02Obj = {};
for (let i of mapsStr) {
  kz_morioka02Obj[i] = new TileLayer(new Kz_morioka02())
}
function Kz_morioka03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/morioka/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([40.9799, 39.84484, 141.2624, 39.49430])
}
const kz_morioka03Obj = {};
for (let i of mapsStr) {
  kz_morioka03Obj[i] = new TileLayer(new Kz_morioka03())
}
function Kz_morioka04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/morioka/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([40.9799, 39.84484, 141.2624, 39.49430])
}
const kz_morioka04Obj = {};
for (let i of mapsStr) {
  kz_morioka04Obj[i] = new TileLayer(new Kz_morioka04())
}

// 福井
function Kz_fukui2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukui/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.0866, 36.17954, 136.4248, 35.81107])
}
const kz_fukui2manObj = {};
for (let i of mapsStr) {
  kz_fukui2manObj[i] = new TileLayer(new Kz_fukui2man())
}
function Kz_fukui00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukui/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.0866, 36.17954, 136.4248, 35.81107])}
const kz_fukui00Obj = {};
for (let i of mapsStr) {
  kz_fukui00Obj[i] = new TileLayer(new Kz_fukui00())
}
function Kz_fukui01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukui/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.0866, 36.17954, 136.4248, 35.81107])}
const kz_fukui01Obj = {};
for (let i of mapsStr) {
  kz_fukui01Obj[i] = new TileLayer(new Kz_fukui01())
}
function Kz_fukui02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukui/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.0866, 36.17954, 136.4248, 35.81107])}
const kz_fukui02Obj = {};
for (let i of mapsStr) {
  kz_fukui02Obj[i] = new TileLayer(new Kz_fukui02())
}
function Kz_fukui03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukui/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.0866, 36.17954, 136.4248, 35.81107])}
const kz_fukui03Obj = {};
for (let i of mapsStr) {
  kz_fukui03Obj[i] = new TileLayer(new Kz_fukui03())
}

// 鳥取
function Kz_tottori2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tottori/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.0789, 35.62651, 134.33077, 35.38198])
}
const kz_tottori2manObj = {};
for (let i of mapsStr) {
  kz_tottori2manObj[i] = new TileLayer(new Kz_tottori2man())
}
function Kz_tottori00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tottori/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.0789, 35.62651, 134.33077, 35.38198])
}
const kz_tottori00Obj = {};
for (let i of mapsStr) {
  kz_tottori00Obj[i] = new TileLayer(new Kz_tottori00())
}
function Kz_tottori01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tottori/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.0789, 35.62651, 134.33077, 35.38198])
}
const kz_tottori01Obj = {};
for (let i of mapsStr) {
  kz_tottori01Obj[i] = new TileLayer(new Kz_tottori01())
}
function Kz_tottori02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tottori/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.0789, 35.62651, 134.33077, 35.38198])
}
const kz_tottori02Obj = {};
for (let i of mapsStr) {
  kz_tottori02Obj[i] = new TileLayer(new Kz_tottori02())
}
function Kz_tottori03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tottori/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.0789, 35.62651, 134.33077, 35.38198])
}
const kz_tottori03Obj = {};
for (let i of mapsStr) {
  kz_tottori03Obj[i] = new TileLayer(new Kz_tottori03())
}

// 高松
function Kz_takamatsu2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.6703, 34.44003, 134.2791, 34.11763])
}
const kz_takamatsu2manObj = {};
for (let i of mapsStr) {
  kz_takamatsu2manObj[i] = new TileLayer(new Kz_takamatsu2man())
}
function Kz_takamatsu00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.6703, 34.44003, 134.2791, 34.11763])
}
const kz_takamatsu00Obj = {};
for (let i of mapsStr) {
  kz_takamatsu00Obj[i] = new TileLayer(new Kz_takamatsu00())
}
function Kz_takamatsu01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.6703, 34.44003, 134.2791, 34.11763])
}
const kz_takamatsu01Obj = {};
for (let i of mapsStr) {
  kz_takamatsu01Obj[i] = new TileLayer(new Kz_takamatsu01())
}
function Kz_takamatsu02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.6703, 34.44003, 134.2791, 34.11763])
}
const kz_takamatsu02Obj = {};
for (let i of mapsStr) {
  kz_takamatsu02Obj[i] = new TileLayer(new Kz_takamatsu02())
}
function Kz_takamatsu03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/takamatsu/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.6703, 34.44003, 134.2791, 34.11763])
}
const kz_takamatsu03Obj = {};
for (let i of mapsStr) {
  kz_takamatsu03Obj[i] = new TileLayer(new Kz_takamatsu03())
}

// 徳島
function Kz_tokushima2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.2076, 34.29169, 134.7807, 33.82579])
}
const kz_tokushima2manObj = {};
for (let i of mapsStr) {
  kz_tokushima2manObj[i] = new TileLayer(new Kz_tokushima2man())
}
function Kz_tokushima00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.2076, 34.29169, 134.7807, 33.82579])
}
const kz_tokushima00Obj = {};
for (let i of mapsStr) {
  kz_tokushima00Obj[i] = new TileLayer(new Kz_tokushima00())
}
function Kz_tokushima01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.2076, 34.29169, 134.7807, 33.82579])
}
const kz_tokushima01Obj = {};
for (let i of mapsStr) {
  kz_tokushima01Obj[i] = new TileLayer(new Kz_tokushima01())
}
function Kz_tokushima02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.2076, 34.29169, 134.7807, 33.82579])
}
const kz_tokushima02Obj = {};
for (let i of mapsStr) {
  kz_tokushima02Obj[i] = new TileLayer(new Kz_tokushima02())
}
function Kz_tokushima03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.2076, 34.29169, 134.7807, 33.82579])
}
const kz_tokushima03Obj = {};
for (let i of mapsStr) {
  kz_tokushima03Obj[i] = new TileLayer(new Kz_tokushima03())
}
function Kz_tokushima04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tokushima/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.2076, 34.29169, 134.7807, 33.82579])
}
const kz_tokushima04Obj = {};
for (let i of mapsStr) {
  kz_tokushima04Obj[i] = new TileLayer(new Kz_tokushima04())
}

// 高知
function Kz_kochi2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kochi/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.3387, 33.68745, 133.9075, 33.36919])
}
const kz_kochi2manObj = {};
for (let i of mapsStr) {
  kz_kochi2manObj[i] = new TileLayer(new Kz_kochi2man())
}
function Kz_kochi00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kochi/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.3387, 33.68745, 133.9075, 33.36919])
}
const kz_kochi00Obj = {};
for (let i of mapsStr) {
  kz_kochi00Obj[i] = new TileLayer(new Kz_kochi00())
}
function Kz_kochi01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kochi/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.3387, 33.68745, 133.9075, 33.36919])
}
const kz_kochi01Obj = {};
for (let i of mapsStr) {
  kz_kochi01Obj[i] = new TileLayer(new Kz_kochi01())
}
function Kz_kochi02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kochi/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.3387, 33.68745, 133.9075, 33.36919])
}
const kz_kochi02Obj = {};
for (let i of mapsStr) {
  kz_kochi02Obj[i] = new TileLayer(new Kz_kochi02())
}
function Kz_kochi03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kochi/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([133.3387, 33.68745, 133.9075, 33.36919])
}
const kz_kochi03Obj = {};
for (let i of mapsStr) {
  kz_kochi03Obj[i] = new TileLayer(new Kz_kochi03())
}

// 山形
function Kz_yamagata2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.1843, 38.51437, 140.5229, 38.06874])
}
const kz_yamagata2manObj = {};
for (let i of mapsStr) {
  kz_yamagata2manObj[i] = new TileLayer(new Kz_yamagata2man())
}
function Kz_yamagata00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.1843, 38.51437, 140.5229, 38.06874])
}
const kz_yamagata00Obj = {};
for (let i of mapsStr) {
  kz_yamagata00Obj[i] = new TileLayer(new Kz_yamagata00())
}
function Kz_yamagata01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.1843, 38.51437, 140.5229, 38.06874])
}
const kz_yamagata01Obj = {};
for (let i of mapsStr) {
  kz_yamagata01Obj[i] = new TileLayer(new Kz_yamagata01())
}
function Kz_yamagata02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.1843, 38.51437, 140.5229, 38.06874])
}
const kz_yamagata02Obj = {};
for (let i of mapsStr) {
  kz_yamagata02Obj[i] = new TileLayer(new Kz_yamagata02())
}
function Kz_yamagata03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamagata/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.1843, 38.51437, 140.5229, 38.06874])
}
const kz_yamagata03Obj = {};
for (let i of mapsStr) {
  kz_yamagata03Obj[i] = new TileLayer(new Kz_yamagata03())
}

// 青森
function Kz_aomori00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aomori/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6031, 40.93068, 140.8888, 40.74337])
}
const kz_aomori00Obj = {};
for (let i of mapsStr) {
  kz_aomori00Obj[i] = new TileLayer(new Kz_aomori00())
}
function Kz_aomori01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aomori/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6031, 40.93068, 140.8888, 40.74337])
}
const kz_aomori01Obj = {};
for (let i of mapsStr) {
  kz_aomori01Obj[i] = new TileLayer(new Kz_aomori01())
}
function Kz_aomori02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aomori/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6031, 40.93068, 140.8888, 40.74337])
}
const kz_aomori02Obj = {};
for (let i of mapsStr) {
  kz_aomori02Obj[i] = new TileLayer(new Kz_aomori02())
}
function Kz_aomori03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aomori/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6031, 40.93068, 140.8888, 40.74337])
}
const kz_aomori03Obj = {};
for (let i of mapsStr) {
  kz_aomori03Obj[i] = new TileLayer(new Kz_aomori03())
}
function Kz_aomori04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aomori/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6031, 40.93068, 140.8888, 40.74337])
}
const kz_aomori04Obj = {};
for (let i of mapsStr) {
  kz_aomori04Obj[i] = new TileLayer(new Kz_aomori04())
}

// 福島
function Kz_fukushima00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.2226, 37.84724, 140.5149, 37.15678])
}
const kz_fukushima00Obj = {};
for (let i of mapsStr) {
  kz_fukushima00Obj[i] = new TileLayer(new Kz_fukushima00())
}
function Kz_fukushima01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.2226, 37.84724, 140.5149, 37.15678])
}
const kz_fukushima01Obj = {};
for (let i of mapsStr) {
  kz_fukushima01Obj[i] = new TileLayer(new Kz_fukushima01())
}
function Kz_fukushima02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.2226, 37.84724, 140.5149, 37.15678])
}
const kz_fukushima02Obj = {};
for (let i of mapsStr) {
  kz_fukushima02Obj[i] = new TileLayer(new Kz_fukushima02())
}
function Kz_fukushima03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.2226, 37.84724, 140.5149, 37.15678])
}
const kz_fukushima03Obj = {};
for (let i of mapsStr) {
  kz_fukushima03Obj[i] = new TileLayer(new Kz_fukushima03())
}
function Kz_fukushima04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukushima/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.2226, 37.84724, 140.5149, 37.15678])
}
const kz_fukushima04Obj = {};
for (let i of mapsStr) {
  kz_fukushima04Obj[i] = new TileLayer(new Kz_fukushima04())
}

// 長野
function Kz_nagano00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagano/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.9812, 36.67809, 138.2593, 36.49367])
}
const kz_nagano00Obj = {};
for (let i of mapsStr) {
  kz_nagano00Obj[i] = new TileLayer(new Kz_nagano00())
}
function Kz_nagano01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagano/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.9812, 36.67809, 138.2593, 36.49367])
}
const kz_nagano01Obj = {};
for (let i of mapsStr) {
  kz_nagano01Obj[i] = new TileLayer(new Kz_nagano01())
}
function Kz_nagano02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagano/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.9812, 36.67809, 138.2593, 36.49367])
}
const kz_nagano02Obj = {};
for (let i of mapsStr) {
  kz_nagano02Obj[i] = new TileLayer(new Kz_nagano02())
}
function Kz_nagano03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagano/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.9812, 36.67809, 138.2593, 36.49367])
}
const kz_nagano03Obj = {};
for (let i of mapsStr) {
  kz_nagano03Obj[i] = new TileLayer(new Kz_nagano03())
}
function Kz_nagano04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagano/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.9812, 36.67809, 138.2593, 36.49367])
}
const kz_nagano04Obj = {};
for (let i of mapsStr) {
  kz_nagano04Obj[i] = new TileLayer(new Kz_nagano04())
}
function Kz_nagano05 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagano/05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.9812, 36.67809, 138.2593, 36.49367])
}
const kz_nagano05Obj = {};
for (let i of mapsStr) {
  kz_nagano05Obj[i] = new TileLayer(new Kz_nagano05())
}

// 松山
function Kz_matsuyama2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5737, 33.94776, 133.0168, 33.70724])
}
const kz_matsuyama2manObj = {};
for (let i of mapsStr) {
  kz_matsuyama2manObj[i] = new TileLayer(new Kz_matsuyama2man())
}
function Kz_matsuyama00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5737, 33.94776, 133.0168, 33.70724])
}
const kz_matsuyama00Obj = {};
for (let i of mapsStr) {
  kz_matsuyama00Obj[i] = new TileLayer(new Kz_matsuyama00())
}
function Kz_matsuyama01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5737, 33.94776, 133.0168, 33.70724])
}
const kz_matsuyama01Obj = {};
for (let i of mapsStr) {
  kz_matsuyama01Obj[i] = new TileLayer(new Kz_matsuyama01())
}
function Kz_matsuyama02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5737, 33.94776, 133.0168, 33.70724])
}
const kz_matsuyama02Obj = {};
for (let i of mapsStr) {
  kz_matsuyama02Obj[i] = new TileLayer(new Kz_matsuyama02())
}
function Kz_matsuyama03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsuyama/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5737, 33.94776, 133.0168, 33.70724])
}
const kz_matsuyama03Obj = {};
for (let i of mapsStr) {
  kz_matsuyama03Obj[i] = new TileLayer(new Kz_matsuyama03())
}
// 金沢・富山
function Kz_kanazawa2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.2230, 36.85496, 137.6053, 36.31367])
}
const kz_kanazawa2manObj = {};
for (let i of mapsStr) {
  kz_kanazawa2manObj[i] = new TileLayer(new Kz_kanazawa2man())
}
function Kz_kanazawa00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.2230, 36.85496, 137.6053, 36.31367])
}
const kz_kanazawa00Obj = {};
for (let i of mapsStr) {
  kz_kanazawa00Obj[i] = new TileLayer(new Kz_kanazawa00())
}
function Kz_kanazawa01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.2230, 36.85496, 137.6053, 36.31367])
}
const kz_kanazawa01Obj = {};
for (let i of mapsStr) {
  kz_kanazawa01Obj[i] = new TileLayer(new Kz_kanazawa01())
}
function Kz_kanazawa02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.2230, 36.85496, 137.6053, 36.31367])
}
const kz_kanazawa02Obj = {};
for (let i of mapsStr) {
  kz_kanazawa02Obj[i] = new TileLayer(new Kz_kanazawa02())
}
function Kz_kanazawa03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kanazawa/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.2230, 36.85496, 137.6053, 36.31367])
}
const kz_kanazawa03Obj = {};
for (let i of mapsStr) {
  kz_kanazawa03Obj[i] = new TileLayer(new Kz_kanazawa03())
}
// 和歌山
function Kz_wakayama2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9722, 34.35308, 135.5498, 34.03339])
}
const kz_wakayama2manObj = {};
for (let i of mapsStr) {
  kz_wakayama2manObj[i] = new TileLayer(new Kz_wakayama2man())
}
function Kz_wakayama00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9722, 34.35308, 135.5498, 34.03339])
}
const kz_wakayama00Obj = {};
for (let i of mapsStr) {
  kz_wakayama00Obj[i] = new TileLayer(new Kz_wakayama00())
}
function Kz_wakayama01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9722, 34.35308, 135.5498, 34.03339])
}
const kz_wakayama01Obj = {};
for (let i of mapsStr) {
  kz_wakayama01Obj[i] = new TileLayer(new Kz_wakayama01())
}
function Kz_wakayama02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9722, 34.35308, 135.5498, 34.03339])
}
const kz_wakayama02Obj = {};
for (let i of mapsStr) {
  kz_wakayama02Obj[i] = new TileLayer(new Kz_wakayama02())
}
function Kz_wakayama03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9722, 34.35308, 135.5498, 34.03339])
}
const kz_wakayama03Obj = {};
for (let i of mapsStr) {
  kz_wakayama03Obj[i] = new TileLayer(new Kz_wakayama03())
}
function Kz_wakayama04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/wakayama/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([134.9722, 34.35308, 135.5498, 34.03339])
}
const kz_wakayama04Obj = {};
for (let i of mapsStr) {
  kz_wakayama04Obj[i] = new TileLayer(new Kz_wakayama04())
}

// 近江
function Kz_omi2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omi/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.7579, 35.52322, 136.5286, 34.87454])
}
const kz_omi2manObj = {};
for (let i of mapsStr) {
  kz_omi2manObj[i] = new TileLayer(new Kz_omi2man())
}
function Kz_omi00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omi/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.7579, 35.52322, 136.5286, 34.87454])
}
const kz_omi00Obj = {};
for (let i of mapsStr) {
  kz_omi00Obj[i] = new TileLayer(new Kz_omi00())
}
function Kz_omi01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omi/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.7579, 35.52322, 136.5286, 34.87454])
}
const kz_omi01Obj = {};
for (let i of mapsStr) {
  kz_omi01Obj[i] = new TileLayer(new Kz_omi01())
}
function Kz_omi02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omi/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.7579, 35.52322, 136.5286, 34.87454])
}
const kz_omi02Obj = {};
for (let i of mapsStr) {
  kz_omi02Obj[i] = new TileLayer(new Kz_omi02())
}
function Kz_omi03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omi/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.7579, 35.52322, 136.5286, 34.87454])
}
const kz_omi03Obj = {};
for (let i of mapsStr) {
  kz_omi03Obj[i] = new TileLayer(new Kz_omi03())
}
function Kz_omi04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omi/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.7579, 35.52322, 136.5286, 34.87454])
}
const kz_omi04Obj = {};
for (let i of mapsStr) {
  kz_omi04Obj[i] = new TileLayer(new Kz_omi04())
}


// 旭川
function Kz_asahikawa00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.2280, 43.93407, 142.5118, 43.66072])
}
const kz_asahikawa00Obj = {};
for (let i of mapsStr) {
  kz_asahikawa00Obj[i] = new TileLayer(new Kz_asahikawa00())
}
function Kz_asahikawa01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.2280, 43.93407, 142.5118, 43.66072])
}
const kz_asahikawa01Obj = {};
for (let i of mapsStr) {
  kz_asahikawa01Obj[i] = new TileLayer(new Kz_asahikawa01())
}
function Kz_asahikawa02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.2280, 43.93407, 142.5118, 43.66072])
}
const kz_asahikawa02Obj = {};
for (let i of mapsStr) {
  kz_asahikawa02Obj[i] = new TileLayer(new Kz_asahikawa02())
}
function Kz_asahikawa03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.2280, 43.93407, 142.5118, 43.66072])
}
const kz_asahikawa03Obj = {};
for (let i of mapsStr) {
  kz_asahikawa03Obj[i] = new TileLayer(new Kz_asahikawa03())
}
function Kz_asahikawa04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/asahikawa/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.2280, 43.93407, 142.5118, 43.66072])
}
const kz_asahikawa04Obj = {};
for (let i of mapsStr) {
  kz_asahikawa04Obj[i] = new TileLayer(new Kz_asahikawa04())
}

// 函館
function Kz_hakodate00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.4871, 41.92427, 140.8864, 41.65343])
}
const kz_hakodate00Obj = {};
for (let i of mapsStr) {
  kz_hakodate00Obj[i] = new TileLayer(new Kz_hakodate00())
}
function Kz_hakodate01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.4871, 41.92427, 140.8864, 41.65343])
}
const kz_hakodate01Obj = {};
for (let i of mapsStr) {
  kz_hakodate01Obj[i] = new TileLayer(new Kz_hakodate01())
}
function Kz_hakodate02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.4871, 41.92427, 140.8864, 41.65343])
}
const kz_hakodate02Obj = {};
for (let i of mapsStr) {
  kz_hakodate02Obj[i] = new TileLayer(new Kz_hakodate02())
}
function Kz_hakodate03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.4871, 41.92427, 140.8864, 41.65343])
}
const kz_hakodate03Obj = {};
for (let i of mapsStr) {
  kz_hakodate03Obj[i] = new TileLayer(new Kz_hakodate03())
}
function Kz_hakodate04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hakodate/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.4871, 41.92427, 140.8864, 41.65343])
}
const kz_hakodate04Obj = {};
for (let i of mapsStr) {
  kz_hakodate04Obj[i] = new TileLayer(new Kz_hakodate04())
}

// 松本
function Kz_matsumoto00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.43027, 138.1433, 35.99328])
}
const kz_matsumoto00Obj = {};
for (let i of mapsStr) {
  kz_matsumoto00Obj[i] = new TileLayer(new Kz_matsumoto00())
}
function Kz_matsumoto01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.43027, 138.1433, 35.99328])
}
const kz_matsumoto01Obj = {};
for (let i of mapsStr) {
  kz_matsumoto01Obj[i] = new TileLayer(new Kz_matsumoto01())
}
function Kz_matsumoto02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.43027, 138.1433, 35.99328])
}
const kz_matsumoto02Obj = {};
for (let i of mapsStr) {
  kz_matsumoto02Obj[i] = new TileLayer(new Kz_matsumoto02())
}
function Kz_matsumoto03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.43027, 138.1433, 35.99328])
}
const kz_matsumoto03Obj = {};
for (let i of mapsStr) {
  kz_matsumoto03Obj[i] = new TileLayer(new Kz_matsumoto03())
}
function Kz_matsumoto04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsumoto/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.43027, 138.1433, 35.99328])
}
const kz_matsumoto04Obj = {};
for (let i of mapsStr) {
  kz_matsumoto04Obj[i] = new TileLayer(new Kz_matsumoto04())
}

// 弘前
function Kz_hirosaki00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.3426, 40.85047, 140.6422, 40.49216])
}
const kz_hirosaki00Obj = {};
for (let i of mapsStr) {
  kz_hirosaki00Obj[i] = new TileLayer(new Kz_hirosaki00())
}
function Kz_hirosaki01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.3426, 40.85047, 140.6422, 40.49216])
}
const kz_hirosaki01Obj = {};
for (let i of mapsStr) {
  kz_hirosaki01Obj[i] = new TileLayer(new Kz_hirosaki01())
}
function Kz_hirosaki02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.3426, 40.85047, 140.6422, 40.49216])
}
const kz_hirosaki02Obj = {};
for (let i of mapsStr) {
  kz_hirosaki02Obj[i] = new TileLayer(new Kz_hirosaki02())
}
function Kz_hirosaki03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.3426, 40.85047, 140.6422, 40.49216])
}
const kz_hirosaki03Obj = {};
for (let i of mapsStr) {
  kz_hirosaki03Obj[i] = new TileLayer(new Kz_hirosaki03())
}
function Kz_hirosaki04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/hirosaki/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.3426, 40.85047, 140.6422, 40.49216])
}
const kz_hirosaki04Obj = {};
for (let i of mapsStr) {
  kz_hirosaki04Obj[i] = new TileLayer(new Kz_hirosaki04())
}

// 苫小牧
function Kz_tomakomai00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([141.4510, 43.03548, 141.7712, 42.48350])
}
const kz_tomakomai00Obj = {};
for (let i of mapsStr) {
  kz_tomakomai00Obj[i] = new TileLayer(new Kz_tomakomai00())
}
function Kz_tomakomai01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([141.4510, 43.03548, 141.7712, 42.48350])
}
const kz_tomakomai01Obj = {};
for (let i of mapsStr) {
  kz_tomakomai01Obj[i] = new TileLayer(new Kz_tomakomai01())
}
function Kz_tomakomai02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([141.4510, 43.03548, 141.7712, 42.48350])
}
const kz_tomakomai02Obj = {};
for (let i of mapsStr) {
  kz_tomakomai02Obj[i] = new TileLayer(new Kz_tomakomai02())
}
function Kz_tomakomai03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([141.4510, 43.03548, 141.7712, 42.48350])
}
const kz_tomakomai03Obj = {};
for (let i of mapsStr) {
  kz_tomakomai03Obj[i] = new TileLayer(new Kz_tomakomai03())
}
function Kz_tomakomai04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tomakomai/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([141.4510, 43.03548, 141.7712, 42.48350])
}
const kz_tomakomai04Obj = {};
for (let i of mapsStr) {
  kz_tomakomai04Obj[i] = new TileLayer(new Kz_tomakomai04())
}

// 帯広
function Kz_obihiro00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.9805, 43.01475, 143.2670, 42.83030])
}
const kz_obihiro00Obj = {};
for (let i of mapsStr) {
  kz_obihiro00Obj[i] = new TileLayer(new Kz_obihiro00())
}
function Kz_obihiro01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.9805, 43.01475, 143.2670, 42.83030])
}
const kz_obihiro01Obj = {};
for (let i of mapsStr) {
  kz_obihiro01Obj[i] = new TileLayer(new Kz_obihiro01())
}
function Kz_obihiro02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.9805, 43.01475, 143.2670, 42.83030])
}
const kz_obihiro02Obj = {};
for (let i of mapsStr) {
  kz_obihiro02Obj[i] = new TileLayer(new Kz_obihiro02())
}
function Kz_obihiro03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.9805, 43.01475, 143.2670, 42.83030])
}
const kz_obihiro03Obj = {};
for (let i of mapsStr) {
  kz_obihiro03Obj[i] = new TileLayer(new Kz_obihiro03())
}
function Kz_obihiro04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/obihiro/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([142.9805, 43.01475, 143.2670, 42.83030])
}
const kz_obihiro04Obj = {};
for (let i of mapsStr) {
  kz_obihiro04Obj[i] = new TileLayer(new Kz_obihiro04())
}

// 東予
function Kz_toyo00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/toyo/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.6748, 34.21472, 133.7977, 33.79234])
}
const kz_toyo00Obj = {};
for (let i of mapsStr) {
  kz_toyo00Obj[i] = new TileLayer(new Kz_toyo00())
}
function Kz_toyo01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/toyo/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.6748, 34.21472, 133.7977, 33.79234])
}
const kz_toyo01Obj = {};
for (let i of mapsStr) {
  kz_toyo01Obj[i] = new TileLayer(new Kz_toyo01())
}
function Kz_toyo02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/toyo/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.6748, 34.21472, 133.7977, 33.79234])
}
const kz_toyo02Obj = {};
for (let i of mapsStr) {
  kz_toyo02Obj[i] = new TileLayer(new Kz_toyo02())
}
function Kz_toyo03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/toyo/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.6748, 34.21472, 133.7977, 33.79234])
}
const kz_toyo03Obj = {};
for (let i of mapsStr) {
  kz_toyo03Obj[i] = new TileLayer(new Kz_toyo03())
}
function Kz_toyo04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/toyo/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.6748, 34.21472, 133.7977, 33.79234])
}
const kz_toyo04Obj = {};
for (let i of mapsStr) {
  kz_toyo04Obj[i] = new TileLayer(new Kz_toyo04())
}

// 伊賀
function Kz_iga00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iga/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.9853, 34.84156, 136.2532, 34.49986])
}
const kz_iga00Obj = {};
for (let i of mapsStr) {
  kz_iga00Obj[i] = new TileLayer(new Kz_iga00())
}
function Kz_iga01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iga/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.9853, 34.84156, 136.2532, 34.49986])
}
const kz_iga01Obj = {};
for (let i of mapsStr) {
  kz_iga01Obj[i] = new TileLayer(new Kz_iga01())
}
function Kz_iga02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iga/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.9853, 34.84156, 136.2532, 34.49986])
}
const kz_iga02Obj = {};
for (let i of mapsStr) {
  kz_iga02Obj[i] = new TileLayer(new Kz_iga02())
}
function Kz_iga03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iga/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.9853, 34.84156, 136.2532, 34.49986])
}
const kz_iga03Obj = {};
for (let i of mapsStr) {
  kz_iga03Obj[i] = new TileLayer(new Kz_iga03())
}
function Kz_iga04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iga/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([135.9853, 34.84156, 136.2532, 34.49986])
}
const kz_iga04Obj = {};
for (let i of mapsStr) {
  kz_iga04Obj[i] = new TileLayer(new Kz_iga04())
}

// 伊那
function Kz_ina00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/ina/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.01677, 138.0103, 35.32910])
}
const kz_ina00Obj = {};
for (let i of mapsStr) {
  kz_ina00Obj[i] = new TileLayer(new Kz_ina00())
}
function Kz_ina01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/ina/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.01677, 138.0103, 35.32910])
}
const kz_ina01Obj = {};
for (let i of mapsStr) {
  kz_ina01Obj[i] = new TileLayer(new Kz_ina01())
}
function Kz_ina02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/ina/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.01677, 138.0103, 35.32910])
}
const kz_ina02Obj = {};
for (let i of mapsStr) {
  kz_ina02Obj[i] = new TileLayer(new Kz_ina02())
}
function Kz_ina03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/ina/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.01677, 138.0103, 35.32910])
}
const kz_ina03Obj = {};
for (let i of mapsStr) {
  kz_ina03Obj[i] = new TileLayer(new Kz_ina03())
}
function Kz_ina04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/ina/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.7309, 36.01677, 138.0103, 35.32910])
}
const kz_ina04Obj = {};
for (let i of mapsStr) {
  kz_ina04Obj[i] = new TileLayer(new Kz_ina04())
}


// 米沢
function Kz_yonezawa00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yonezawa/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9891, 38.17523, 140.2535, 37.83335])
}
const kz_yonezawa00Obj = {};
for (let i of mapsStr) {
  kz_yonezawa00Obj[i] = new TileLayer(new Kz_yonezawa00())
}
function Kz_yonezawa01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yonezawa/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9891, 38.17523, 140.2535, 37.83335])
}
const kz_yonezawa01Obj = {};
for (let i of mapsStr) {
  kz_yonezawa01Obj[i] = new TileLayer(new Kz_yonezawa01())
}
function Kz_yonezawa02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yonezawa/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9891, 38.17523, 140.2535, 37.83335])
}
const kz_yonezawa02Obj = {};
for (let i of mapsStr) {
  kz_yonezawa02Obj[i] = new TileLayer(new Kz_yonezawa02())
}
function Kz_yonezawa03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yonezawa/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9891, 38.17523, 140.2535, 37.83335])
}
const kz_yonezawa03Obj = {};
for (let i of mapsStr) {
  kz_yonezawa03Obj[i] = new TileLayer(new Kz_yonezawa03())
}
function Kz_yonezawa04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yonezawa/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.9891, 38.17523, 140.2535, 37.83335])
}
const kz_yonezawa04Obj = {};
for (let i of mapsStr) {
  kz_yonezawa04Obj[i] = new TileLayer(new Kz_yonezawa04())
}

// 周南
function Kz_shunan00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/shunan/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4910, 34.17664, 132.0076, 33.83222])
}
const kz_shunan00Obj = {};
for (let i of mapsStr) {
  kz_shunan00Obj[i] = new TileLayer(new Kz_shunan00())
}
function Kz_shunan01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/shunan/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4910, 34.17664, 132.0076, 33.83222])
}
const kz_shunan01Obj = {};
for (let i of mapsStr) {
  kz_shunan01Obj[i] = new TileLayer(new Kz_shunan01())
}
function Kz_shunan02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/shunan/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4910, 34.17664, 132.0076, 33.83222])
}
const kz_shunan02Obj = {};
for (let i of mapsStr) {
  kz_shunan02Obj[i] = new TileLayer(new Kz_shunan02())
}
function Kz_shunan03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/shunan/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4910, 34.17664, 132.0076, 33.83222])
}
const kz_shunan03Obj = {};
for (let i of mapsStr) {
  kz_shunan03Obj[i] = new TileLayer(new Kz_shunan03())
}
function Kz_shunan04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/shunan/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4910, 34.17664, 132.0076, 33.83222])
}
const kz_shunan04Obj = {};
for (let i of mapsStr) {
  kz_shunan04Obj[i] = new TileLayer(new Kz_shunan04())
}


// 大牟田・島原
function Kz_omuta00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omuta/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.2111, 33.18928, 130.7582, 32.32828])
}
const kz_omuta00Obj = {};
for (let i of mapsStr) {
  kz_omuta00Obj[i] = new TileLayer(new Kz_omuta00())
}
function Kz_omuta01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omuta/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.2111, 33.18928, 130.7582, 32.32828])
}
const kz_omuta01Obj = {};
for (let i of mapsStr) {
  kz_omuta01Obj[i] = new TileLayer(new Kz_omuta01())
}
function Kz_omuta02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omuta/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.2111, 33.18928, 130.7582, 32.32828])
}
const kz_omuta02Obj = {};
for (let i of mapsStr) {
  kz_omuta02Obj[i] = new TileLayer(new Kz_omuta02())
}
function Kz_omuta03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omuta/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.2111, 33.18928, 130.7582, 32.32828])
}
const kz_omuta03Obj = {};
for (let i of mapsStr) {
  kz_omuta03Obj[i] = new TileLayer(new Kz_omuta03())
}
function Kz_omuta04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omuta/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.2111, 33.18928, 130.7582, 32.32828])
}
const kz_omuta04Obj = {};
for (let i of mapsStr) {
  kz_omuta04Obj[i] = new TileLayer(new Kz_omuta04())
}
function Kz_omuta05 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/omuta/05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.2111, 33.18928, 130.7582, 32.32828])
}
const kz_omuta05Obj = {};
for (let i of mapsStr) {
  kz_omuta05Obj[i] = new TileLayer(new Kz_omuta05())
}

// 八代
function Kz_yatsushiro00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.4852, 32.67615, 130.7582, 32.32828])
}
const kz_yatsushiro00Obj = {};
for (let i of mapsStr) {
  kz_yatsushiro00Obj[i] = new TileLayer(new Kz_yatsushiro00())
}
function Kz_yatsushiro01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.4852, 32.67615, 130.7582, 32.32828])
}
const kz_yatsushiro01Obj = {};
for (let i of mapsStr) {
  kz_yatsushiro01Obj[i] = new TileLayer(new Kz_yatsushiro01())
}
function Kz_yatsushiro02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.4852, 32.67615, 130.7582, 32.32828])
}
const kz_yatsushiro02Obj = {};
for (let i of mapsStr) {
  kz_yatsushiro02Obj[i] = new TileLayer(new Kz_yatsushiro02())
}
function Kz_yatsushiro03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.4852, 32.67615, 130.7582, 32.32828])
}
const kz_yatsushiro03Obj = {};
for (let i of mapsStr) {
  kz_yatsushiro03Obj[i] = new TileLayer(new Kz_yatsushiro03())
}
function Kz_yatsushiro04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yatsushiro/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.4852, 32.67615, 130.7582, 32.32828])
}
const kz_yatsushiro04Obj = {};
for (let i of mapsStr) {
  kz_yatsushiro04Obj[i] = new TileLayer(new Kz_yatsushiro04())
}

// 岩手県南
function Kz_iwatekennan00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.9374, 39.53146, 141.2815, 38.81660])
}
const kz_iwatekennan00Obj = {};
for (let i of mapsStr) {
  kz_iwatekennan00Obj[i] = new TileLayer(new Kz_iwatekennan00())
}
function Kz_iwatekennan01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.9374, 39.53146, 141.2815, 38.81660])
}
const kz_iwatekennan01Obj = {};
for (let i of mapsStr) {
  kz_iwatekennan01Obj[i] = new TileLayer(new Kz_iwatekennan01())
}
function Kz_iwatekennan02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.9374, 39.53146, 141.2815, 38.81660])
}
const kz_iwatekennan02Obj = {};
for (let i of mapsStr) {
  kz_iwatekennan02Obj[i] = new TileLayer(new Kz_iwatekennan02())
}
function Kz_iwatekennan03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.9374, 39.53146, 141.2815, 38.81660])
}
const kz_iwatekennan03Obj = {};
for (let i of mapsStr) {
  kz_iwatekennan03Obj[i] = new TileLayer(new Kz_iwatekennan03())
}
function Kz_iwatekennan04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/iwatekennan/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.9374, 39.53146, 141.2815, 38.81660])
}
const kz_iwatekennan04Obj = {};
for (let i of mapsStr) {
  kz_iwatekennan04Obj[i] = new TileLayer(new Kz_iwatekennan04())
}

// 室蘭
function Kz_muroran00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/muroran/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6648, 42.67570, 141.3413, 42.13549])
}
const kz_muroran00Obj = {};
for (let i of mapsStr) {
  kz_muroran00Obj[i] = new TileLayer(new Kz_muroran00())
}
function Kz_muroran01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/muroran/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6648, 42.67570, 141.3413, 42.13549])
}
const kz_muroran01Obj = {};
for (let i of mapsStr) {
  kz_muroran01Obj[i] = new TileLayer(new Kz_muroran01())
}
function Kz_muroran02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/muroran/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6648, 42.67570, 141.3413, 42.13549])
}
const kz_muroran02Obj = {};
for (let i of mapsStr) {
  kz_muroran02Obj[i] = new TileLayer(new Kz_muroran02())
}
function Kz_muroran03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/muroran/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6648, 42.67570, 141.3413, 42.13549])
}
const kz_muroran03Obj = {};
for (let i of mapsStr) {
  kz_muroran03Obj[i] = new TileLayer(new Kz_muroran03())
}
function Kz_muroran04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/muroran/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([140.6648, 42.67570, 141.3413, 42.13549])
}
const kz_muroran04Obj = {};
for (let i of mapsStr) {
  kz_muroran04Obj[i] = new TileLayer(new Kz_muroran04())
}

// 庄内
function Kz_syonai00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/syonai/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.6689, 39.02078, 140.0167, 38.66312])
}
const kz_syonai00Obj = {};
for (let i of mapsStr) {
  kz_syonai00Obj[i] = new TileLayer(new Kz_syonai00())
}
function Kz_syonai01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/syonai/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.6689, 39.02078, 140.0167, 38.66312])
}
const kz_syonai01Obj = {};
for (let i of mapsStr) {
  kz_syonai01Obj[i] = new TileLayer(new Kz_syonai01())
}
function Kz_syonai02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/syonai/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.6689, 39.02078, 140.0167, 38.66312])
}
const kz_syonai02Obj = {};
for (let i of mapsStr) {
  kz_syonai02Obj[i] = new TileLayer(new Kz_syonai02())
}
function Kz_syonai03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/syonai/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.6689, 39.02078, 140.0167, 38.66312])
}
const kz_syonai03Obj = {};
for (let i of mapsStr) {
  kz_syonai03Obj[i] = new TileLayer(new Kz_syonai03())
}
function Kz_syonai04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/syonai/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.6689, 39.02078, 140.0167, 38.66312])
}
const kz_syonai04Obj = {};
for (let i of mapsStr) {
  kz_syonai04Obj[i] = new TileLayer(new Kz_syonai04())
}

// 釧路
function Kz_kushiro00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([144.2340, 43.17967, 144.5149, 42.82175])
}
const kz_kushiro00Obj = {};
for (let i of mapsStr) {
  kz_kushiro00Obj[i] = new TileLayer(new Kz_kushiro00())
}
function Kz_kushiro01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([144.2340, 43.17967, 144.5149, 42.82175])
}
const kz_kushiro01Obj = {};
for (let i of mapsStr) {
  kz_kushiro01Obj[i] = new TileLayer(new Kz_kushiro01())
}
function Kz_kushiro02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([144.2340, 43.17967, 144.5149, 42.82175])
}
const kz_kushiro02Obj = {};
for (let i of mapsStr) {
  kz_kushiro02Obj[i] = new TileLayer(new Kz_kushiro02())
}
function Kz_kushiro03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([144.2340, 43.17967, 144.5149, 42.82175])
}
const kz_kushiro03Obj = {};
for (let i of mapsStr) {
  kz_kushiro03Obj[i] = new TileLayer(new Kz_kushiro03())
}
function Kz_kushiro04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kushiro/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([144.2340, 43.17967, 144.5149, 42.82175])
}
const kz_kushiro04Obj = {};
for (let i of mapsStr) {
  kz_kushiro04Obj[i] = new TileLayer(new Kz_kushiro04())
}


// 会津
function Kz_aizu00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aizu/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.7346, 37.67760, 140.1387, 37.37050])
}
const kz_aizu00Obj = {};
for (let i of mapsStr) {
  kz_aizu00Obj[i] = new TileLayer(new Kz_aizu00())
}
function Kz_aizu01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aizu/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.7346, 37.67760, 140.1387, 37.37050])
}
const kz_aizu01Obj = {};
for (let i of mapsStr) {
  kz_aizu01Obj[i] = new TileLayer(new Kz_aizu01())
}
function Kz_aizu02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aizu/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.7346, 37.67760, 140.1387, 37.37050])
}
const kz_aizu02Obj = {};
for (let i of mapsStr) {
  kz_aizu02Obj[i] = new TileLayer(new Kz_aizu02())
}
function Kz_aizu03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aizu/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.7346, 37.67760, 140.1387, 37.37050])
}
const kz_aizu03Obj = {};
for (let i of mapsStr) {
  kz_aizu03Obj[i] = new TileLayer(new Kz_aizu03())
}
function Kz_aizu04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/aizu/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([139.7346, 37.67760, 140.1387, 37.37050])
}
const kz_aizu04Obj = {};
for (let i of mapsStr) {
  kz_aizu04Obj[i] = new TileLayer(new Kz_aizu04())
}

// 山口
function Kz_yamaguchi2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.0586, 34.27869, 131.6633, 33.90474])
}
const kz_yamaguchi2manObj = {};
for (let i of mapsStr) {
  kz_yamaguchi2manObj[i] = new TileLayer(new Kz_yamaguchi2man())
}
function Kz_yamaguchi00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.0586, 34.27869, 131.6633, 33.90474])
}
const kz_yamaguchi00Obj = {};
for (let i of mapsStr) {
  kz_yamaguchi00Obj[i] = new TileLayer(new Kz_yamaguchi00())
}
function Kz_yamaguchi01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.0586, 34.27869, 131.6633, 33.90474])
}
const kz_yamaguchi01Obj = {};
for (let i of mapsStr) {
  kz_yamaguchi01Obj[i] = new TileLayer(new Kz_yamaguchi01())
}
function Kz_yamaguchi02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.0586, 34.27869, 131.6633, 33.90474])
}
const kz_yamaguchi02Obj = {};
for (let i of mapsStr) {
  kz_yamaguchi02Obj[i] = new TileLayer(new Kz_yamaguchi02())
}
function Kz_yamaguchi03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.0586, 34.27869, 131.6633, 33.90474])
}
const kz_yamaguchi03Obj = {};
for (let i of mapsStr) {
  kz_yamaguchi03Obj[i] = new TileLayer(new Kz_yamaguchi03())
}
function Kz_yamaguchi04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/yamaguchi/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.0586, 34.27869, 131.6633, 33.90474])
}
const kz_yamaguchi04Obj = {};
for (let i of mapsStr) {
  kz_yamaguchi04Obj[i] = new TileLayer(new Kz_yamaguchi04())
}

// 佐世保
function Kz_sasebo2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.5855, 33.27797, 129.8887, 33.05671])
}
const kz_sasebo2manObj = {};
for (let i of mapsStr) {
  kz_sasebo2manObj[i] = new TileLayer(new Kz_sasebo2man())
}
function Kz_sasebo00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.5855, 33.27797, 129.8887, 33.05671])
}
const kz_sasebo00Obj = {};
for (let i of mapsStr) {
  kz_sasebo00Obj[i] = new TileLayer(new Kz_sasebo00())
}
function Kz_sasebo01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.5855, 33.27797, 129.8887, 33.05671])
}
const kz_sasebo01Obj = {};
for (let i of mapsStr) {
  kz_sasebo01Obj[i] = new TileLayer(new Kz_sasebo01())
}
function Kz_sasebo02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.5855, 33.27797, 129.8887, 33.05671])
}
const kz_sasebo02Obj = {};
for (let i of mapsStr) {
  kz_sasebo02Obj[i] = new TileLayer(new Kz_sasebo02())
}
function Kz_sasebo03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/sasebo/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.5855, 33.27797, 129.8887, 33.05671])
}
const kz_sasebo03Obj = {};
for (let i of mapsStr) {
  kz_sasebo03Obj[i] = new TileLayer(new Kz_sasebo03())
}

// 津
function Kz_tsu2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tsu/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.3239, 34.94151, 136.8169, 34.39549])
}
const kz_tsu2manObj = {};
for (let i of mapsStr) {
  kz_tsu2manObj[i] = new TileLayer(new Kz_tsu2man())
}
function Kz_tsu00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tsu/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.3239, 34.94151, 136.8169, 34.39549])
}
const kz_tsu00Obj = {};
for (let i of mapsStr) {
  kz_tsu00Obj[i] = new TileLayer(new Kz_tsu00())
}
function Kz_tsu01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tsu/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.3239, 34.94151, 136.8169, 34.39549])
}
const kz_tsu01Obj = {};
for (let i of mapsStr) {
  kz_tsu01Obj[i] = new TileLayer(new Kz_tsu01())
}
function Kz_tsu02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tsu/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.3239, 34.94151, 136.8169, 34.39549])
}
const kz_tsu02Obj = {};
for (let i of mapsStr) {
  kz_tsu02Obj[i] = new TileLayer(new Kz_tsu02())
}
function Kz_tsu03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tsu/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.3239, 34.94151, 136.8169, 34.39549])
}
const kz_tsu03Obj = {};
for (let i of mapsStr) {
  kz_tsu03Obj[i] = new TileLayer(new Kz_tsu03())
}
function Kz_tsu04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/tsu/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([136.3239, 34.94151, 136.8169, 34.39549])
}
const kz_tsu04Obj = {};
for (let i of mapsStr) {
  kz_tsu04Obj[i] = new TileLayer(new Kz_tsu04())
}

// 松江・米子
function Kz_matsue00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsue/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5854, 35.59292, 133.4077, 35.29653])
}
const kz_matsue00Obj = {};
for (let i of mapsStr) {
  kz_matsue00Obj[i] = new TileLayer(new Kz_matsue00())
}
function Kz_matsue01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsue/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5854, 35.59292, 133.4077, 35.29653])
}
const kz_matsue01Obj = {};
for (let i of mapsStr) {
  kz_matsue01Obj[i] = new TileLayer(new Kz_matsue01())
}
function Kz_matsue02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsue/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5854, 35.59292, 133.4077, 35.29653])
}
const kz_matsue02Obj = {};
for (let i of mapsStr) {
  kz_matsue02Obj[i] = new TileLayer(new Kz_matsue02())
}
function Kz_matsue03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsue/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5854, 35.59292, 133.4077, 35.29653])
}
const kz_matsue03Obj = {};
for (let i of mapsStr) {
  kz_matsue03Obj[i] = new TileLayer(new Kz_matsue03())
}
function Kz_matsue04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/matsue/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([132.5854, 35.59292, 133.4077, 35.29653])
}
const kz_matsue04Obj = {};
for (let i of mapsStr) {
  kz_matsue04Obj[i] = new TileLayer(new Kz_matsue04())
}
// 佐賀・久留米
function Kz_saga2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/saga/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([30.0980, 33.42484, 130.6478, 33.07065])
}
const kz_saga2manObj = {};
for (let i of mapsStr) {
  kz_saga2manObj[i] = new TileLayer(new Kz_saga2man())
}
function Kz_saga00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/saga/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([30.0980, 33.42484, 130.6478, 33.07065])
}
const kz_saga00Obj = {};
for (let i of mapsStr) {
  kz_saga00Obj[i] = new TileLayer(new Kz_saga00())
}
function Kz_saga01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/saga/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([30.0980, 33.42484, 130.6478, 33.07065])
}
const kz_saga01Obj = {};
for (let i of mapsStr) {
  kz_saga01Obj[i] = new TileLayer(new Kz_saga01())
}
function Kz_saga02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/saga/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([30.0980, 33.42484, 130.6478, 33.07065])
}
const kz_saga02Obj = {};
for (let i of mapsStr) {
  kz_saga02Obj[i] = new TileLayer(new Kz_saga02())
}
function Kz_saga03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/saga/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([30.0980, 33.42484, 130.6478, 33.07065])
}
const kz_saga03Obj = {};
for (let i of mapsStr) {
  kz_saga03Obj[i] = new TileLayer(new Kz_saga03())
}
function Kz_saga04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/saga/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([30.0980, 33.42484, 130.6478, 33.07065])
}
const kz_saga04Obj = {};
for (let i of mapsStr) {
  kz_saga04Obj[i] = new TileLayer(new Kz_saga04())
}
// 長崎
function Kz_nagasaki2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.7194, 33.01805, 130.1422, 32.63044])
}
const kz_nagasaki2manObj = {};
for (let i of mapsStr) {
  kz_nagasaki2manObj[i] = new TileLayer(new Kz_nagasaki2man())
}
function Kz_nagasaki00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.7194, 33.01805, 130.1422, 32.63044])
}
const kz_nagasaki00Obj = {};
for (let i of mapsStr) {
  kz_nagasaki00Obj[i] = new TileLayer(new Kz_nagasaki00())
}
function Kz_nagasaki01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.7194, 33.01805, 130.1422, 32.63044])
}
const kz_nagasaki01Obj = {};
for (let i of mapsStr) {
  kz_nagasaki01Obj[i] = new TileLayer(new Kz_nagasaki01())
}
function Kz_nagasaki02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.7194, 33.01805, 130.1422, 32.63044])
}
const kz_nagasaki02Obj = {};
for (let i of mapsStr) {
  kz_nagasaki02Obj[i] = new TileLayer(new Kz_nagasaki02())
}
function Kz_nagasaki03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.7194, 33.01805, 130.1422, 32.63044])
}
const kz_nagasaki03Obj = {};
for (let i of mapsStr) {
  kz_nagasaki03Obj[i] = new TileLayer(new Kz_nagasaki03())
}
function Kz_nagasaki04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nagasaki/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([129.7194, 33.01805, 130.1422, 32.63044])
}
const kz_nagasaki04Obj = {};
for (let i of mapsStr) {
  kz_nagasaki04Obj[i] = new TileLayer(new Kz_nagasaki04())
}

// 大分
function Kz_oita00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/oita/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4840, 33.35332, 131.8944, 33.15357])
}
const kz_oita00Obj = {};
for (let i of mapsStr) {
  kz_oita00Obj[i] = new TileLayer(new Kz_oita00())
}
function Kz_oita01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/oita/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4840, 33.35332, 131.8944, 33.15357])
}
const kz_oita01Obj = {};
for (let i of mapsStr) {
  kz_oita01Obj[i] = new TileLayer(new Kz_oita01())
}
function Kz_oita02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/oita/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4840, 33.35332, 131.8944, 33.15357])
}
const kz_oita02Obj = {};
for (let i of mapsStr) {
  kz_oita02Obj[i] = new TileLayer(new Kz_oita02())
}
function Kz_oita03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/oita/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([131.4840, 33.35332, 131.8944, 33.15357])
}
const kz_oita03Obj = {};
for (let i of mapsStr) {
  kz_oita03Obj[i] = new TileLayer(new Kz_oita03())
}

// 沖縄本島南部
function Kz_okinawas00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([127.600, 26.43582, 127.891, 25.98594])
}
const kz_okinawas00Obj = {};
for (let i of mapsStr) {
  kz_okinawas00Obj[i] = new TileLayer(new Kz_okinawas00())
}
function Kz_okinawas01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([127.600, 26.43582, 127.891, 25.98594])
}
const kz_okinawas01Obj = {};
for (let i of mapsStr) {
  kz_okinawas01Obj[i] = new TileLayer(new Kz_okinawas01())
}
function Kz_okinawas02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([127.600, 26.43582, 127.891, 25.98594])
}
const kz_okinawas02Obj = {};
for (let i of mapsStr) {
  kz_okinawas02Obj[i] = new TileLayer(new Kz_okinawas02())
}
function Kz_okinawas03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/okinawas/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([127.600, 26.43582, 127.891, 25.98594])
}
const kz_okinawas03Obj = {};
for (let i of mapsStr) {
  kz_okinawas03Obj[i] = new TileLayer(new Kz_okinawas03())
}
// 新潟
function Kz_niigata2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/niigata/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.99573, 38.0509, 139.4958, 36.93352])
}
const kz_niigata2manObj = {};
for (let i of mapsStr) {
  kz_niigata2manObj[i] = new TileLayer(new Kz_niigata2man())
}
function Kz_niigata00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/niigata/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.99573, 38.0509, 139.4958, 36.93352])
}
const kz_niigata00Obj = {};
for (let i of mapsStr) {
  kz_niigata00Obj[i] = new TileLayer(new Kz_niigata00())
}
function Kz_niigata01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/niigata/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.99573, 38.0509, 139.4958, 36.93352])
}
const kz_niigata01Obj = {};
for (let i of mapsStr) {
  kz_niigata01Obj[i] = new TileLayer(new Kz_niigata01())
}
function Kz_niigata02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/niigata/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.99573, 38.0509, 139.4958, 36.93352])
}
const kz_niigata02Obj = {};
for (let i of mapsStr) {
  kz_niigata02Obj[i] = new TileLayer(new Kz_niigata02())
}
function Kz_niigata03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/niigata/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.99573, 38.0509, 139.4958, 36.93352])
}
const kz_niigata03Obj = {};
for (let i of mapsStr) {
  kz_niigata03Obj[i] = new TileLayer(new Kz_niigata03())
}
function Kz_niigata04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/niigata/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([137.99573, 38.0509, 139.4958, 36.93352])
}
const kz_niigata04Obj = {};
for (let i of mapsStr) {
  kz_niigata04Obj[i] = new TileLayer(new Kz_niigata04())
}

// 福岡・北九州編------------------------------------------------------------------------------
function Kz_fukuoka00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  });
  this.extent = transformE([130.12549,33.41993,131.1254516,34.003285])
}
const kz_fukuoka00Obj = {};
for (let i of mapsStr) {
  kz_fukuoka00Obj[i] = new TileLayer(new Kz_fukuoka00())
}
function Kz_fukuoka01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  });
  this.extent = transformE([130.12549,33.41993,131.1254516,34.003285])
}
const kz_fukuoka01Obj = {};
for (let i of mapsStr) {
  kz_fukuoka01Obj[i] = new TileLayer(new Kz_fukuoka01())
}
function Kz_fukuoka02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  });
  this.extent = transformE([130.12549,33.41993,131.1254516,34.003285])
}
const kz_fukuoka02Obj = {};
for (let i of mapsStr) {
  kz_fukuoka02Obj[i] = new TileLayer(new Kz_fukuoka02())
}
function Kz_fukuoka03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.12549,33.41993,131.1254516,34.003285])
}
const kz_fukuoka03Obj = {};
for (let i of mapsStr) {
  kz_fukuoka03Obj[i] = new TileLayer(new Kz_fukuoka03())
}
function Kz_fukuoka04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.12549,33.41993,131.1254516,34.003285])
}
const kz_fukuoka04Obj = {};
for (let i of mapsStr) {
  kz_fukuoka04Obj[i] = new TileLayer(new Kz_fukuoka04())
}
function Kz_fukuoka05 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/fukuoka/05/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.12549,33.41993,131.1254516,34.003285])
}
const kz_fukuoka05Obj = {};
for (let i of mapsStr) {
  kz_fukuoka05Obj[i] = new TileLayer(new Kz_fukuoka05())
}
// 熊本
function Kz_kumamoto2man () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/2man/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.48717, 32.94715, 130.9162, 32.65805])
}
const kz_kumamoto2manObj = {};
for (let i of mapsStr) {
  kz_kumamoto2manObj[i] = new TileLayer(new Kz_kumamoto2man())
}
function Kz_kumamoto00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.48717, 32.94715, 130.9162, 32.65805])
}
const kz_kumamoto00Obj = {};
for (let i of mapsStr) {
  kz_kumamoto00Obj[i] = new TileLayer(new Kz_kumamoto00())
}
function Kz_kumamoto01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.48717, 32.94715, 130.9162, 32.65805])
}
const kz_kumamoto01Obj = {};
for (let i of mapsStr) {
  kz_kumamoto01Obj[i] = new TileLayer(new Kz_kumamoto01())
}
function Kz_kumamoto02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.48717, 32.94715, 130.9162, 32.65805])
}
const kz_kumamoto02Obj = {};
for (let i of mapsStr) {
  kz_kumamoto02Obj[i] = new TileLayer(new Kz_kumamoto02())
}
function Kz_kumamoto03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/kumamoto/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
  this.extent = transformE([130.48717, 32.94715, 130.9162, 32.65805])
}
const kz_kumamoto03Obj = {};
for (let i of mapsStr) {
  kz_kumamoto03Obj[i] = new TileLayer(new Kz_kumamoto03())
}
// 宮崎編-------------------------------------------------------------------
function Kz_miyazaki00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyazaki00Obj = {};
for (let i of mapsStr) {
  kz_miyazaki00Obj[i] = new TileLayer(new Kz_miyazaki00())
}
const kzSumm = "<a href='https://ktgis.net/kjmapw/tilemapservice.html' target='_blank'>今昔マップ</a>"
//------------------
function Kz_miyazaki01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyazaki01Obj = {};
for (let i of mapsStr) {
  kz_miyazaki01Obj[i] = new TileLayer(new Kz_miyazaki01())
}
//------------------
function Kz_miyazaki02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyazaki02Obj = {};
for (let i of mapsStr) {
  kz_miyazaki02Obj[i] = new TileLayer(new Kz_miyazaki02())
}
//------------------
function Kz_miyazaki03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyazaki03Obj = {};
for (let i of mapsStr) {
  kz_miyazaki03Obj[i] = new TileLayer(new Kz_miyazaki03())
}
//------------------
function Kz_miyazaki04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyazaki/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyazaki04Obj = {};
for (let i of mapsStr) {
  kz_miyazaki04Obj[i] = new TileLayer(new Kz_miyazaki04())
}

//------------------
function Kz_miyakonojyou00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyakonojyou00Obj = {};
for (let i of mapsStr) {
  kz_miyakonojyou00Obj[i] = new TileLayer(new Kz_miyakonojyou00())
}
function Kz_miyakonojyou01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyakonojyou01Obj = {};
for (let i of mapsStr) {
  kz_miyakonojyou01Obj[i] = new TileLayer(new Kz_miyakonojyou01())
}
//------------------
function Kz_miyakonojyou02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyakonojyou02Obj = {};
for (let i of mapsStr) {
  kz_miyakonojyou02Obj[i] = new TileLayer(new Kz_miyakonojyou02())
}
//------------------
function Kz_miyakonojyou03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyakonojyou03Obj = {};
for (let i of mapsStr) {
  kz_miyakonojyou03Obj[i] = new TileLayer(new Kz_miyakonojyou03())
}
//------------------
function Kz_miyakonojyou04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/miyakonojyou/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_miyakonojyou04Obj = {};
for (let i of mapsStr) {
  kz_miyakonojyou04Obj[i] = new TileLayer(new Kz_miyakonojyou04())
}
//------------------
function Kz_nobeoka00 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/00/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_nobeoka00Obj = {};
for (let i of mapsStr) {
  kz_nobeoka00Obj[i] = new TileLayer(new Kz_nobeoka00())
}
function Kz_nobeoka01 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/01/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_nobeoka01Obj = {};
for (let i of mapsStr) {
  kz_nobeoka01Obj[i] = new TileLayer(new Kz_nobeoka01())
}
//------------------
function Kz_nobeoka02 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/02/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_nobeoka02Obj = {};
for (let i of mapsStr) {
  kz_nobeoka02Obj[i] = new TileLayer(new Kz_nobeoka02())
}
//------------------
function Kz_nobeoka03 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/03/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_nobeoka03Obj = {};
for (let i of mapsStr) {
  kz_nobeoka03Obj[i] = new TileLayer(new Kz_nobeoka03())
}
//------------------
function Kz_nobeoka04 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://ktgis.net/kjmapw/kjtilemap/nobeoka/04/{z}/{x}/{-y}.png',
    crossOrigin: 'Anonymous',
    // minZoom: 8,
    maxZoom: 16
  })
}
const kz_nobeoka04Obj = {};
for (let i of mapsStr) {
  kz_nobeoka04Obj[i] = new TileLayer(new Kz_nobeoka04())
}
//今昔マップここまで------------------



//津波浸水範囲------------------


function H23tunami() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/20110311_tohoku_shinsui/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 7,
    maxZoom: 16
  })
}
const h23tunamiObj = {};
for (let i of mapsStr) {
  h23tunamiObj[i] = new TileLayer(new H23tunami())
}
const h23tunamiSumm = '出典：<br><a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a><br>東北地方太平洋沖地震後に撮影した空中写真及び観測された衛星画像に基づき、津波による浸水範囲を判読したものです。実際に浸水のあった地域でも把握できていない部分があります。また、雲等により浸水範囲が十分に判読できていないところもあります。';
//------------------
function Zisuberi9() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://jmapweb3v.bosai.go.jp/map/xyz/landslide/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 5,
    maxZoom: 15
  })
}
const zisuberi9Obj = {};
for (let i of mapsStr) {
  zisuberi9Obj[i] = new TileLayer(new Zisuberi9())
}
const zisuberi9Summ = '出典：<br><a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>';
//-土地利用図（1982～1983年）-----------------
function Totiriyouzi() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://cyberjapandata.gsi.go.jp/xyz/lum200k/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 11,
    maxZoom: 14
  })
}
const totiriyouzuObj = {};
for (let i of mapsStr) {
  totiriyouzuObj[i] = new TileLayer(new Totiriyouzi())
}
const totiriyouzuSumm = '出典：<br><a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">国土地理院</a>' +
    '<br><a href="https://cyberjapandata.gsi.go.jp/legend/lum200k_legend.jpg" target="_blank">凡例</a>'


// OpenTopoMap------------------------------------------------------------------------------------
function Otm () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const otmObj = {};
for (let i of mapsStr) {
  otmObj[i] = new TileLayer(new Otm())
}
const otmSumm = '<a href="https://wiki.openstreetmap.org/wiki/JA:OpenTopoMap" target="_blank">OpenTopoMap</a>'
// 浸水推定図------------------------------------------------------------------------------------
function Sinsuisitei () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://maps.gsi.go.jp/xyz/20230629rain_0711shinsui/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 18
  })
}
const sinsuisuiteiObj = {};
for (let i of mapsStr) {
  sinsuisuiteiObj[i] = new TileLayer(new Sinsuisitei())
}
// 今後30年間震度6以上の確率--------------------------------------------------------------------------------------
function Jisin () {
  this.preload = Infinity
  this.pointer = true
  this.name = 'jisin'
  this.source = new XYZ({
    url: 'https://maps.gsi.go.jp/xyz/jishindo_yosoku/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 2,
    maxZoom: 17
  })
}
const jisinObj = {};
for (let i of mapsStr) {
  jisinObj[i] = new TileLayer(new Jisin())
}
const jisinSumm = '<a href="https://www.j-shis.bosai.go.jp/shm" target="_blank">地震ハザードステーション</a>'

function Dokuji () {
  this.preload = Infinity
  this.name = 'dokuji'
  this.source = new XYZ({
    // url: 'https://maps.gsi.go.jp/xyz/jishindo_yosoku/{z}/{x}/{y}.png',
    // crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 18
  })
  this.useInterimTilesOnError = false
  // this.updateWhileInteracting = true
}
const dokujiObj = {};
for (let i of mapsStr) {
  dokujiObj[i] = new TileLayer(new Dokuji())
}

// 日本土壌インベントリー-------------------------------------------------------------------------------
function Dojyou () {
  this.preload = Infinity
  this.name = 'dojyou'
  this.pointer = true
  this.source = new XYZ({
    url: 'https://soil-inventory.rad.naro.go.jp/tile/figure/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 6,
    maxZoom: 12
  })
  this.useInterimTilesOnError = false
}
const dojyouObj = {};
for (let i of mapsStr) {
  dojyouObj[i] = new TileLayer(new Dojyou())
}
const dojyouSumm = '出典：<br><a href="https://soil-inventory.rad.naro.go.jp/figure.html" target="_blank">日本土壌インベントリー</a>';


// 全国Q地図------------------------------------------------------------------------------------
function Q2020 () {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu2.xyz/99gsi/std_01/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 2,
    maxZoom: 16
  })
  this.useInterimTilesOnError = false
}
const q2020Obj = {};
for (let i of mapsStr) {
  q2020Obj[i] = new TileLayer(new Q2020())
}
const qSumm = '<a href="https://info.qchizu.xyz/" target="_blank">全国Q地図さん</a>が地理院標準地図を保存したものです。'
function Q2021() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu2.xyz/99gsi/std_02/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 2,
    maxZoom: 16
  })
  this.useInterimTilesOnError = false
}
const q2021Obj = {};
for (let i of mapsStr) {
  q2021Obj[i] = new TileLayer(new Q2021())
}
function Q2022() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu2.xyz/99gsi/std_03/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 2,
    maxZoom: 16
  })
  this.useInterimTilesOnError = false
}
const q2022Obj = {};
for (let i of mapsStr) {
  q2022Obj[i] = new TileLayer(new Q2022())
}
function Q2023() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://mapdata.qchizu2.xyz/99gsi/std_04/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 2,
    maxZoom: 16
  })
  this.useInterimTilesOnError = false
}
const q2023Obj = {};
for (let i of mapsStr) {
  q2023Obj[i] = new TileLayer(new Q2023())
}

// デジタル標高地形図-----------------------------------------------------------------------
function DsmMiyazaki() {
  // this.extent = transformE([139.58528152735363,35.46939934433827, 139.6614082402578,35.42134925811986])
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://maps.gsi.go.jp/xyz/d1-no799/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    minZoom: 11,
    maxZoom: 14
  })
}
const dsmMiyazakiobj = {};
for (let i of mapsStr) {
  dsmMiyazakiobj[i] = new TileLayer(new DsmMiyazaki())
}
// 北海道実測切図-----------------------------------------------------------------------
function Jissokukirizu() {
  this.extent = transformE([138.0879731958565,45.59637701059333, 146.65316610940792,40.971791021489395])
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/jissoku/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    maxZoom: 14
  })
}
const jissokuSumm = '<div style="width: 200px;"><a href="https://ckan.hoda.jp/dataset/hokkaidojisoku/resource/9e500d9a-1047-453c-8d31-a0acdbcacda3" target="_blank">北海道オープンデータプラットフォーム</a><br>' +
    '「北海道実測切図」は、北海道庁が1886（明治19）年からおよそ10年をかけて行った地形測量事業の成果として、1890（明治23）年から順次印刷・刊行された20万分の1地図（全32枚）である。</div>'
const jissokukirizu1obj = {};
for (let i of mapsStr) {
  jissokukirizu1obj[i] = new TileLayer(new Jissokukirizu())
}

function Jissokumatsumae() {
  this.extent = transformE([140.00435056635197,41.49701637286995, 140.33566671196516,41.37472447292248])
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/jissokumatsumae/{z}/{x}/{y}.png',
    crossOrigin: 'anonymous',
    maxZoom: 14
  })
}
const jissokukirizuMatsumaeobj = {};
for (let i of mapsStr) {
  jissokukirizuMatsumaeobj[i] = new TileLayer(new Jissokumatsumae())
}

const jissokukirizuobj = {};
for (let i of mapsStr) {
  jissokukirizuobj[i] = new LayerGroup({
    layers: [
      jissokukirizu1obj[i],
      jissokukirizuMatsumaeobj[i]
    ]
  })
}


// // Bing-----------------------------------------------------------------------
// const bingStyles = [
//   'RoadOnDemand',
//   'Aerial',
//   'AerialWithLabelsOnDemand',
//   'CanvasDark',
//   'OrdnanceSurvey',
// ];
// function Bing(i) {
//   this.preload = Infinity
//   this.source = new BingMaps({
//     key: 'AjNVFf2SArbxTVL45IzERWpNhf9gbY7xLIymRb8t4FC9y77ww2wd90QkKvF5Lan-',
//     imagerySet: bingStyles[i],
//     culture: 'ja-JP',
//     maxZoom: 19
//   })
// }
// const bingSumm = ''
// const bingRoadobj = {};
// for (let i of mapsStr) {
//   bingRoadobj[i] = new TileLayer(new Bing(0))
// }
// const bingAerialobj = {};
// for (let i of mapsStr) {
//   bingAerialobj[i] = new TileLayer(new Bing(1))
// }
// const bingAerialLabelobj = {};
// for (let i of mapsStr) {
//   bingAerialLabelobj[i] = new TileLayer(new Bing(2))
// }

// 東京市火災動態地図大正12年.---------------------------------------------------------------
function Tokyokasai() {
  this.preload = Infinity
  this.source = new XYZ({
    url: 'https://kenzkenz3.xsrv.jp/tokyokasai/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const tokyokasaiObj = {};
for (let i of mapsStr) {
  tokyokasaiObj[i] = new TileLayer(new Tokyokasai())
}
const tokyokasaiSumm = '出典：<br>東京市火災動態地図大正12年';

// ヤマシロマップ.---------------------------------------------------------------
function Yamashiro() {
  this.extent = transformE([135.6138532328336,35.15184602474456, 135.86223115203072,34.86410905768055])
  this.preload = Infinity
  this.source = new XYZ({
    // url: 'https://mapwarper.h-gis.jp/maps/tile/5643/{z}/{x}/{y}.png',
    url: 'https://kenzkenz3.xsrv.jp/yamashiro/{z}/{x}/{y}.png',
    crossOrigin: 'Anonymous',
    minZoom: 1,
    maxZoom: 17
  })
}
const yamashiroObj = {};
for (let i of mapsStr) {
  yamashiroObj[i] = new TileLayer(new Yamashiro())
}
const yamashiroSumm = '出典：<br><a href="https://mapwarper.h-gis.jp/maps/5643" target="_blank">日本版 Map Warper</a>';


// ここにレイヤーを全部書く。クリックするとストアのlayerListに追加されていく-------------------------
export const Layers =
  [
    { text: '疎空間指標', data: { id: "jinko1km", layer: LayersMvt.mesh1kmObj, opacity: 1, summary: LayersMvt.mesh1kmObjSumm, component: {name: 'jinko', values:[]} } },
    { text: '国土地理院',
      children: [
        { text: '標準地図', data: { id: 1, layer: stdObj, opacity: 1, summary: stdSumm } },
        { text: '淡色地図', data: { id: 2, layer: paleObj, opacity: 1, summary: paleSumm } },
        { text: 'モノクロ地図', data: { id: 'monochrome', layer: paleGrayObj, opacity: 1, summary: paleSumm } },
        { text: '白地図', data: { id: 3, layer: blankObj, opacity: 1, summary: blankSumm } },
        { text: '色別標高図', data: { id: 4, layer: reliefObj, opacity: 1, summary: reliefSumm } },
        { text: '陰影起伏図', data: { id: 'inei', layer: ineiObj, opacity: 1, summary: stdSumm } },
        { text: '傾斜量図', data: { id: 'keisya', layer: keisyaObj, opacity: 1, summary: stdSumm } },
        { text: '明治期の低湿地', data: { id: 'sitti', layer: sittiObj, opacity: 1, summary: stdSumm } },
        { text: '治水地形分類図 更新版（2007年以降）', data: { id: 'tisui2007', layer: tisui2007Obj, opacity: 1, summary: tisui2007Summ } },
        { text: '地形分類（自然地形）', data: { id: 'sizen', layer: LayersMvt.sizentikei0Obj, opacity: 1, summary: LayersMvt.sizentikeiSumm} },
        // { text: '地形分類（自然地形『詳細版』）', data: { id: 'sizen', layer: LayersMvt.sizentikeiObj, opacity: 1, summary: LayersMvt.sizentikeiSumm} },
        { text: '地形分類（人工地形）', data: { id: "zinkoutikei", layer: LayersMvt.zinkoutikeiObj, opacity: 1, summary: LayersMvt.sizentikeiSumm } },
        { text: '土地利用図（1982～1983年）', data: { id: "totiriyouzu", layer: totiriyouzuObj, opacity: 1, summary: totiriyouzuSumm } },
        { text: '数値地図25000（土地条件）', data: { id: "suuti25000", layer: suuti25000Obj, opacity: 1, summary: suuti25000Summ } },
      ]},
    { text: '小中学校、幼稚園、保育園、医療機関',
      children: [
        { text: '中学校',
          children: [
            { text: 'R05中学校区', data: { id: "tyuugakkoukur05", layer: LayersMvt.tyugakkokuR05Obj, opacity: 1, summary: LayersMvt.tyugakkokuR05Summ, component: {name: 'tyugakkoR05', values:[]} } },
            { text: 'R03中学校区', data: { id: "tyuugakkouku", layer: LayersMvt.tyuugakkouku0Obj, opacity: 1, summary: LayersMvt.tyuugakkoukuSumm, component: {name: 'tyugakkoR03', values:[]} } },
          ]},
        { text: '小学校',
          children: [
            { text: 'R05小学校区', data: { id: "syougakkoukur05", layer: LayersMvt.syougakkoukuR05Obj, opacity: 1, summary: LayersMvt.syougakkoukuR05Summ,component: {name: 'syogakkoR05', values:[]} } },
            { text: 'R03小学校区', data: { id: "syougakkouku", layer: LayersMvt.syougakkouku0Obj, opacity: 1, summary: LayersMvt.syougakkoukuSumm,component: {name: 'syogakkoR03', values:[]} } },

          ]},
        { text: '幼稚園、保育園',
          children: [
              { text: 'R03幼稚園、保育園', data: { id: "yochienhoikuen", layer: LayersMvt.yochienHoikuenObj, opacity: 1, summary: LayersMvt.yochienHoikuenSumm } },
          ]},
        { text: '医療機関',
          children: [
            { text: 'R02医療機関', data: { id: "iryo", layer: LayersMvt.iryoObj, opacity: 1, summary: LayersMvt.iryoSumm } },
          ]},
      ]},
    { text: '全国Q地図',
      children: [
        { text: '過去の地理院地図（全国Q地図）',
          children: [
            { text: '2020年9月27日～10月7日時点', data: { id: 'q2020', layer: q2020Obj, opacity: 1, summary: qSumm } },
            { text: '2021年9月29日～10月7日時点', data: { id: 'q2021', layer: q2021Obj, opacity: 1, summary: qSumm } },
            { text: '2022年9月30日時点', data: { id: 'q2022', layer: q2022Obj, opacity: 1, summary: qSumm } },
            { text: '2023年9月30日時点', data: { id: 'q2023', layer: q2023Obj, opacity: 1, summary: qSumm } },
          ]},
        { text: ' 全国ため池マップ', data: { id: "qtameike", layer: LayersMvt.qTameike0Obj, opacity: 1, summary: LayersMvt.qSumm2} },
      ]},
    { text: '航空写真',
      children: [
        // { text: 'Bing Maps Aerial', data: { id: 'bing', layer: bingAerialobj, opacity: 1, summary: bingSumm } },
        // { text: 'Bing Maps Aerial(地名あり)', data: { id: 'binglabel', layer: bingAerialLabelobj, opacity: 1, summary: bingSumm } },
        { text: '全国最新写真', data: { id: 'zenkokusaisin', layer: seamlessphotoObj, opacity: 1, summary: seamlessphotoSumm } },
        { text: '宮崎県航空写真', data: { id: 6, layer: miyazakiOrtObj, opacity: 1, zoom:9, center: [131.42386188579064, 31.911063477361182], summary: miyazakiOrtSumm } },
        { text: '静岡県航空写真', data: { id: 7, layer: sizuokaOrtObj, opacity: 1, zoom:12,center:[138.43674074146253, 35.052859245538755], summary: sizuokaOrtSumm } },
        { text: '室蘭市航空写真', data: { id: 'muroransiort', layer: muroransiOrtObj, opacity: 1, zoom:13,center:[140.97759620387416, 42.35223030295967], summary: muroransiOrtSumm } },
        { text: '糸魚川市航空写真', data: { id: 'itoiOrt', layer: itoiOrtObj, opacity: 1, zoom:12,center:[137.862,37.039501], summary: itoiOrtSumm } },
        { text: '練馬区航空写真', data: { id: 'nerimaOrt', layer: nerimaOrtObj, opacity: 1, zoom:13,center:[139.6202217042446, 35.746911721247685], summary: nerimaOrtSumm } },
        { text: '深谷市航空写真', data: { id: 'fukayaOrt', layer: fukayaOrtObj, opacity: 1, zoom:13,center:[139.26120936870575, 36.18044647223677], summary: fukayaOrtSumm } },
        { text: '厚木市航空写真', data: { id: 'atugiOrt', layer: atugiOrtObj, opacity: 1, zoom:12,center:[139.30477798325904, 35.45374856324422], summary: atugiOrtSumm } },
        { text: '掛川市航空写真', data: { id: 'kakegawaOrt', layer: kakegawaOrtObj, opacity: 1, zoom:12,center:[138.01527201622224, 34.76907462604038], summary: kakegawaOrtSumm } },
        { text: '半田市航空写真', data: { id: 'handaOrt', layer: handaOrtObj, opacity: 1, zoom:13,center:[136.938067, 34.89169], summary: handaOrtSumm } },
        { text: '富田林市航空写真', data: { id: 'tondaOrt', layer: tondaOrtObj, opacity: 1, zoom:13,center:[135.60006642031433, 34.50010582072453], summary: tondaOrtSumm } },
        { text: '鹿児島市航空写真', data: { id: 'kagosimasiort', layer: kagosimasiOrtObj, opacity: 1, zoom:12,center:[130.51208842259823, 31.58146097086727], summary: kagosimasiOrtSumm } },
        { text: 'PLATEAUオルソ', data: { id: 'plateauOrt', layer: plateauOrtObj, opacity: 1, summary: plateauOrtObjSumm } },
      ]},
    { text: '過去の航空写真',
      children: [
        // { text: '2010年航空写真', data: { id: 'sp10', layer: sp10Obj, opacity: 1, summary: sp10Summ } },
        { text: '1987~90年航空写真(一部)', data: { id: 'sp87', layer: sp87Obj, opacity: 1, summary: sp87Summ } },
        { text: '1984~86年航空写真(一部)', data: { id: 'sp84', layer: sp84Obj, opacity: 1, summary: sp84Summ } },
        { text: '1979~83年航空写真(一部)', data: { id: 'sp79', layer: sp79Obj, opacity: 1, summary: sp79Summ } },
        { text: '1974~78年航空写真(全国)', data: { id: 'sp74', layer: sp74Obj, opacity: 1, summary: sp74Summ } },
        { text: '1961~64年航空写真(一部)', data: { id: 'sp61', layer: sp61Obj, opacity: 1, summary: sp61Summ } },
        { text: '1945~50年航空写真(一部)', data: { id: 'sp45', layer: sp45Obj, opacity: 1, summary: sp45Summ } },
        { text: '1936~42年航空写真(一部)', data: { id: 'sp36', layer: sp36Obj, opacity: 1, summary: sp36Summ } },
        { text: '1928年航空写真(大阪府)', data: { id: 'sp28', layer: sp28Obj, opacity: 1, summary: sp28Summ } },
      ]},
    { text: '立体図、地質図等',
      children: [
        // { text: 'シームレス地質図', data: { id: 'seamless', layer: seamlessObj, opacity: 1, summary: seamlessSumm,component: {name: 'seamless', values:[]} } },
        { text: 'シームレス地質図', data: { id: 'seamless', layer: seamelesChisituObj, opacity: 1, summary: seamlessSumm } },

        { text: '河川', data: { id: "kasen", layer: LayersMvt.kasenLine0Obj, opacity: 1, summary: LayersMvt.kasenLineSumm } },
        { text: '川だけ地形地図', data: { id: 'kawadake', layer: kawadakeObj, opacity: 1, summary: kawadakeSumm } },
        { text: '川と流域地図', data: { id: 'ryuuiki', layer: ryuuikiObj, opacity: 1, summary: ryuuikiSumm } },
        { text: 'エコリス植生図', data: { id: 'ecoris', layer: ecorisObj, opacity: 1, summary: ecorisSumm } },
        { text: '日本土壌インベントリー', data: { id: "dojyou", layer: dojyouObj, opacity: 1, summary: dojyouSumm } },
        // { text: '日本CS立体図', data: { id: 'jcs', layer: nihonCsObj, opacity: 1, summary: nihonCsSumm } },
        // { text: '全国CS立体図10m', data: { id: 'cs10', layer: cs10mObj, opacity: 1, summary: cs10mSumm } },
        { text: '東京都陰陽図', data: { id: 'tamainyou', layer: tamainyouObj, opacity: 1, zoom:11, center:[139.25439119338986, 35.6997080831123], summary: tamainyouSumm } },
        { text: '東京都赤色立体地図', data: { id: 'tamared', layer: tamaredObj, opacity: 1, zoom:11, center:[139.25439119338986, 35.6997080831123], summary: tamaredSumm } },
        { text: '東京都CS立体図テスト', data: { id: 'tamacs', layer: tokyoCsObj, opacity: 1, zoom:11, center:[139.25439119338986, 35.6997080831123], summary: tamaCsSumm } },
        { text: 'CS立体図全部', data: { id: 'cs00', layer: cs00Obj, opacity: 1, summary: tamainyouSumm } },
        { text: '栃木県CS立体図', data: { id: 'tochigcs', layer: tochigicsObj, opacity: 1, zoom:10, center:[139.7261306915493, 36.67065922020146], summary: tochigicsSumm } },
        { text: '岐阜県CS立体図', data: { id: 'gcs', layer: gihuCsObj, opacity: 1, zoom:9, center:[137.03491577372932, 35.871742161031975], summary: gihuCsSumm } },
        { text: '兵庫県CS立体図（2010〜2018）', data: { id: 'hyougocs', layer: hyougoCsObj, opacity: 1, zoom:9, center:[134.8428381533734, 35.05148520051671], summary: hyougoCsSumm } },
        // { text: '兵庫県CS立体図50cm', data: { id: 'hyougocs50cm', layer: hyougoCs50Obj, opacity: 1, zoom:9, center:[134.8428381533734, 35.05148520051671], summary: hyougoCs50Summ } },
        { text: '兵庫県CS立体図（2023 0.5m）', data: { id: 'hyougocs50cm2', layer: hyougoCs50c2Obj, opacity: 1, zoom:9, center:[134.8428381533734, 35.05148520051671], summary: hyougoCs50c2Summ } },
        { text: '長野県CS立体図', data: { id: 'naganocs', layer: naganoCsObj, opacity: 1, zoom:9, center:[138.14880751631608, 36.19749617538284], summary: naganoCsSumm } },
        { text: '静岡県CS立体図', data: { id: 'sizuokacs2', layer: sizuokaCs2Obj, opacity: 1, zoom:9, center:[138.26385867875933, 35.01475223050842], summary: sizuokaCs2Summ } },
        { text: '広島県CS立体図（林野庁0.5m）', data: { id: 'hiroshimacs', layer: hiroshimaCsObj, opacity: 1, zoom:9, center:[132.77140492854667, 34.41276234214364], summary: hiroshimaCsSumm } },
        { text: '広島県CS立体図（広島県1m）', data: { id: 'hiroshimacs2', layer: hiroshimaCsObj2, opacity: 1, zoom:9, center:[132.77140492854667, 34.41276234214364], summary: hiroshimaCs2Summ } },
        { text: '広島県CS立体図（広島県0.5m）', data: { id: 'hiroshimacs3', layer: hiroshimaCsObj3, opacity: 1, zoom:9, center:[132.77140492854667, 34.41276234214364], summary: hiroshimaCs2Summ } },

        { text: '岡山県CS立体図', data: { id: 'okayamacs', layer: okayamaCsObj, opacity: 1, zoom:9, center:[133.5767769813538, 34.736393137403084], summary: okayamaCsSumm } },
        { text: '福島県CS立体図', data: { id: 'fukushimacs', layer: fukushimaCsObj, opacity: 1, zoom:9, center:[140.6180906295776, 37.49835474973223], summary: fukushimaCsSumm } },
        { text: '愛媛県CS立体図', data: { id: 'ehimeocs', layer: ehimeCsObj, opacity: 1, zoom:9, center:[132.77042984962463, 33.49503407703915], summary: ehimeCsSumm } },
        { text: '高知県CS立体図', data: { id: 'kochiocs', layer: kochiCsObj, opacity: 1, zoom:9, center:[133.00989747047424, 33.4075764357881], summary: kochiCsSumm } },
        { text: '熊本県・大分県CS立体図', data: { id: 'kumamotocs', layer: kumamotoCsObj, opacity: 1, zoom:9, center:[131.08264176666347, 32.86696607176184], summary: kumamotoCsSumm } },
        { text: '大阪府CS立体図', data: { id: 'osakacs', layer: osakaCsObj, opacity: 1, zoom:9, center:[135.5167507309548, 34.68490347466543], summary: osakaCsSumm } },
        { text: '和歌山県CS立体図', data: { id: 'wakayamacs', layer: wakayamaCsObj, opacity: 1, zoom:9, center:[135.52473298498347,33.913180427499256], summary: wakayamaCsSumm } },

        { text: '能登CS立体図', data: { id: 'notocs', layer: notoCsObj, opacity: 1, zoom:9, center:[136.9312018478913, 37.22961765479215], summary: notoCsSumm } },
        { text: '能登西部赤色立体地図', data: { id: 'notoseibu', layer: notoSeibuObj, opacity: 1, zoom:9, center:[136.9312018478913, 37.22961765479215], summary: notoSeubuSumm } },
        { text: '兵庫県遺跡立体図',
          children: [
            { text: '摩耶山城', data: { id: 'mayasanjyou', layer: mayasanjyouObj, opacity: 1, zoom:17, center:[135.20985199593505, 34.72741190512792], summary: hyougoIsekiSumm } },
            { text: '滝山城', data: { id: 'takiyamajyou', layer: takiyamajyouObj, opacity: 1, zoom:16, center:[135.1897115742397, 34.708324634323816], summary: hyougoIsekiSumm } },
            { text: '山下城', data: { id: 'yamasitajyou', layer: yamashitajyouObj, opacity: 1, zoom:17, center:[135.4093350403387, 34.900789307859384], summary: hyougoIsekiSumm } },
            { text: '有子山城', data: { id: 'arikoyamajyou', layer: arikoyamajyouObj, opacity: 1, zoom:17, center:[134.87834538212564, 35.45526548044384], summary: hyougoIsekiSumm } },
            { text: '八木城', data: { id: 'yagijyou', layer: yagijyouObj, opacity: 1, zoom:17, center:[134.71133629505152, 35.389083335934004], summary: hyougoIsekiSumm } },
            { text: '此隅山城', data: { id: 'konosumiyamajyou', layer: konosumiyamaObj, opacity: 1, zoom:17, center:[134.87248539581336, 35.487058618648106], summary: hyougoIsekiSumm } },
            { text: '岩尾城', data: { id: 'iwaojyou', layer: iwaojyouObj, opacity: 1, zoom:17, center:[134.97477380615132, 35.09959197988046], summary: hyougoIsekiSumm } },
            { text: '黒井城', data: { id: 'kuroijyou', layer: kuroijyouObj, opacity: 1, zoom:17, center:[135.104463141811, 35.17901861202279], summary: hyougoIsekiSumm } },
            { text: '篠山城', data: { id: 'sasayamajyou', layer: sasayamajyouObj, opacity: 1, zoom:17, center:[135.2176231845597, 35.07313601425689], summary: hyougoIsekiSumm } },
            { text: '八上城', data: { id: 'yakamijyou', layer: yakamijyouObj, opacity: 1, zoom:17, center:[135.2552485425144, 35.06204731412491], summary: hyougoIsekiSumm } },
            { text: '洲本城', data: { id: 'sumotojyou', layer: sumotojyouObj, opacity: 1, zoom:17, center:[134.90319944266878, 34.337478918073074], summary: hyougoIsekiSumm } },
            { text: '白巣城', data: { id: 'shirasujyou', layer: shirasujyouObj, opacity: 1, zoom:17, center:[134.8259033029899, 34.38150414125458], summary: hyougoIsekiSumm } },
            { text: '由良古城', data: { id: 'yurakojyou', layer: yurakojyouuObj, opacity: 1, zoom:17, center:[134.9480666440312, 34.2959981627496], summary: hyougoIsekiSumm } },
            { text: '炬口城', data: { id: 'takenokuchijyou', layer: takenokuchiObj, opacity: 1, zoom:17, center:[134.8898952135649, 34.35267276116555], summary: hyougoIsekiSumm } },
            { text: '竹田城・観音寺山城', data: { id: 'takedajyou', layer: takedajyouObj, opacity: 1, zoom:17, center:[134.82901156539475, 35.30050695947483], summary: hyougoIsekiSumm } },
            { text: '有岡城', data: { id: 'ariokajyou', layer: ariokajyouObj, opacity: 1, zoom:17, center:[135.42095254641023, 34.78123344214727], summary: hyougoIsekiSumm } },
            { text: '感状山城', data: { id: 'kanjyousanjyou', layer: kanjyousanjyouObj, opacity: 1, zoom:17, center:[134.45129592319765, 34.88099338453634], summary: hyougoIsekiSumm } },
            { text: '鶏籠山城（龍野古城）', data: { id: 'keirousanjyou', layer: keirousanjyouObj, opacity: 1, zoom:17, center:[134.54521904569506, 34.87164477770631], summary: hyougoIsekiSumm } },
            { text: '三木城', data: { id: 'mikijyou', layer: mikijyouObj, opacity: 1, zoom:17, center:[134.98743099511933, 34.79910988651466], summary: hyougoIsekiSumm } },
            { text: '篠の丸城', data: { id: 'sasanomarujyou', layer: sasanomarujyouObj, opacity: 1, zoom:17, center:[134.53574276742006, 35.01356494052959], summary: hyougoIsekiSumm } },
            { text: '小谷城', data: { id: 'kodanijyou', layer: kodanijyouObj, opacity: 1, zoom:17, center:[134.8319333497427, 34.945512107423895], summary: hyougoIsekiSumm } },
            { text: '上月城', data: { id: 'koudukijyou', layer: koudukijyouObj, opacity: 1, zoom:17, center:[134.32357851200157, 34.97535169002647], summary: hyougoIsekiSumm } },
            { text: '城山城', data: { id: 'kinoyamajyou', layer: kinoyamajyouObj, opacity: 1, zoom:17, center:[134.52762221800918, 34.89462795246601], summary: hyougoIsekiSumm } },
            { text: '仁井山城', data: { id: 'niisanjyou', layer: niisanjyouObj, opacity: 1, zoom:17, center:[134.33284507693375, 34.9790563824087], summary: hyougoIsekiSumm } },
            { text: '赤穂城', data: { id: 'akoujyou', layer: akoujyouObj, opacity: 1, zoom:17, center:[134.3888453601225, 34.74598150175633], summary: hyougoIsekiSumm } },
            { text: '置塩城', data: { id: 'oshiojyou', layer: oshiojyouObj, opacity: 1, zoom:17, center:[134.6830576345791, 34.92332845324563], summary: hyougoIsekiSumm } },
            { text: '中道子山城', data: { id: 'tyuudousisanjyou', layer: tyuudousisanjyouObj, opacity: 1, zoom:17, center:[134.85475696735378, 34.83149611922066], summary: hyougoIsekiSumm } },
            { text: '播磨高倉山城', data: { id: 'takakurayamajyou', layer: takakurayamajyouObj, opacity: 1, zoom:17, center:[134.355514070868, 34.978895498696204], summary: hyougoIsekiSumm } },
            { text: '白旗城', data: { id: 'shirohatajyou', layer: shirohatajyouObj, opacity: 1, zoom:17, center:[134.38063468592168, 34.90809762405915], summary: hyougoIsekiSumm } },
            { text: '姫路城', data: { id: 'himejijyou', layer: himejijyouObj, opacity: 1, zoom:17, center:[134.69313061573334, 34.83893632057601], summary: hyougoIsekiSumm } },
            { text: '明石城', data: { id: 'akashijyou', layer: akashijyouObj, opacity: 1, zoom:17, center:[134.9927713856956, 34.65286024595012], summary: hyougoIsekiSumm } },
            { text: '利神城', data: { id: 'rikanjyou', layer: rikanjyouObj, opacity: 1, zoom:17, center:[134.37733576935972, 35.04615261130358], summary: hyougoIsekiSumm } },
          ]},
        { text: '栃木県レーザ林相図', data: { id: 'tochigirinsou', layer: tochigiRinsouObj, opacity: 1, zoom:10, center:[139.7261306915493, 36.67065922020146], summary: tochigiRinsouSumm } },
        { text: '兵庫県レーザ林相図', data: { id: 'hyougorinsou', layer: hyougoRinsouObj, opacity: 1, zoom:9, center:[134.8428381533734, 35.05148520051671], summary: hyougoRinsouSumm } },
        { text: '高知県レーザ林相図', data: { id: 'kochirinsou', layer: kochiRinsouObj, opacity: 1, zoom:9, center:[133.00989747047424, 33.4075764357881], summary: kochiRinsouSumm } },
        { text: '都市圏活断層図', data: { id: 'katudansou', layer: katudansouObj, opacity: 1, summary: katudansouSumm } }
      ]},
    { text: '古地図等',
      children: [
        { text: '戦前の旧版地形図',
          children: [
            { text: '戦前地形図5万分の１', data: { id: 'mw5', layer: mw5Obj, opacity: 1, summary: mw5Summ } },
            { text: '戦前地形図20万分の１', data: { id: 'mw20', layer: mw20Obj, opacity: 1, summary: mw20Summ } },
          ]},
        { text: '迅速測図',
          children: [
            { text: '迅速測図 (関東:明治初期〜中期)', data: { id: 'jinsoku', layer: jinsokuObj, opacity: 1, zoom: 9, center: [139.8089637733657, 35.86926927958841], summary: jinsokuSumm } },
            { text: '迅速測図 (福岡近傍:1894年)', data: { id: 'jinsokuFukuoka', layer: jinsokuFukuokaObj, opacity: 1, zoom: 10, center: [130.58321667263124,33.488150208361034], summary: jinsokuFukuokaSumm } },
            { text: '迅速測図 (小倉近傍:1887年)', data: { id: 'jinsokuKokura', layer: jinsokuKokuraObj, opacity: 1, zoom: 10, center: [130.72664413663782,33.71443966453748], summary: jinsokuKokuraSumm } },
          ]},
        { text: '大正13,14年古地図',
          children: [
            { text: '大正古地図全て', data: { id: 'kotizu00', layer: kotizu00Obj, opacity: 1, summary: kotizu00Summ } },
            { text: '01北海道古地図', data: { id: 'kotizu01hokkaidou', layer: kotizu01hokkaidouObj, opacity: 1, zoom: 8, center: [142.6944008210318, 43.241646716680606], summary: kotizu01hokkaidouSumm } },
            { text: '東北',
              children: [
                { text: '02青森県古地図(大正13年)', data: { id: 'kotizu01aomori', layer: kotizu01aomoriObj, opacity: 1, zoom: 9, center: [140.67520521398887, 40.84152054620705], summary: kotizu01aomoriSumm } },
                { text: '03岩手県古地図(大正14年)', data: { id: 'kotizu03iwate', layer: kotizu03iwateObj, opacity: 1, zoom: 9, center: [141.40762710839144, 39.6512878209730], summary: kotizu03iwateSumm } },
                { text: '04宮城県古地図(大正14年)', data: { id: 'kotizu04miyagi', layer: kotizu04miyagiObj, opacity: 1, zoom: 9, center: [140.91324236659926, 38.49277272507115], summary: kotizu04miyagiSumm } },
                { text: '05秋田県古地図(大正13年)', data: { id: 'kotizu05akita', layer: kotizu05akitaObj, opacity: 1, zoom: 9, center: [140.342563594382, 39.746736192608324], summary: kotizu05akitaSumm } },
                { text: '06山形県古地図(大正13年)', data: { id: 'kotizu06yamagata', layer: kotizu06yamagataObj, opacity: 1, zoom: 9, center: [140.09842298137926, 38.50471461587239], summary: kotizu06yamagataSumm } },
                { text: '07福島県古地図(大正13年)', data: { id: 'kotizu07hukusima', layer: kotizu07hukusimaObj, opacity: 1, zoom: 9, center: [140.23376849960238, 37.48454580025047], summary: kotizu07hukusimaSumm } },
              ]},
            { text: '関東',
              children: [
                { text: '08茨城県古地図(大正14年)', data: { id: 'kotizu08ibaraki', layer: kotizu08ibarakiObj, opacity: 1, zoom: 9, center: [140.33340833916677, 36.289055943305996], summary: kotizu08ibarakiSumm } },
                { text: '09栃木県古地図(大正14年)', data: { id: 'kotizu09tochigii', layer: kotizu09tochigiObj, opacity: 1, zoom: 9, center: [139.79935070783154, 36.67918938356935], summary: kotizu09tochigiSumm } },
                { text: '10群馬県古地図(大正14年)', data: { id: 'kotizu10gunma', layer: kotizu10gunmaObj, opacity: 1, zoom: 9, center: [138.96622079371627, 36.50767460653462], summary: kotizu10gunmaSumm } },
                { text: '11埼玉県古地図(大正14年)', data: { id: 'kotizu11saitama', layer: kotizu11saitamaObj, opacity: 1, zoom: 9, center: [139.35699844775343, 36.02985181257246], summary: kotizu11saitamaSumm } },
                { text: '12千葉県古地図(大正13年)', data: { id: 'kotizu12chiba', layer: kotizu12chibakenObj, opacity: 1, zoom: 9, center: [140.20538708670875, 35.48254193777967], summary: kotizu12chibakenSumm} },
                { text: '13東京都古地図(大正13年)', data: { id: 'kotizu13tokyo', layer: kotizu13tokyoObj, opacity: 1, zoom: 9, center: [139.42718884237084, 35.69596949636376], summary: kotizu13tokyoSumm} },
                { text: '14神奈川県古地図(大正13年)', data: { id: 'kotizu14kanagawa', layer: kotizu14kanagawaObj, opacity: 1, zoom: 9, center: [139.3234291109266, 35.432826032715724], summary: kotizu14kanagawaSumm} },
              ]},
            { text: '中部',
              children: [
                { text: '15新潟県古地図(大正14年)', data: { id: 'kotizu15niigata', layer: kotizu15niigataObj, opacity: 1, zoom: 9, center: [138.99994268118078, 37.516020514481625], summary: kotizu15niigataSumm} },
                { text: '16富山県古地図(大正14年)', data: { id: 'kotizu16toyama', layer: kotizu16toyamaObj, opacity: 1, zoom: 9, center: [137.21161264873257, 36.65177261122085], summary: kotizu16toyamaSumm } },
                { text: '17石川県古地図(大正14年)', data: { id: 'kotizu17isikawa', layer: kotizu17isikawaObj, opacity: 1, zoom: 9, center: [136.79657363135973, 36.81563789609989], summary: kotizu17isikawaSumm } },
                { text: '18福井県古地図(大正14年)', data: { id: 'kotizu18fukui', layer: kotizu18fukuiiObj, opacity: 1, zoom: 9, center: [136.18011838773094, 35.84206149629695], summary: kotizu18fukuiiSumm } },
                { text: '19山梨県古地図(大正14年)', data: { id: 'kotizu19yamanasi ', layer: kotizu19yamanasiObj, opacity: 1, zoom: 9, center: [138.6367835664595, 35.651345759735065], summary: kotizu19yamanasiSumm} },
                { text: '20長野県古地図(大正12年)', data: { id: 'kotizu20nagano ', layer: kotizu20naganoObj, opacity: 1, zoom: 9, center: [138.0020178500573, 36.126044472410726], summary: kotizu20naganoSumm} },
                { text: '21岐阜県古地図(大正14年)', data: { id: 'kotizu21gihu ', layer: kotizu21gihuObj, opacity: 1, zoom: 9, center: [137.08038704085405, 35.80494491384562], summary: kotizu21gihuSumm } },
                { text: '22静岡県古地図(大正14年)', data: { id: 'kotizu22sizuoka ', layer: kotizu22sizuokaObj, opacity: 1, zoom: 9, center: [138.35297002625663, 35.03149650164657], summary: kotizu22sizuokaSumm } },
                { text: '23愛知県古地図(大正14年)', data: { id: 'kotizu23aichi', layer: kotizu23aichiObj, opacity: 1, zoom: 9, center: [137.18109497674774, 34.9965045398574], summary: kotizu23aichiSumm } },
              ]},
            { text: '近畿',
              children: [
                { text: '24三重県古地図(大正13年)', data: { id: 'kotizu24mieken', layer: kotizu24miekenObj, opacity: 1, zoom: 9, center: [136.4149512041131, 34.49297614663594], summary: kotizu24miekenSumm } },
                { text: '25滋賀県古地図(大正14年)', data: { id: 'kotizu25sigaken', layer: kotizu25sigakenObj, opacity: 1, zoom: 9, center: [136.09146486741864, 35.25160121546057], summary: kotizu25sigakenSumm } },
                { text: '26京都府古地図(大正13年)', data: { id: 'kotizu26kyoutohu', layer: kotizu26kyoutohuObj, opacity: 1, zoom: 9, center: [135.49026856249452, 34.66057422989442], summary: kotizu26kyoutohuSumm } },
                { text: '27大阪府古地図(大正14年)', data: { id: 'kotizu27osaka', layer: kotizu27osakaObj, opacity: 1, zoom: 9, center: [135.49026856249452, 34.66057422989442], summary: kotizu27osakaSumm } },
                { text: '28兵庫県古地図(大正13年)', data: { id: 'kotizu28hyogo', layer: kotizu28hyogoObj, opacity: 1, zoom: 9, center: [134.83719229873228, 34.969500528403245], summary: kotizu28hyogoSumm } },
                { text: '29奈良県古地図(大正14年)', data: { id: 'kotizu29nara', layer: kotizu29naraObj, opacity: 1, zoom: 9, center: [135.40787110854197, 33.93779078075431], summary: kotizu29naraSumm } },
                { text: '30和歌山県古地図(大正14年)', data: { id: 'kotizu30wakayama', layer: kotizu30wakayamaObj, opacity: 1, zoom: 9, center: [135.40787110854197, 33.93779078075431], summary: kotizu30wakayamaSumm } },
              ]},
            { text: ' 中国',
              children: [
                { text: '31鳥取県古地図(大正14年)', data: { id: 'kotizu31tottori', layer: kotizu31tottoriObj, opacity: 1, zoom: 9, center: [133.86368161450991, 35.4283501390533], summary: kotizu31tottoriSumm } },
                { text: '32島根県古地図(大正14年)', data: { id: 'kotizu32shimane', layer: kotizu32shimaneObj, opacity: 1, zoom: 9, center: [132.38663070035244, 35.00200428279085], summary: kotizu32shimaneSumm } },
                { text: '33岡山県古地図(大正14年)', data: { id: 'kotizu33okayama', layer: kotizu33okayamaObj, opacity: 1, zoom: 9, center: [133.79959468951728, 34.87942275146696], summary: kotizu33okayamaSumm } },
                { text: '34広島県古地図(大正13年)', data: { id: 'kotizu34hiroshima', layer: kotizu34hiroshimaObj, opacity: 1, zoom: 9, center: [132.7589452109575, 34.56839937423835], summary: kotizu34hiroshimaSumm } },
                { text: '35山口県古地図(大正13年)', data: { id: 'kotizu35yamaguchi', layer: kotizu35yamaguchiObj, opacity: 1, zoom: 9, center: [131.59317370493247, 34.230980820797356], summary: kotizu35yamaguchiSumm } },
              ]},
            { text: '四国',
              children: [
                { text: '36徳島県古地図(大正14年)', data: { id: 'kotizu36tokusima', layer: kotizu36tokusimaObj, opacity: 1, zoom: 9, center: [134.2512548300351, 33.9377907341931], summary: kotizu36tokusimaSumm } },
                { text: '37香川県古地図(大正14年)', data: { id: 'kotizu37kagawa', layer: kotizu37kagawaObj, opacity: 1, zoom: 9, center: [133.99185542756558, 34.24107268786568], summary: kotizu37kagawaSumm } },
                { text: '38愛媛県古地図(大正14年)', data: { id: 'kotizu38ehime', layer: kotizu38ehimeObj, opacity: 1, zoom: 9, center: [132.83829096234632, 33.67406931001446], summary: kotizu38ehimeSumm } },
                { text: '39高知県古地図(大正14年)', data: { id: 'kotizu39kochi', layer: kotizu39kochiObj, opacity: 1, zoom: 9, center: [133.31741694236896, 33.536816779433096], summary: kotizu39kochiSumm } },
              ]},
            { text: '九州沖縄',
              children: [
                { text: '40福岡県古地図(大正14年)', data: { id: 'kotizu40fukuoka', layer: kotizu40fukuokaObj, opacity: 1, zoom: 9, center: [130.63423506830085, 33.52587808087998], summary: kotizu40fukuokaSumm } },
                { text: '41佐賀県古地図(大正14年)', data: { id: 'kotizu41saga', layer: kotizu41sagaObj, opacity: 1, zoom: 9, center: [130.09476057930058, 33.30502734026227], summary: kotizu41sagaSumm } },
                { text: '42長崎県古地図(大正13年)', data: { id: 'kotizu42nagasaki', layer: kotizu42nagasakiObj, opacity: 1, zoom: 9, center: [129.5362889506741, 33.11863979844799], summary: kotizu42nagasakiSumm } },
                { text: '43熊本県古地図(大正13年)', data: { id: 'kotizu43kumamoto', layer: kotizu43kumamotoObj, opacity: 1, zoom: 9, center: [130.76919910142672, 32.66250105798969], summary: kotizu43kumamotoSumm } },
                { text: '44大分県古地図(大正14年)', data: { id: 'kotizu44oita', layer: kotizu44oitaObj, opacity: 1, zoom: 9, center: [131.46499990110914, 33.22847774498263], summary: kotizu44oitaSumm } },
                { text: '45宮崎県古地図(大正14年)', data: { id: 'kotizu45miyazaki', layer: kotizu45miyazakiObj, opacity: 1, zoom: 9, center: [131.300204984101, 32.13427469145421], summary: kotizu45miyazakiSumm } },
                { text: '46鹿児島県古地図(大正14年)', data: { id: 'kotizu46kagosima', layer: kotizu46kagoshimaObj, opacity: 1, zoom: 9, center: [130.65933581726637, 31.600372394062873], summary: kotizu46kagoshimaSumm } },
                { text: '47沖縄県古地図(大正14年)', data: { id: 'kotizu47okinawa', layer: kotizu47okinawaObj, opacity: 1, zoom: 9, center: [127.85255774851787, 26.472759103562595], summary: kotizu47okinawaSumm } },
              ]}
          ]},
        { text: '今昔マップ',
          children: [
            { text: '首都圏',
              children: [
                { text: '首都圏1896-1909年', data: { id: 'kzTokyo502man', layer: kz_tokyo502manObj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1917-1924年', data: { id: 'kzTokyo5000', layer: kz_tokyo5000Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1927-1939年', data: { id: 'kzTokyo5001', layer: kz_tokyo5001Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1944-1954年', data: { id: 'kzTokyo5002', layer: kz_tokyo5002Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1965-1968年', data: { id: 'kzTokyo5003', layer: kz_tokyo5003Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1975-1978年', data: { id: 'kzTokyo5004', layer: kz_tokyo5004Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1983-1987年', data: { id: 'kzTokyo5005', layer: kz_tokyo5005Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1992-1995年', data: { id: 'kzTokyo5006', layer: kz_tokyo5006Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
                { text: '首都圏1998-2005年', data: { id: 'kzTokyo5007', layer: kz_tokyo5007Obj, opacity: 1, zoom: 11, center: [139.75150834001906, 35.68316789572537], summary: kzSumm } },
              ]},
            { text: '中京圏',
              children: [
                { text: '中京圏1888-1898年', data: { id: 'kzchukyo2man', layer: kz_chukyo2manObj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1920年', data: { id: 'kzchukyo00', layer: kz_chukyo00Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1932年', data: { id: 'kzchukyo01', layer: kz_chukyo01Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1937-1938年', data: { id: 'kzchukyo02', layer: kz_chukyo02Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1947年', data: { id: 'kzchukyo03', layer: kz_chukyo03Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1959-1960年', data: { id: 'kzchukyo04', layer: kz_chukyo04Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1968-1973年', data: { id: 'kzchukyo05', layer: kz_chukyo05Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1976-1980年', data: { id: 'kzchukyo06', layer: kz_chukyo06Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1984-1989年', data: { id: 'kzchukyo07', layer: kz_chukyo07Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
                { text: '中京圏1992-1996年', data: { id: 'kzchukyo08', layer: kz_chukyo08Obj, opacity: 1, zoom: 11, center: [136.87087367140046, 35.16811021239606], summary: kzSumm } },
              ]},
            { text: '京阪神圏',
              children: [
                { text: '京阪神圏1892-1910年', data: { id: 'kzkeihansin2man', layer: kz_keihansin2manObj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1922-1923年', data: { id: 'kzkeihansin00', layer: kz_keihansin00Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1927-1935年', data: { id: 'kzkeihansin01', layer: kz_keihansin01Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1947-1950年', data: { id: 'kzkeihansin02', layer: kz_keihansin02Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1954-1956年', data: { id: 'kzkeihansin03', layer: kz_keihansin03Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1961-1964年', data: { id: 'kzkeihansin03x', layer: kz_keihansin03xObj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1967-1970年', data: { id: 'kzkeihansin04', layer: kz_keihansin04Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1975-1979年', data: { id: 'kzkeihansin05', layer: kz_keihansin05Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1983-1988年', data: { id: 'kzkeihansin06', layer: kz_keihansin06Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
                { text: '京阪神圏1993-1997年', data: { id: 'kzkeihansin07', layer: kz_keihansin07Obj, opacity: 1, zoom: 11, center: [135.41893422603607, 34.68351530491641], summary: kzSumm } },
              ]},
            { text: '東北地方太平洋岸',
              children: [
                { text: '東北地方太平洋岸1901-1913年', data: { id: 'kztohoku_pacific_coast00', layer: kz_tohoku_pacific_coast00Obj, opacity: 1, zoom: 8, center: [141.46002531051636, 38.749782624323984], summary: kzSumm } },
                { text: '東北地方太平洋岸1949-1953年', data: { id: 'kztohoku_pacific_coast01', layer: kz_tohoku_pacific_coast01Obj, opacity: 1, zoom: 8, center: [141.46002531051636, 38.749782624323984], summary: kzSumm } },
                { text: '東北地方太平洋岸1969-1982年', data: { id: 'kztohoku_pacific_coast02', layer: kz_tohoku_pacific_coast02Obj, opacity: 1, zoom: 8, center: [141.46002531051636, 38.749782624323984], summary: kzSumm } },
                { text: '東北地方太平洋岸1990-2008年', data: { id: 'kztohoku_pacific_coast03', layer: kz_tohoku_pacific_coast03Obj, opacity: 1, zoom: 8, center: [141.46002531051636, 38.749782624323984], summary: kzSumm } },
              ]},
            { text: '関東',
              children: [
                { text: '関東1894-1915年', data: { id: 'kzkanto00', layer: kz_kanto00Obj, opacity: 1, zoom: 8, center: [139.51765537261963, 36.07055650766162], summary: kzSumm } },
                { text: '関東1928-1945年', data: { id: 'kzkanto01', layer: kz_kanto01Obj, opacity: 1, zoom: 8, center: [139.51765537261963, 36.07055650766162], summary: kzSumm } },
                { text: '関東1972-1982年', data: { id: 'kzkanto02', layer: kz_kanto02Obj, opacity: 1, zoom: 8, center: [139.51765537261963, 36.07055650766162], summary: kzSumm } },
                { text: '関東1988-2008年', data: { id: 'kzkanto03', layer: kz_kanto03Obj, opacity: 1, zoom: 8, center: [139.51765537261963, 36.07055650766162], summary: kzSumm } },
              ]},
            { text: '札幌',
              children: [
                { text: '札幌1916年', data: { id: 'kzsapporo00', layer: kz_sapporo00Obj, opacity: 1, zoom: 11, center: [141.2444177629186, 43.08518009009643], summary: kzSumm } },
                { text: '札幌1935年', data: { id: 'kzsapporo01', layer: kz_sapporo01Obj, opacity: 1, zoom: 11, center: [141.2444177629186, 43.08518009009643], summary: kzSumm } },
                { text: '札幌1950-1952年', data: { id: 'kzsapporo02', layer: kz_sapporo02Obj, opacity: 1, zoom: 11, center: [141.2444177629186, 43.08518009009643], summary: kzSumm } },
                { text: '札幌1975-1976年', data: { id: 'kzsapporo03', layer: kz_sapporo03Obj, opacity: 1, zoom: 11, center: [141.2444177629186, 43.08518009009643], summary: kzSumm } },
                { text: '札幌1995-1998年', data: { id: 'kzsapporo04', layer: kz_sapporo04Obj, opacity: 1, zoom: 11, center: [141.2444177629186, 43.08518009009643], summary: kzSumm } },
              ]},
            { text: '旭川',
              children: [
                { text: '旭川1916-1917年', data: { id: 'kzasahikawa00', layer: kz_asahikawa00Obj, opacity: 1, zoom: 11, center: [142.36552454028768, 43.77071349093413], summary: kzSumm } },
                { text: '旭川1950-1952年', data: { id: 'kzasahikawa01', layer: kz_asahikawa01Obj, opacity: 1, zoom: 11, center: [142.36552454028768, 43.77071349093413], summary: kzSumm } },
                { text: '旭川1972-1974年', data: { id: 'kzasahikawa02', layer: kz_asahikawa02Obj, opacity: 1, zoom: 11, center: [142.36552454028768, 43.77071349093413], summary: kzSumm } },
                { text: '旭川1986年', data: { id: 'kzasahikawa03', layer: kz_asahikawa03Obj, opacity: 1, zoom: 11, center: [142.36552454028768, 43.77071349093413], summary: kzSumm } },
                { text: '旭川1999-2001年', data: { id: 'kzasahikawa04', layer: kz_asahikawa04Obj, opacity: 1, zoom: 11, center: [142.36552454028768, 43.77071349093413], summary: kzSumm } },
              ]},
            { text: '釧路',
              children: [
                { text: '釧路1897年', data: { id: 'kzkushiro00', layer: kz_kushiro00Obj, opacity: 1, zoom: 11, center: [144.38210880613346, 42.985086573459], summary: kzSumm } },
                { text: '釧路1922年', data: { id: 'kzkushiro01', layer: kz_kushiro01Obj, opacity: 1, zoom: 11, center: [144.38210880613346, 42.985086573459], summary: kzSumm } },
                { text: '釧路1958年', data: { id: 'kzkushiro02', layer: kz_kushiro02Obj, opacity: 1, zoom: 11, center: [144.38210880613346, 42.985086573459], summary: kzSumm } },
                { text: '釧路1981年', data: { id: 'kzkushiro03', layer: kz_kushiro03Obj, opacity: 1, zoom: 11, center: [144.38210880613346, 42.985086573459], summary: kzSumm } },
                { text: '釧路2001年', data: { id: 'kzkushiro04', layer: kz_kushiro04Obj, opacity: 1, zoom: 11, center: [144.38210880613346, 42.985086573459], summary: kzSumm } },
              ]},
            { text: '帯広',
              children: [
                { text: '帯広1896年', data: { id: 'kzobihiro00', layer: kz_obihiro00Obj, opacity: 1, zoom: 11, center: [143.1966023069483, 42.92250696465973], summary: kzSumm } },
                { text: '帯広1930年', data: { id: 'kzobihiro01', layer: kz_obihiro01Obj, opacity: 1, zoom: 11, center: [143.1966023069483, 42.92250696465973], summary: kzSumm } },
                { text: '帯広1956-1957年', data: { id: 'kzobihiro02', layer: kz_obihiro02Obj, opacity: 1, zoom: 11, center: [143.1966023069483, 42.92250696465973], summary: kzSumm } },
                { text: '帯広1985年', data: { id: 'kzobihiro03', layer: kz_obihiro03Obj, opacity: 1, zoom: 11, center: [143.1966023069483, 42.92250696465973], summary: kzSumm } },
                { text: '帯広1998-2000年', data: { id: 'kzobihiro04', layer: kz_obihiro04Obj, opacity: 1, zoom: 11, center: [143.1966023069483, 42.92250696465973], summary: kzSumm } },
              ]},
            { text: '苫小牧',
              children: [
                { text: '苫小牧1896年', data: { id: 'kztomakomai00', layer: kz_tomakomai00Obj, opacity: 1, zoom: 11, center: [141.6173316620267, 42.77488271621584], summary: kzSumm } },
                { text: '苫小牧1935年', data: { id: 'kztomakomai01', layer: kz_tomakomai01Obj, opacity: 1, zoom: 11, center: [141.6173316620267, 42.77488271621584], summary: kzSumm } },
                { text: '苫小牧1954-1955年', data: { id: 'kztomakomai02', layer: kz_tomakomai02Obj, opacity: 1, zoom: 11, center: [141.6173316620267, 42.77488271621584], summary: kzSumm } },
                { text: '苫小牧1983-1984年', data: { id: 'kztomakomai03', layer: kz_tomakomai03Obj, opacity: 1, zoom: 11, center: [141.6173316620267, 42.77488271621584], summary: kzSumm } },
                { text: '苫小牧1993-1999年', data: { id: 'kztomakomai04', layer: kz_tomakomai04Obj, opacity: 1, zoom: 11, center: [141.6173316620267, 42.77488271621584], summary: kzSumm } },
              ]},
            { text: '室蘭',
              children: [
                { text: '室蘭1896年', data: { id: 'kzmuroran00', layer: kz_muroran00Obj, opacity: 1, zoom: 11, center: [140.97413684696426, 42.314688578391895], summary: kzSumm } },
                { text: '室蘭1917年', data: { id: 'kzmuroran01', layer: kz_muroran01Obj, opacity: 1, zoom: 11, center: [140.97413684696426, 42.314688578391895], summary: kzSumm } },
                { text: '室蘭1955年', data: { id: 'kzmuroran02', layer: kz_muroran02Obj, opacity: 1, zoom: 11, center: [140.97413684696426, 42.314688578391895], summary: kzSumm } },
                { text: '室蘭1986-1987年', data: { id: 'kzmuroran03', layer: kz_muroran03Obj, opacity: 1, zoom: 11, center: [140.97413684696426, 42.314688578391895], summary: kzSumm } },
                { text: '室蘭1998-2000年', data: { id: 'kzmuroran04', layer: kz_muroran04Obj, opacity: 1, zoom: 11, center: [140.97413684696426, 42.314688578391895], summary: kzSumm } },
              ]},
            { text: '函館',
              children: [
                { text: '函館1915年', data: { id: 'kzhakodate00', layer: kz_hakodate00Obj, opacity: 1, zoom: 11, center: [140.72930936750572, 41.76792949052427], summary: kzSumm } },
                { text: '函館1951-1955年', data: { id: 'kzhakodate01', layer: kz_hakodate01Obj, opacity: 1, zoom: 11, center: [140.72930936750572, 41.76792949052427], summary: kzSumm } },
                { text: '函館1968年', data: { id: 'kzhakodate02', layer: kz_hakodate02Obj, opacity: 1, zoom: 11, center: [140.72930936750572, 41.76792949052427], summary: kzSumm } },
                { text: '函館1986-1989年', data: { id: 'kzhakodate03', layer: kz_hakodate03Obj, opacity: 1, zoom: 11, center: [140.72930936750572, 41.76792949052427], summary: kzSumm } },
                { text: '函館1996-2001年', data: { id: 'kzhakodate04', layer: kz_hakodate04Obj, opacity: 1, zoom: 11, center: [140.72930936750572, 41.76792949052427], summary: kzSumm } },
              ]},
            { text: '青森',
              children: [
                { text: '青森1912年', data: { id: 'kzaomori00', layer: kz_aomori00Obj, opacity: 1, zoom: 11, center: [140.7419488576039, 40.82431593920569], summary: kzSumm } },
                { text: '青森1939-1955年', data: { id: 'kzaomori01', layer: kz_aomori01Obj, opacity: 1, zoom: 11, center: [140.7419488576039, 40.82431593920569], summary: kzSumm } },
                { text: '青森1970年', data: { id: 'kzaomori02', layer: kz_aomori02Obj, opacity: 1, zoom: 11, center: [140.7419488576039, 40.82431593920569], summary: kzSumm } },
                { text: '青森1984-1989年', data: { id: 'kzaomori03', layer: kz_aomori03Obj, opacity: 1, zoom: 11, center: [140.7419488576039, 40.82431593920569], summary: kzSumm } },
                { text: '青森2003-2011年', data: { id: 'kzaomori04', layer: kz_aomori04Obj, opacity: 1, zoom: 11, center: [140.7419488576039, 40.82431593920569], summary: kzSumm } },
              ]},
            { text: '弘前',
              children: [
                { text: '弘前1912年', data: { id: 'kzhirosaki00', layer: kz_hirosaki00Obj, opacity: 1, zoom: 11, center: [140.46437921304084, 40.60239845412971], summary: kzSumm } },
                { text: '弘前1939年', data: { id: 'kzhirosaki01', layer: kz_hirosaki01Obj, opacity: 1, zoom: 11, center: [140.46437921304084, 40.60239845412971], summary: kzSumm } },
                { text: '弘前1970-1971年', data: { id: 'kzhirosaki02', layer: kz_hirosaki02Obj, opacity: 1, zoom: 11, center: [140.46437921304084, 40.60239845412971], summary: kzSumm } },
                { text: '弘前1980-1986年', data: { id: 'kzhirosaki03', layer: kz_hirosaki03Obj, opacity: 1, zoom: 11, center: [140.46437921304084, 40.60239845412971], summary: kzSumm } },
                { text: '弘前1994-1997年', data: { id: 'kzhirosaki04', layer: kz_hirosaki04Obj, opacity: 1, zoom: 11, center: [140.46437921304084, 40.60239845412971], summary: kzSumm } },
              ]},
            { text: '盛岡',
              children: [
                { text: '盛岡1811-1912年', data: { id: 'kzmorioka00', layer: kz_morioka00Obj, opacity: 1, zoom: 11, center: [141.15443789282295, 39.70194827035462], summary: kzSumm } },
                { text: '盛岡1939年', data: { id: 'kzmorioka01', layer: kz_morioka01Obj, opacity: 1, zoom: 11, center: [141.15443789282295, 39.70194827035462], summary: kzSumm } },
                { text: '盛岡1968-1969年', data: { id: 'kzmorioka02', layer: kz_morioka02Obj, opacity: 1, zoom: 11, center: [141.15443789282295, 39.70194827035462], summary: kzSumm } },
                { text: '盛岡1983-1988年', data: { id: 'kzmorioka03', layer: kz_morioka03Obj, opacity: 1, zoom: 11, center: [141.15443789282295, 39.70194827035462], summary: kzSumm } },
                { text: '盛岡1999-2002年', data: { id: 'kzmorioka04', layer: kz_morioka04Obj, opacity: 1, zoom: 11, center: [141.15443789282295, 39.70194827035462], summary: kzSumm } },
              ]},
            { text: '岩手県南',
              children: [
                { text: '岩手県南1913年', data: { id: 'kziwatekennan00', layer: kz_iwatekennan00Obj, opacity: 1, zoom: 11, center: [141.1219922752688, 39.17107785432805], summary: kzSumm } },
                { text: '岩手県南1951年', data: { id: 'kziwatekennan01', layer: kz_iwatekennan01Obj, opacity: 1, zoom: 11, center: [141.1219922752688, 39.17107785432805], summary: kzSumm } },
                { text: '岩手県南1968年', data: { id: 'kziwatekennan02', layer: kz_iwatekennan02Obj, opacity: 1, zoom: 11, center: [141.1219922752688, 39.17107785432805], summary: kzSumm } },
                { text: '岩手県南1985-1986年', data: { id: 'kziwatekennan03', layer: kz_iwatekennan03Obj, opacity: 1, zoom: 11, center: [141.1219922752688, 39.17107785432805], summary: kzSumm } },
                { text: '岩手県南1996-2001年', data: { id: 'kziwatekennan04', layer: kz_iwatekennan04Obj, opacity: 1, zoom: 11, center: [141.1219922752688, 39.17107785432805], summary: kzSumm } },
              ]},
            { text: '仙台',
              children: [
                { text: '仙台1928-1933年', data: { id: 'kzsendai00', layer: kz_sendai00Obj, opacity: 1, zoom: 11, center: [141.00327445963651, 38.25002518101397], summary: kzSumm } },
                { text: '仙台1946年', data: { id: 'kzsendai01', layer: kz_sendai01Obj, opacity: 1, zoom: 11, center: [141.00327445963651, 38.25002518101397], summary: kzSumm } },
                { text: '仙台1963-1967年', data: { id: 'kzsendai02', layer: kz_sendai02Obj, opacity: 1, zoom: 11, center: [141.00327445963651, 38.25002518101397], summary: kzSumm } },
                { text: '仙台1977-1978年', data: { id: 'kzsendai03', layer: kz_sendai03Obj, opacity: 1, zoom: 11, center: [141.00327445963651, 38.25002518101397], summary: kzSumm } },
                { text: '仙台1995-2000年', data: { id: 'kzsendai04', layer: kz_sendai04Obj, opacity: 1, zoom: 11, center: [141.00327445963651, 38.25002518101397], summary: kzSumm } },
              ]},
            { text: '秋田',
              children: [
                { text: '秋田1912年', data: { id: 'kzakita00', layer: kz_akita00Obj, opacity: 1, zoom: 11, center: [140.10354627117513, 39.71990630390653], summary: kzSumm } },
                { text: '秋田1971-1972年', data: { id: 'kzakita01', layer: kz_akita01Obj, opacity: 1, zoom: 11, center: [140.10354627117513, 39.71990630390653], summary: kzSumm } },
                { text: '秋田1985-1990年', data: { id: 'kzakita02', layer: kz_akita02Obj, opacity: 1, zoom: 11, center: [140.10354627117513, 39.71990630390653], summary: kzSumm } },
                { text: '秋田2006-2007年', data: { id: 'kzakita03', layer: kz_akita03Obj, opacity: 1, zoom: 11, center: [140.10354627117513, 39.71990630390653], summary: kzSumm } },
              ]},
            { text: '山形',
              children: [
                { text: '山形1901-1903年', data: { id: 'kzyamagata2man', layer: kz_yamagata2manObj, opacity: 1, zoom: 11, center: [140.3631197469087, 38.2389662868666], summary: kzSumm } },
                { text: '山形1931年', data: { id: 'kzyamagata00', layer: kz_yamagata00Obj, opacity: 1, zoom: 11, center: [140.3631197469087, 38.2389662868666], summary: kzSumm } },
                { text: '山形1970年', data: { id: 'kzyamagata01', layer: kz_yamagata01Obj, opacity: 1, zoom: 11, center: [140.3631197469087, 38.2389662868666], summary: kzSumm } },
                { text: '山形1980-1989年', data: { id: 'kzyamagata02', layer: kz_yamagata02Obj, opacity: 1, zoom: 11, center: [140.3631197469087, 38.2389662868666], summary: kzSumm } },
                { text: '山形1999-2001年', data: { id: 'kzyamagata03', layer: kz_yamagata03Obj, opacity: 1, zoom: 11, center: [140.3631197469087, 38.2389662868666], summary: kzSumm } },
              ]},
            { text: '米沢',
              children: [
                { text: '米沢1908-1910年', data: { id: 'kzyonezawa00', layer: kz_yonezawa00Obj, opacity: 1, zoom: 11, center: [140.1171034214525, 37.92345728139689], summary: kzSumm } },
                { text: '米沢1952-1953年', data: { id: 'kzyonezawa01', layer: kz_yonezawa01Obj, opacity: 1, zoom: 11, center: [140.1171034214525, 37.92345728139689], summary: kzSumm } },
                { text: '米沢1970-1973年', data: { id: 'kzyonezawa02', layer: kz_yonezawa02Obj, opacity: 1, zoom: 11, center: [140.1171034214525, 37.92345728139689], summary: kzSumm } },
                { text: '米沢1984年', data: { id: 'kzyonezawa03', layer: kz_yonezawa03Obj, opacity: 1, zoom: 11, center: [140.1171034214525, 37.92345728139689], summary: kzSumm } },
                { text: '米沢1999-2001年', data: { id: 'kzyonezawa04', layer: kz_yonezawa04Obj, opacity: 1, zoom: 11, center: [140.1171034214525, 37.92345728139689], summary: kzSumm } },
              ]},
            { text: '庄内',
              children: [
                { text: '庄内1913年', data: { id: 'kzsyonai00', layer: kz_syonai00Obj, opacity: 1, zoom: 11, center: [139.90609301545265, 38.85042607377838], summary: kzSumm } },
                { text: '庄内1934年', data: { id: 'kzsyonai01', layer: kz_syonai01Obj, opacity: 1, zoom: 11, center: [139.90609301545265, 38.85042607377838], summary: kzSumm } },
                { text: '庄内1974年', data: { id: 'kzsyonai02', layer: kz_syonai02Obj, opacity: 1, zoom: 11, center: [139.90609301545265, 38.85042607377838], summary: kzSumm } },
                { text: '庄内1987年', data: { id: 'kzsyonai03', layer: kz_syonai03Obj, opacity: 1, zoom: 11, center: [139.90609301545265, 38.85042607377838], summary: kzSumm } },
                { text: '庄内1997-2001年', data: { id: 'kzsyonai04', layer: kz_syonai04Obj, opacity: 1, zoom: 11, center: [139.90609301545265, 38.85042607377838], summary: kzSumm } },
              ]},
            { text: '福島',
              children: [
                { text: '福島1908年', data: { id: 'kzfukushima00', layer: kz_fukushima00Obj, opacity: 1, zoom: 10, center: [140.37908740833117, 37.50264624429053], summary: kzSumm } },
                { text: '福島1931年', data: { id: 'kzfukushima01', layer: kz_fukushima01Obj, opacity: 1, zoom: 10, center: [140.37908740833117, 37.50264624429053], summary: kzSumm } },
                { text: '福島1972-1973年', data: { id: 'kzfukushima02', layer: kz_fukushima02Obj, opacity: 1, zoom: 10, center: [140.37908740833117, 37.50264624429053], summary: kzSumm } },
                { text: '福島1983年', data: { id: 'kzfukushima03', layer: kz_fukushima03Obj, opacity: 1, zoom: 10, center: [140.37908740833117, 37.50264624429053], summary: kzSumm } },
                { text: '福島1996-2000年', data: { id: 'kzfukushima04', layer: kz_fukushima04Obj, opacity: 1, zoom: 10, center: [140.37908740833117, 37.50264624429053], summary: kzSumm } },
              ]},
            { text: '会津',
              children: [
                { text: '会津1908-1910年', data: { id: 'kzaizu00', layer: kz_aizu00Obj, opacity: 1, zoom: 11, center: [139.9286021214144, 37.490405749906515], summary: kzSumm } },
                { text: '会津1931年', data: { id: 'kzaizu01', layer: kz_aizu01Obj, opacity: 1, zoom: 11, center: [139.9286021214144, 37.490405749906515], summary: kzSumm } },
                { text: '会津1972-1975年', data: { id: 'kzaizu02', layer: kz_aizu02Obj, opacity: 1, zoom: 11, center: [139.9286021214144, 37.490405749906515], summary: kzSumm } },
                { text: '会津1988-1991年', data: { id: 'kzaizu03', layer: kz_aizu03Obj, opacity: 1, zoom: 11, center: [139.9286021214144, 37.490405749906515], summary: kzSumm } },
                { text: '会津1997-2000年', data: { id: 'kzaizu04', layer: kz_aizu04Obj, opacity: 1, zoom: 11, center: [139.9286021214144, 37.490405749906515], summary: kzSumm } },
              ]},
            { text: '新潟',
              children: [
                { text: '新潟1910-1911年', data: { id: 'kzniigata00', layer: kz_niigata00Obj, opacity: 1, zoom: 10, center: [138.84812094897046, 37.44922171939612], summary: kzSumm } },
                { text: '新潟1930-1931年', data: { id: 'kzniigata01', layer: kz_niigata01Obj, opacity: 1, zoom: 10, center: [138.84812094897046, 37.44922171939612], summary: kzSumm } },
                { text: '新潟1966-1968年', data: { id: 'kzniigata02', layer: kz_niigata02Obj, opacity: 1, zoom: 10, center: [138.84812094897046, 37.44922171939612], summary: kzSumm } },
                { text: '新潟1980-1988年', data: { id: 'kzniigata03', layer: kz_niigata03Obj, opacity: 1, zoom: 10, center: [138.84812094897046, 37.44922171939612], summary: kzSumm } },
                { text: '新潟1997-2001年', data: { id: 'kzniigata04', layer: kz_niigata04Obj, opacity: 1, zoom: 10, center: [138.84812094897046, 37.44922171939612], summary: kzSumm } },
              ]},
            { text: '金沢・富山',
              children: [
                { text: '金沢・富山1909-1910年', data: { id: 'kzkanazawa2man', layer: kz_kanazawa2manObj, opacity: 1, zoom: 10, center: [136.9176975451396, 36.66758882945422], summary: kzSumm } },
                { text: '金沢・富山1930年', data: { id: 'kzkanazawa00', layer: kz_kanazawa00Obj, opacity: 1, zoom: 10, center: [136.9176975451396, 36.66758882945422], summary: kzSumm } },
                { text: '金沢・富山1968-1969年', data: { id: 'kzkanazawa01', layer: kz_kanazawa01Obj, opacity: 1, zoom: 10, center: [136.9176975451396, 36.66758882945422], summary: kzSumm } },
                { text: '金沢・富山1981-1985年', data: { id: 'kzkanazawa02', layer: kz_kanazawa02Obj, opacity: 1, zoom: 10, center: [136.9176975451396, 36.66758882945422], summary: kzSumm } },
                { text: '金沢・富山11994-2001年', data: { id: 'kzkanazawa03', layer: kz_kanazawa03Obj, opacity: 1, zoom: 10, center: [136.9176975451396, 36.66758882945422], summary: kzSumm } },
              ]},
            { text: '福井',
              children: [
                { text: '福井1909年', data: { id: 'kzfukui2man', layer: kz_fukui2manObj, opacity: 1, zoom: 11, center: [136.22173010531614, 36.065132823369055], summary: kzSumm } },
                { text: '福井1930年', data: { id: 'kzfukui00', layer: kz_fukui00Obj, opacity: 1, zoom: 11, center: [136.22173010531614, 36.065132823369055], summary: kzSumm } },
                { text: '福井1969-1973年', data: { id: 'kzfukui01', layer: kz_fukui01Obj, opacity: 1, zoom: 11, center: [136.22173010531614, 36.065132823369055], summary: kzSumm } },
                { text: '福井1988-1990年', data: { id: 'kzfukui02', layer: kz_fukui02Obj, opacity: 1, zoom: 11, center: [136.22173010531614, 36.065132823369055], summary: kzSumm } },
                { text: '福井1996-2000年', data: { id: 'kzfukui03', layer: kz_fukui03Obj, opacity: 1, zoom: 11, center: [136.22173010531614, 36.065132823369055], summary: kzSumm } },
              ]},
            { text: '長野',
              children: [
                { text: '長野1912年', data: { id: 'kznagano00', layer: kz_nagano00Obj, opacity: 1, zoom: 11, center: [138.19481328177986, 36.648565593197915], summary: kzSumm } },
                { text: '長野1937年', data: { id: 'kznagano01', layer: kz_nagano01Obj, opacity: 1, zoom: 11, center: [138.19481328177986, 36.648565593197915], summary: kzSumm } },
                { text: '長野1960年', data: { id: 'kznagano02', layer: kz_nagano02Obj, opacity: 1, zoom: 11, center: [138.19481328177986, 36.648565593197915], summary: kzSumm } },
                { text: '長野1972-1973年', data: { id: 'kznagano03', layer: kz_nagano03Obj, opacity: 1, zoom: 11, center: [138.19481328177986, 36.648565593197915], summary: kzSumm } },
                { text: '長野1985年', data: { id: 'kznagano04', layer: kz_nagano04Obj, opacity: 1, zoom: 11, center: [138.19481328177986, 36.648565593197915], summary: kzSumm } },
                { text: '長野2001年', data: { id: 'kznagano05', layer: kz_nagano05Obj, opacity: 1, zoom: 11, center: [138.19481328177986, 36.648565593197915], summary: kzSumm } },
              ]},
            { text: '松本',
              children: [
                { text: '松本1910年', data: { id: 'kzmatsumoto00', layer: kz_matsumoto00Obj, opacity: 1, zoom: 11, center: [137.97116737510635, 36.23755489067727], summary: kzSumm } },
                { text: '松本1931年', data: { id: 'kzmatsumoto01', layer: kz_matsumoto01Obj, opacity: 1, zoom: 11, center: [137.97116737510635, 36.23755489067727], summary: kzSumm } },
                { text: '松本1974-1975年', data: { id: 'kzmatsumoto02', layer: kz_matsumoto02Obj, opacity: 1, zoom: 11, center: [137.97116737510635, 36.23755489067727], summary: kzSumm } },
                { text: '松本1987-1992年', data: { id: 'kzmatsumoto03', layer: kz_matsumoto03Obj, opacity: 1, zoom: 11, center: [137.97116737510635, 36.23755489067727], summary: kzSumm } },
                { text: '松本1996-2001年', data: { id: 'kzmatsumoto04', layer: kz_matsumoto04Obj, opacity: 1, zoom: 11, center: [137.97116737510635, 36.23755489067727], summary: kzSumm } },
              ]},
            { text: '伊那',
              children: [
                { text: '伊那1911年', data: { id: 'kzina00', layer: kz_ina00Obj, opacity: 1, zoom: 11, center: [137.95593380928037, 35.827167088111324], summary: kzSumm } },
                { text: '伊那1951-1952年', data: { id: 'kzina01', layer: kz_ina01Obj, opacity: 1, zoom: 11, center: [137.95593380928037, 35.827167088111324], summary: kzSumm } },
                { text: '伊那1976年', data: { id: 'kzina02', layer: kz_ina02Obj, opacity: 1, zoom: 11, center: [137.95593380928037, 35.827167088111324], summary: kzSumm } },
                { text: '伊那1987-1990年', data: { id: 'kzina03', layer: kz_ina03Obj, opacity: 1, zoom: 11, center: [137.95593380928037, 35.827167088111324], summary: kzSumm } },
                { text: '伊那1998-2001年', data: { id: 'kzina04', layer: kz_ina04Obj, opacity: 1, zoom: 11, center: [137.95593380928037, 35.827167088111324], summary: kzSumm } },
              ]},
            { text: '津',
              children: [
                { text: '津1892-1898年', data: { id: 'kztsu2man', layer: kz_tsu2manObj, opacity: 1, zoom: 10, center: [136.51057722335113, 34.731398452430554], summary: kzSumm } },
                { text: '津1920年', data: { id: 'kztsu00', layer: kz_tsu00Obj, opacity: 1, zoom: 10, center: [136.51057722335113, 34.731398452430554], summary: kzSumm } },
                { text: '津1937年', data: { id: 'kztsu01', layer: kz_tsu01Obj, opacity: 1, zoom: 10, center: [136.51057722335113, 34.731398452430554], summary: kzSumm } },
                { text: '津1959年', data: { id: 'kztsu02', layer: kz_tsu02Obj, opacity: 1, zoom: 10, center: [136.51057722335113, 34.731398452430554], summary: kzSumm } },
                { text: '津1980-1982年', data: { id: 'kztsu03', layer: kz_tsu03Obj, opacity: 1, zoom: 10, center: [136.51057722335113, 34.731398452430554], summary: kzSumm } },
                { text: '津1991-1999年', data: { id: 'kztsu04', layer: kz_tsu04Obj, opacity: 1, zoom: 10, center: [136.51057722335113, 34.731398452430554], summary: kzSumm } },
              ]},
            { text: '浜松・豊橋',
              children: [
                { text: '浜松・豊橋1889-1890年', data: { id: 'kzhamamatsu2man', layer: kz_hamamatsu2manObj, opacity: 1, zoom: 10, center: [137.6465650860257, 34.767069376904644], summary: kzSumm } },
                { text: '浜松・豊橋1916-1918年', data: { id: 'kzhamamatsu00', layer: kz_hamamatsu00Obj, opacity: 1, zoom: 10, center: [137.6465650860257, 34.767069376904644], summary: kzSumm } },
                { text: '浜松・豊橋1938-1950年', data: { id: 'kzhamamatsu01', layer: kz_hamamatsu01Obj, opacity: 1, zoom: 10, center: [137.6465650860257, 34.767069376904644], summary: kzSumm } },
                { text: '浜松・豊橋1956-1959年', data: { id: 'kzhamamatsu02', layer: kz_hamamatsu02Obj, opacity: 1, zoom: 10, center: [137.6465650860257, 34.767069376904644], summary: kzSumm } },
                { text: '浜松・豊橋1975-1988年', data: { id: 'kzhamamatsu03', layer: kz_hamamatsu03Obj, opacity: 1, zoom: 10, center: [137.6465650860257, 34.767069376904644], summary: kzSumm } },
                { text: '浜松・豊橋1988-1995年', data: { id: 'kzhamamatsu04', layer: kz_hamamatsu04Obj, opacity: 1, zoom: 10, center: [137.6465650860257, 34.767069376904644], summary: kzSumm } },
                { text: '浜松・豊橋1996-2010年', data: { id: 'kzhamamatsu05', layer: kz_hamamatsu05Obj, opacity: 1, zoom: 10, center: [137.6465650860257, 34.767069376904644], summary: kzSumm } },
              ]},
            { text: '伊賀',
              children: [
                { text: '伊賀1892年', data: { id: 'kziga00', layer: kz_iga00Obj, opacity: 1, zoom: 11, center: [136.14220318388942, 34.74985604583132], summary: kzSumm } },
                { text: '伊賀1937年', data: { id: 'kziga01', layer: kz_iga01Obj, opacity: 1, zoom: 11, center: [136.14220318388942, 34.74985604583132], summary: kzSumm } },
                { text: '伊賀1968年', data: { id: 'kziga02', layer: kz_iga02Obj, opacity: 1, zoom: 11, center: [136.14220318388942, 34.74985604583132], summary: kzSumm } },
                { text: '伊賀1980-1986年', data: { id: 'kziga03', layer: kz_iga03Obj, opacity: 1, zoom: 11, center: [136.14220318388942, 34.74985604583132], summary: kzSumm } },
                { text: '伊賀1996-2001年', data: { id: 'kziga04', layer: kz_iga04Obj, opacity: 1, zoom: 11, center: [136.14220318388942, 34.74985604583132], summary: kzSumm } },
              ]},
            { text: '近江',
              children: [
                { text: '近江1891-1909年', data: { id: 'kzomi2man', layer: kz_omi2manObj, opacity: 1, zoom: 11, center: [136.11975801404134, 35.21331321211734], summary: kzSumm } },
                { text: '近江1920-1922年', data: { id: 'kzomi00', layer: kz_omi00Obj, opacity: 1, zoom: 11, center: [136.11975801404134, 35.21331321211734], summary: kzSumm } },
                { text: '近江1954年', data: { id: 'kzomi01', layer: kz_omi01Obj, opacity: 1, zoom: 11, center: [136.11975801404134, 35.21331321211734], summary: kzSumm } },
                { text: '近江1967-1971年', data: { id: 'kzomi02', layer: kz_omi02Obj, opacity: 1, zoom: 11, center: [136.11975801404134, 35.21331321211734], summary: kzSumm } },
                { text: '近江1979-1986年', data: { id: 'kzomi03', layer: kz_omi03Obj, opacity: 1, zoom: 11, center: [136.11975801404134, 35.21331321211734], summary: kzSumm } },
                { text: '近江1992-1999年', data: { id: 'kzomi04', layer: kz_omi04Obj, opacity: 1, zoom: 11, center: [136.11975801404134, 35.21331321211734], summary: kzSumm } },
              ]},
            { text: '姫路',
              children: [
                { text: '姫路1903-1910年', data: { id: 'kzhimeji2man', layer: kz_himeji2manObj, opacity: 1, zoom: 11, center: [134.80640567378435, 34.79037201184045], summary: kzSumm } },
                { text: '姫路1923年', data: { id: 'kzhimeji00', layer: kz_himeji00Obj, opacity: 1, zoom: 11, center: [134.80640567378435, 34.79037201184045], summary: kzSumm } },
                { text: '姫路1967年', data: { id: 'kzhimeji01', layer: kz_himeji01Obj, opacity: 1, zoom: 11, center: [134.80640567378435, 34.79037201184045], summary: kzSumm } },
                { text: '姫路1981-1985年', data: { id: 'kzhimeji02', layer: kz_himeji02Obj, opacity: 1, zoom: 11, center: [134.80640567378435, 34.79037201184045], summary: kzSumm } },
                { text: '姫路1997-2001年', data: { id: 'kzhimeji03', layer: kz_himeji03Obj, opacity: 1, zoom: 11, center: [134.80640567378435, 34.79037201184045], summary: kzSumm } },
              ]},
            { text: '和歌山',
              children: [
                { text: '和歌山1908-1912年', data: { id: 'kzwakayama2man', layer: kz_wakayama2manObj, opacity: 1, zoom: 11, center: [135.16754936889745, 34.225669927354005], summary: kzSumm } },
                { text: '和歌山1934年', data: { id: 'kzwakayama00', layer: kz_wakayama00Obj, opacity: 1, zoom: 11, center: [135.16754936889745, 34.225669927354005], summary: kzSumm } },
                { text: '和歌山1947年', data: { id: 'kzwakayama01', layer: kz_wakayama01Obj, opacity: 1, zoom: 11, center: [135.16754936889745, 34.225669927354005], summary: kzSumm } },
                { text: '和歌山1966-1967年', data: { id: 'kzwakayama02', layer: kz_wakayama02Obj, opacity: 1, zoom: 11, center: [135.16754936889745, 34.225669927354005], summary: kzSumm } },
                { text: '和歌山1984-1985年', data: { id: 'kzwakayama03', layer: kz_wakayama03Obj, opacity: 1, zoom: 11, center: [135.16754936889745, 34.225669927354005], summary: kzSumm } },
                { text: '和歌山1998-2000年', data: { id: 'kzwakayama04', layer: kz_wakayama04Obj, opacity: 1, zoom: 11, center: [135.16754936889745, 34.225669927354005], summary: kzSumm } },
              ]},
            { text: '鳥取',
              children: [
                { text: '鳥取1897年', data: { id: 'kztottori2man', layer: kz_tottori2manObj, opacity: 1, zoom: 11, center: [134.2386912838453, 35.503229382676395], summary: kzSumm } },
                { text: '鳥取1932年', data: { id: 'kztottori00', layer: kz_tottori00Obj, opacity: 1, zoom: 11, center: [134.2386912838453, 35.503229382676395], summary: kzSumm } },
                { text: '鳥取1973年', data: { id: 'kztottori01', layer: kz_tottori01Obj, opacity: 1, zoom: 11, center: [134.2386912838453, 35.503229382676395], summary: kzSumm } },
                { text: '鳥取1988年', data: { id: 'kztottori02', layer: kz_tottori02Obj, opacity: 1, zoom: 11, center: [134.2386912838453, 35.503229382676395], summary: kzSumm } },
                { text: '鳥取1999-2001年', data: { id: 'kztottori03', layer: kz_tottori03Obj, opacity: 1, zoom: 11, center: [134.2386912838453, 35.503229382676395], summary: kzSumm } },
              ]},
            { text: '松江・米子',
              children: [
                { text: '松江・米子1915年', data: { id: 'kzmatsue00', layer: kz_matsue00Obj, opacity: 1, zoom: 10, center: [132.99640614775308, 35.4454518503768], summary: kzSumm } },
                { text: '松江・米子1934年', data: { id: 'kzmatsue01', layer: kz_matsue01Obj, opacity: 1, zoom: 10, center: [132.99640614775308, 35.4454518503768], summary: kzSumm } },
                { text: '松江・米子1975年', data: { id: 'kzmatsue02', layer: kz_matsue02Obj, opacity: 1, zoom: 10, center: [132.99640614775308, 35.4454518503768], summary: kzSumm } },
                { text: '松江・米子1989-1990年', data: { id: 'kzmatsue03', layer: kz_matsue03Obj, opacity: 1, zoom: 10, center: [132.99640614775308, 35.4454518503768], summary: kzSumm } },
                { text: '松江・米子1997-2003年', data: { id: 'kzmatsue04', layer: kz_matsue04Obj, opacity: 1, zoom: 10, center: [132.99640614775308, 35.4454518503768], summary: kzSumm } },
              ]},
            { text: '岡山・福山',
              children: [
                { text: '岡山・福山1895-1898年', data: { id: 'kzokayama2man', layer: kz_okayama2manObj, opacity: 1, zoom: 11, center: [133.49318888290387, 34.52516992131956], summary: kzSumm } },
                { text: '岡山・福山1925年', data: { id: 'kzokayama00', layer: kz_okayama00Obj, opacity: 1, zoom: 11, center: [133.49318888290387, 34.52516992131956], summary: kzSumm } },
                { text: '岡山・福山1965-1970年', data: { id: 'kzokayama01', layer: kz_okayama01Obj, opacity: 1, zoom: 11, center: [133.49318888290387, 34.52516992131956], summary: kzSumm } },
                { text: '岡山・福山1978-1988年', data: { id: 'kzokayama02', layer: kz_okayama02Obj, opacity: 1, zoom: 11, center: [133.49318888290387, 34.52516992131956], summary: kzSumm } },
                { text: '岡山・福山1990-2000年', data: { id: 'kzokayama03', layer: kz_okayama03Obj, opacity: 1, zoom: 11, center: [133.49318888290387, 34.52516992131956], summary: kzSumm } },
              ]},
            { text: '広島',
              children: [
                { text: '広島1894-1899年', data: { id: 'kzhiroshima2man', layer: kz_hiroshima2manObj, opacity: 1, zoom: 10, center: [132.54580130935645, 34.21994336393344], summary: kzSumm } },
                { text: '広島1925-1932年', data: { id: 'kzhiroshima00', layer: kz_hiroshima00Obj, opacity: 1, zoom: 10, center: [132.54580130935645, 34.21994336393344], summary: kzSumm } },
                { text: '広島1950-1954年', data: { id: 'kzhiroshima01', layer: kz_hiroshima01Obj, opacity: 1, zoom: 10, center: [132.54580130935645, 34.21994336393344], summary: kzSumm } },
                { text: '広島1967-1969年', data: { id: 'kzhiroshima02', layer: kz_hiroshima02Obj, opacity: 1, zoom: 10, center: [132.54580130935645, 34.21994336393344], summary: kzSumm } },
                { text: '広島1984-1990年', data: { id: 'kzhiroshima03', layer: kz_hiroshima03Obj, opacity: 1, zoom: 10, center: [132.54580130935645, 34.21994336393344], summary: kzSumm } },
                { text: '広島1992-2001年', data: { id: 'kzhiroshima04', layer: kz_hiroshima04Obj, opacity: 1, zoom: 10, center: [132.54580130935645, 34.21994336393344], summary: kzSumm } },
              ]},
            { text: '周南',
              children: [
                { text: '周南1899年', data: { id: 'kzshunan00', layer: kz_shunan00Obj, opacity: 1, zoom: 11, center: [131.80668535471008, 34.05436864050681], summary: kzSumm } },
                { text: '周南1949年', data: { id: 'kzshunan01', layer: kz_shunan01Obj, opacity: 1, zoom: 11, center: [131.80668535471008, 34.05436864050681], summary: kzSumm } },
                { text: '周南1968-1969年', data: { id: 'kzshunan02', layer: kz_shunan02Obj, opacity: 1, zoom: 11, center: [131.80668535471008, 34.05436864050681], summary: kzSumm } },
                { text: '周南1985年', data: { id: 'kzshunan03', layer: kz_shunan03Obj, opacity: 1, zoom: 11, center: [131.80668535471008, 34.05436864050681], summary: kzSumm } },
                { text: '周南1994-2001年', data: { id: 'kzshunan04', layer: kz_shunan04Obj, opacity: 1, zoom: 11, center: [131.80668535471008, 34.05436864050681], summary: kzSumm } },
              ]},
            { text: '山口',
              children: [
                { text: '山口1897-1909年', data: { id: 'kzyamaguchi2man', layer: kz_yamaguchi2manObj, opacity: 1, zoom: 10, center: [131.37495955650908, 34.085590462873924], summary: kzSumm } },
                { text: '山口1922-1927年', data: { id: 'kzyamaguchi00', layer: kz_yamaguchi00Obj, opacity: 1, zoom: 10, center: [131.37495955650908, 34.085590462873924], summary: kzSumm } },
                { text: '山口1936-1951年', data: { id: 'kzyamaguchi01', layer: kz_yamaguchi01Obj, opacity: 1, zoom: 10, center: [131.37495955650908, 34.085590462873924], summary: kzSumm } },
                { text: '山口1969年', data: { id: 'kzyamaguchi02', layer: kz_yamaguchi02Obj, opacity: 1, zoom: 10, center: [131.37495955650908, 34.085590462873924], summary: kzSumm } },
                { text: '山口1983-1989年', data: { id: 'kzyamaguchi03', layer: kz_yamaguchi03Obj, opacity: 1, zoom: 10, center: [131.37495955650908, 34.085590462873924], summary: kzSumm } },
                { text: '山口2000-2001年', data: { id: 'kzyamaguchi04', layer: kz_yamaguchi04Obj, opacity: 1, zoom: 10, center: [131.37495955650908, 34.085590462873924], summary: kzSumm } },
              ]},
            { text: '徳島',
              children: [
                { text: '徳島1896-1909年', data: { id: 'kztokushima2man', layer: kz_tokushima2manObj, opacity: 1, zoom: 11, center: [134.55847478918588, 34.06503021411453], summary: kzSumm } },
                { text: '徳島1917年', data: { id: 'kztokushima00', layer: kz_tokushima00Obj, opacity: 1, zoom: 11, center: [134.55847478918588, 34.06503021411453], summary: kzSumm } },
                { text: '徳島1928-1934年', data: { id: 'kztokushima01', layer: kz_tokushima01Obj, opacity: 1, zoom: 11, center: [134.55847478918588, 34.06503021411453], summary: kzSumm } },
                { text: '徳島1969-1970年', data: { id: 'kztokushima02', layer: kz_tokushima02Obj, opacity: 1, zoom: 11, center: [134.55847478918588, 34.06503021411453], summary: kzSumm } },
                { text: '徳島1981-1987年', data: { id: 'kztokushima03', layer: kz_tokushima03Obj, opacity: 1, zoom: 11, center: [134.55847478918588, 34.06503021411453], summary: kzSumm } },
                { text: '徳島1997-2000年', data: { id: 'kztokushima04', layer: kz_tokushima04Obj, opacity: 1, zoom: 11, center: [134.55847478918588, 34.06503021411453], summary: kzSumm } },
              ]},
            { text: '高松',
              children: [
                { text: '高松1896-1910年', data: { id: 'kztakamatsu2man', layer: kz_takamatsu2manObj, opacity: 1, zoom: 11, center: [134.0459274899792, 34.337209199857014], summary: kzSumm } },
                { text: '高松1928年', data: { id: 'kztakamatsu00', layer: kz_takamatsu00Obj, opacity: 1, zoom: 11, center: [134.0459274899792, 34.337209199857014], summary: kzSumm } },
                { text: '高松1969年', data: { id: 'kztakamatsu01', layer: kz_takamatsu01Obj, opacity: 1, zoom: 11, center: [134.0459274899792, 34.337209199857014], summary: kzSumm } },
                { text: '高松1983-1984年', data: { id: 'kztakamatsu02', layer: kz_takamatsu02Obj, opacity: 1, zoom: 11, center: [134.0459274899792, 34.337209199857014], summary: kzSumm } },
                { text: '高松1990-2000年', data: { id: 'kztakamatsu03', layer: kz_takamatsu03Obj, opacity: 1, zoom: 11, center: [134.0459274899792, 34.337209199857014], summary: kzSumm } },
              ]},
            { text: '松山',
              children: [
                { text: '松山1903年', data: { id: 'kzmatsuyama2man', layer: kz_matsuyama2manObj, opacity: 1, zoom: 11, center: [132.75866655164452, 33.836904012099055], summary: kzSumm } },
                { text: '松山1928-1955年', data: { id: 'kzmatsuyama00', layer: kz_matsuyama00Obj, opacity: 1, zoom: 11, center: [132.75866655164452, 33.836904012099055], summary: kzSumm } },
                { text: '松山1968年', data: { id: 'kzmatsuyama01', layer: kz_matsuyama01Obj, opacity: 1, zoom: 11, center: [132.75866655164452, 33.836904012099055], summary: kzSumm } },
                { text: '松山1985年', data: { id: 'kzmatsuyama02', layer: kz_matsuyama02Obj, opacity: 1, zoom: 11, center: [132.75866655164452, 33.836904012099055], summary: kzSumm } },
                { text: '松山1998-1999年', data: { id: 'kzmatsuyama03', layer: kz_matsuyama03Obj, opacity: 1, zoom: 11, center: [132.75866655164452, 33.836904012099055], summary: kzSumm } },
              ]},
            { text: '東予',
              children: [
                { text: '東予1898-1906年', data: { id: 'kztoyo00', layer: kz_toyo00Obj, opacity: 1, zoom: 11, center: [133.3016583425527, 34.000841582510205], summary: kzSumm } },
                { text: '東予1928年', data: { id: 'kztoyo01', layer: kz_toyo01Obj, opacity: 1, zoom: 11, center: [133.3016583425527, 34.000841582510205], summary: kzSumm } },
                { text: '東予1966-1969年', data: { id: 'kztoyo02', layer: kz_toyo02Obj, opacity: 1, zoom: 11, center: [133.3016583425527, 34.000841582510205], summary: kzSumm } },
                { text: '東予1984-1989年', data: { id: 'kztoyo03', layer: kz_toyo03Obj, opacity: 1, zoom: 11, center: [133.3016583425527, 34.000841582510205], summary: kzSumm } },
                { text: '東予1994-2001年', data: { id: 'kztoyo04', layer: kz_toyo04Obj, opacity: 1, zoom: 11, center: [133.3016583425527, 34.000841582510205], summary: kzSumm } },
              ]},
            { text: '高知',
              children: [
                { text: '高知1906-1907年', data: { id: 'kzkochi2man', layer: kz_kochi2manObj, opacity: 1, zoom: 11, center: [133.53192260361922, 33.558217913869484], summary: kzSumm } },
                { text: '高知1933年', data: { id: 'kzkochi00', layer: kz_kochi00Obj, opacity: 1, zoom: 11, center: [133.53192260361922, 33.558217913869484], summary: kzSumm } },
                { text: '高知1965年', data: { id: 'kzkochi01', layer: kz_kochi01Obj, opacity: 1, zoom: 11, center: [133.53192260361922, 33.558217913869484], summary: kzSumm } },
                { text: '高知1982年', data: { id: 'kzkochi02', layer: kz_kochi02Obj, opacity: 1, zoom: 11, center: [133.53192260361922, 33.558217913869484], summary: kzSumm } },
                { text: '高知1998-2003年', data: { id: 'kzkochi03', layer: kz_kochi03Obj, opacity: 1, zoom: 11, center: [133.53192260361922, 33.558217913869484], summary: kzSumm } },
              ]},
            { text: '福岡・北九州',
              children: [
                { text: '福岡・北九州1922-1926年', data: { id: 'kzFukuoka00', layer: kz_fukuoka00Obj, opacity: 1, zoom: 11, center: [130.6152588501701, 33.720855341479506], summary: kzSumm } },
                { text: '福岡・北九州1936-1938年', data: { id: 'kzFukuoka01', layer: kz_fukuoka01Obj, opacity: 1, zoom: 11, center: [130.6152588501701, 33.720855341479506], summary: kzSumm } },
                { text: '福岡・北九州1948-1956年', data: { id: 'kzFukuoka02', layer: kz_fukuoka02Obj, opacity: 1, zoom: 11, center: [130.6152588501701, 33.720855341479506], summary: kzSumm } },
                { text: '福岡・北九州1967-1972年', data: { id: 'kzFukuoka03', layer: kz_fukuoka03Obj, opacity: 1, zoom: 11, center: [130.6152588501701, 33.720855341479506], summary: kzSumm } },
                { text: '福岡・北九州1982-1986年', data: { id: 'kzFukuoka04', layer: kz_fukuoka04Obj, opacity: 1, zoom: 11, center: [130.6152588501701, 33.720855341479506], summary: kzSumm } },
                { text: '福岡・北九州1991-2000年', data: { id: 'kzFukuoka05', layer: kz_fukuoka05Obj, opacity: 1, zoom: 11, center: [130.6152588501701, 33.720855341479506], summary: kzSumm } },
              ]},
            { text: '佐賀・久留米	',
              children: [
                { text: '佐賀・久留米1900-1911年', data: { id: 'kzsaga2man', layer: kz_saga2manObj, opacity: 1, zoom: 11, center: [130.37485165975735, 33.25143971727887], summary: kzSumm } },
                { text: '佐賀・久留米1914-1926年', data: { id: 'kzsaga00', layer: kz_saga00Obj, opacity: 1, zoom: 11, center: [130.37485165975735, 33.25143971727887], summary: kzSumm } },
                { text: '佐賀・久留米1931-1940年', data: { id: 'kzsaga01', layer: kz_saga01Obj, opacity: 1, zoom: 11, center: [130.37485165975735, 33.25143971727887], summary: kzSumm } },
                { text: '佐賀・久留米1958-1964年', data: { id: 'kzsaga02', layer: kz_saga02Obj, opacity: 1, zoom: 11, center: [130.37485165975735, 33.25143971727887], summary: kzSumm } },
                { text: '佐賀・久留米1977-1982年', data: { id: 'kzsaga03', layer: kz_saga03Obj, opacity: 1, zoom: 11, center: [130.37485165975735, 33.25143971727887], summary: kzSumm } },
                { text: '佐賀・久留米1998-2001年', data: { id: 'kzsaga04', layer: kz_saga04Obj, opacity: 1, zoom: 11, center: [130.37485165975735, 33.25143971727887], summary: kzSumm } },
              ]},
            { text: '長崎',
              children: [
                { text: '長崎1900-1901年', data: { id: 'kznagasaki2man', layer: kz_nagasaki2manObj, opacity: 1, zoom: 11, center: [129.86242971847574, 32.77768659566941], summary: kzSumm } },
                { text: '長崎1924-1926年', data: { id: 'kznagasaki00', layer: kz_nagasaki00Obj, opacity: 1, zoom: 11, center: [129.86242971847574, 32.77768659566941], summary: kzSumm } },
                { text: '長崎1954年', data: { id: 'kznagasaki01', layer: kz_nagasaki01Obj, opacity: 1, zoom: 11, center: [129.86242971847574, 32.77768659566941], summary: kzSumm } },
                { text: '長崎1970-1970年', data: { id: 'kznagasaki02', layer: kz_nagasaki02Obj, opacity: 1, zoom: 11, center: [129.86242971847574, 32.77768659566941], summary: kzSumm } },
                { text: '長崎1982-1983年', data: { id: 'kznagasaki03', layer: kz_nagasaki03Obj, opacity: 1, zoom: 11, center: [129.86242971847574, 32.77768659566941], summary: kzSumm } },
                { text: '長崎1996-2000年', data: { id: 'kznagasaki04', layer: kz_nagasaki04Obj, opacity: 1, zoom: 11, center: [129.86242971847574, 32.77768659566941], summary: kzSumm } },
              ]},
            { text: '佐世保',
              children: [
                { text: '佐世保1900-1901年', data: { id: 'kzsasebo2man', layer: kz_sasebo2manObj, opacity: 1, zoom: 11, center: [129.71448980425342, 33.17954620312899], summary: kzSumm } },
                { text: '佐世保1924年', data: { id: 'kzsasebo00', layer: kz_sasebo00Obj, opacity: 1, zoom: 11, center: [129.71448980425342, 33.17954620312899], summary: kzSumm } },
                { text: '佐世保1971年', data: { id: 'kzsasebo01', layer: kz_sasebo01Obj, opacity: 1, zoom: 11, center: [129.71448980425342, 33.17954620312899], summary: kzSumm } },
                { text: '佐世保1985-1987年', data: { id: 'kzsasebo02', layer: kz_sasebo02Obj, opacity: 1, zoom: 11, center: [129.71448980425342, 33.17954620312899], summary: kzSumm } },
                { text: '佐世保1997-1998年', data: { id: 'kzsasebo03', layer: kz_sasebo03Obj, opacity: 1, zoom: 11, center: [129.71448980425342, 33.17954620312899], summary: kzSumm } },
              ]},
            { text: '大牟田・島原',
              children: [
                { text: '大牟田・島原1910年', data: { id: 'kzomuta00', layer: kz_omuta00Obj, opacity: 1, zoom: 11, center: [130.37218702133083, 32.922246652336185], summary: kzSumm } },
                { text: '大牟田・島原1941-1942年', data: { id: 'kzomuta01', layer: kz_omuta01Obj, opacity: 1, zoom: 11, center: [130.37218702133083, 32.922246652336185], summary: kzSumm } },
                { text: '大牟田・島原1970年', data: { id: 'kzomuta02', layer: kz_omuta02Obj, opacity: 1, zoom: 11, center: [130.37218702133083, 32.922246652336185], summary: kzSumm } },
                { text: '大牟田・島原1983-1987年', data: { id: 'kzomuta03', layer: kz_omuta03Obj, opacity: 1, zoom: 11, center: [130.37218702133083, 32.922246652336185], summary: kzSumm } },
                { text: '大牟田・島原1993-1994年', data: { id: 'kzomuta04', layer: kz_omuta04Obj, opacity: 1, zoom: 11, center: [130.37218702133083, 32.922246652336185], summary: kzSumm } },
                { text: '大牟田・島原1999-2000年', data: { id: 'kzomuta05', layer: kz_omuta05Obj, opacity: 1, zoom: 11, center: [130.37218702133083, 32.922246652336185], summary: kzSumm } },
              ]},
            { text: '熊本',
              children: [
                { text: '熊本1900-1901年', data: { id: 'kzkumamoto2man', layer: kz_kumamoto2manObj, opacity: 1, zoom: 11, center: [130.70023856926852, 32.80315778633198], summary: kzSumm } },
                { text: '熊本1926年', data: { id: 'kzkumamoto00', layer: kz_kumamoto00Obj, opacity: 1, zoom: 11, center: [130.70023856926852, 32.80315778633198], summary: kzSumm } },
                { text: '熊本1965-1971年', data: { id: 'kzkumamoto01', layer: kz_kumamoto01Obj, opacity: 1, zoom: 11, center: [130.70023856926852, 32.80315778633198], summary: kzSumm } },
                { text: '熊本1983年', data: { id: 'kzkumamoto02', layer: kz_kumamoto02Obj, opacity: 1, zoom: 11, center: [130.70023856926852, 32.80315778633198], summary: kzSumm } },
                { text: '熊本1998-2000年', data: { id: 'kzkumamoto03', layer: kz_kumamoto03Obj, opacity: 1, zoom: 11, center: [130.70023856926852, 32.80315778633198], summary: kzSumm } },
              ]},
            { text: '八代',
              children: [
                { text: '八代1913年', data: { id: 'kzyatsushiro00', layer: kz_yatsushiro00Obj, opacity: 1, zoom: 11, center: [130.60193145213196, 32.50735507614503], summary: kzSumm } },
                { text: '八代1951年', data: { id: 'kzyatsushiro01', layer: kz_yatsushiro01Obj, opacity: 1, zoom: 11, center: [130.60193145213196, 32.50735507614503], summary: kzSumm } },
                { text: '八代1968年', data: { id: 'kzyatsushiro02', layer: kz_yatsushiro02Obj, opacity: 1, zoom: 11, center: [130.60193145213196, 32.50735507614503], summary: kzSumm } },
                { text: '八代1983-1986年', data: { id: 'kzyatsushiro03', layer: kz_yatsushiro03Obj, opacity: 1, zoom: 11, center: [130.60193145213196, 32.50735507614503], summary: kzSumm } },
                { text: '八代1997-2000年', data: { id: 'kzyatsushiro04', layer: kz_yatsushiro04Obj, opacity: 1, zoom: 11, center: [130.60193145213196, 32.50735507614503], summary: kzSumm } },
              ]},
            { text: '大分',
              children: [
                { text: '大分1914年', data: { id: 'kzoita00', layer: kz_oita00Obj, opacity: 1, zoom: 11, center: [131.66378440624356, 33.242106306341384], summary: kzSumm } },
                { text: '大分1973年', data: { id: 'kzoita01', layer: kz_oita01Obj, opacity: 1, zoom: 11, center: [131.66378440624356, 33.242106306341384], summary: kzSumm } },
                { text: '大分1984-1986年', data: { id: 'kzoita02', layer: kz_oita02Obj, opacity: 1, zoom: 11, center: [131.66378440624356, 33.242106306341384], summary: kzSumm } },
                { text: '大分1997-2001年', data: { id: 'kzoita03', layer: kz_oita03Obj, opacity: 1, zoom: 11, center: [131.66378440624356, 33.242106306341384], summary: kzSumm } },
              ]},
            { text: '延岡',
              children: [
                { text: '延岡1901年', data: { id: 'kznobeoka00', layer: kz_nobeoka00Obj, opacity: 1, zoom: 11, center: [131.6207503297622, 32.50548751069228], summary: kzSumm } },
                { text: '延岡1932-1942年', data: { id: 'kznobeoka01', layer: kz_nobeoka01Obj, opacity: 1, zoom: 11, center: [131.6207503297622, 32.50548751069228], summary: kzSumm } },
                { text: '延岡1965年', data: { id: 'kznobeoka02', layer: kz_nobeoka02Obj, opacity: 1, zoom: 11, center: [131.6207503297622, 32.50548751069228], summary: kzSumm } },
                { text: '延岡1978-1978年', data: { id: 'kznobeoka03', layer: kz_nobeoka03Obj, opacity: 1, zoom: 11, center: [131.6207503297622, 32.50548751069228], summary: kzSumm } },
                { text: '延岡1999-2000年', data: { id: 'kznobeoka04', layer: kz_nobeoka04Obj, opacity: 1, zoom: 11, center: [131.6207503297622, 32.50548751069228], summary: kzSumm } },
              ]},
            { text: '宮崎',
              children: [
                { text: '宮崎1902年', data: { id: 'kzmiyazaki00', layer: kz_miyazaki00Obj, opacity: 1, zoom: 11, center: [131.37330627280852, 31.91825589366576], summary: kzSumm } },
                { text: '宮崎1935年', data: { id: 'kzmiyazaki01', layer: kz_miyazaki01Obj, opacity: 1, zoom: 11, center: [131.37330627280852, 31.91825589366576], summary: kzSumm } },
                { text: '宮崎1962年', data: { id: 'kzmiyazaki02', layer: kz_miyazaki02Obj, opacity: 1, zoom: 11, center: [131.37330627280852, 31.91825589366576], summary: kzSumm } },
                { text: '宮崎1979年', data: { id: 'kzmiyazaki03', layer: kz_miyazaki03Obj, opacity: 1, zoom: 11, center: [131.37330627280852, 31.91825589366576], summary: kzSumm } },
                { text: '宮崎1999-2001年', data: { id: 'kzmiyazaki04', layer: kz_miyazaki04Obj, opacity: 1, zoom: 11, center: [131.37330627280852, 31.91825589366576], summary: kzSumm } },
              ]},
            { text: '都城',
              children: [
                { text: '都城1902年', data: { id: 'kzmiyakonojyou00', layer: kz_miyakonojyou00Obj, opacity: 1, zoom: 11, center: [131.12988620996472, 31.754980652611508], summary: kzSumm } },
                { text: '都城1932年', data: { id: 'kzmiyakonojyou01', layer: kz_miyakonojyou01Obj, opacity: 1, zoom: 11, center: [131.12988620996472, 31.754980652611508], summary: kzSumm } },
                { text: '都城1966年', data: { id: 'kzmiyakonojyou02', layer: kz_miyakonojyou02Obj, opacity: 1, zoom: 11, center: [131.12988620996472, 31.754980652611508], summary: kzSumm } },
                { text: '都城1979-1980年', data: { id: 'kzmiyakonojyou03', layer: kz_miyakonojyou03Obj, opacity: 1, zoom: 11, center: [131.12988620996472, 31.754980652611508], summary: kzSumm } },
                { text: '都城1998-2001年', data: { id: 'kzmiyakonojyou04', layer: kz_miyakonojyou04Obj, opacity: 1, zoom: 11, center: [131.12988620996472, 31.754980652611508], summary: kzSumm } },
              ]},
            { text: '鹿児島',
              children: [
                { text: '鹿児島1902年', data: { id: 'kzkagoshima5man', layer: kz_kagoshima5manObj, opacity: 1, zoom: 11, center: [130.56285629304983, 31.597604019409147], summary: kzSumm } },
                { text: '鹿児島1902年', data: { id: 'kzkagoshima2man', layer: kz_kagoshima2manObj, opacity: 1, zoom: 11, center: [130.56285629304983, 31.597604019409147], summary: kzSumm } },
                { text: '鹿児島1932年', data: { id: 'kzkagoshima00', layer: kz_kagoshima00Obj, opacity: 1, zoom: 11, center: [130.56285629304983, 31.597604019409147], summary: kzSumm } },
                { text: '鹿児島1966年', data: { id: 'kzkagoshima01', layer: kz_kagoshima01Obj, opacity: 1, zoom: 11, center: [130.56285629304983, 31.597604019409147], summary: kzSumm } },
                { text: '鹿児島1982-1983年', data: { id: 'kzkagoshima02', layer: kz_kagoshima02Obj, opacity: 1, zoom: 11, center: [130.56285629304983, 31.597604019409147], summary: kzSumm } },
                { text: '鹿児島1996-2001年', data: { id: 'kzkagoshima03', layer: kz_kagoshima03Obj, opacity: 1, zoom: 11, center: [130.56285629304983, 31.597604019409147], summary: kzSumm } },
              ]},
            { text: '沖縄本島南部',
              children: [
                { text: '沖縄本島南部1919年', data: { id: 'kzokinawas00', layer: kz_okinawas00Obj, opacity: 1, zoom: 11, center: [127.74929221149132, 26.258318419347532], summary: kzSumm } },
                { text: '沖縄本島南部1973-1975年', data: { id: 'kzokinawas01', layer: kz_okinawas01Obj, opacity: 1, zoom: 11, center: [127.74929221149132, 26.258318419347532], summary: kzSumm } },
                { text: '沖縄本島南部1992-1994年', data: { id: 'kzokinawas02', layer: kz_okinawas02Obj, opacity: 1, zoom: 11, center: [127.74929221149132, 26.258318419347532], summary: kzSumm } },
                { text: '沖縄本島南部2005-2008年', data: { id: 'kzokinawas03', layer: kz_okinawas03Obj, opacity: 1, zoom: 11, center: [127.74929221149132, 26.258318419347532], summary: kzSumm } },
              ]}
          ]},
        { text: '東西蝦夷山川地理取調図', data: { id: 'ezosansen', layer: ezosansenObj, opacity: 1, zoom: 8, center: [142.6944008210318, 43.241646716680606], summary: ezosansenSumm } },
        { text: '東西蝦夷山川地理取調図2', data: { id: 'ezosansen2', layer: ezosansen2Obj, opacity: 1, zoom: 8, center: [142.6944008210318, 43.241646716680606], summary: ezosansenSumm2 } },

        { text: '北海道実測切図', data: { id: 'jissoku', layer: jissokukirizuobj, opacity: 1, zoom: 8, center: [142.6944008210318, 43.241646716680606], summary: jissokuSumm } },


        { text: 'ヤマシロマップ', data: { id: 'yamashiro', layer: yamashiroObj, opacity: 1, zoom: 11, center: [135.74390550133873,35.00293563827127], summary: yamashiroSumm } },
      ]},
    { text: '市町村、郡、地名',
      children: [
        // { text: '幕末の郡(国で色分け)', data: { id: "gunbakumatu", layer: LayersMvt.gunbakumatuObj, opacity: 1, summary: LayersMvt.gunSumm } },
        { text: '日本歴史地名大系', data: { id: "chimei", layer: LayersMvt.chimei0Obj, opacity: 1, summary: LayersMvt.chimeiSumm } },
        { text: '明治中期の郡(県で色分け)', data: { id: "gun", layer: LayersMvt.gunObj, opacity: 1, summary: LayersMvt.gunSumm } },
        { text: '明治中期の郡(国で色分け)', data: { id: "gunkuni", layer: LayersMvt.gunkuniObj, opacity: 1, summary: LayersMvt.gunSumm } },
        { text: 'T09市町村', data: { id: "cityT9", layer: LayersMvt.cityT9Obj, opacity: 1, summary: LayersMvt.cityT9Summ } },
        { text: 'S25市町村', data: { id: "cityS25", layer: LayersMvt.cityS25Obj, opacity: 1, summary: LayersMvt.cityS25Summ } },
        { text: 'H07市町村', data: { id: "cityH07", layer: LayersMvt.cityH07Obj, opacity: 1, summary: LayersMvt.cityH07Summ } },
        { text: 'R03市町村', data: { id: "cityR03", layer: LayersMvt.cityR03Obj, opacity: 1, summary: LayersMvt.cityR03Summ } },
      ]},
    { text: '各種地域',
      children: [
        { text: '砂防指定地', data: { id: "sabo", layer: LayersMvt.saboObj, opacity: 1, summary: LayersMvt.saboSumm} },

        { text: '鳥獣保護区', data: { id: "chyouzyuuh27", layer: LayersMvt.chyouzyuuH27Obj, opacity: 1, summary: LayersMvt.chyouzyuuH27Summ } },
        { text: '農業地域', data: { id: "nouhyouh27", layer: LayersMvt.nougyouH27Obj, opacity: 1, summary: LayersMvt.nougyouH27Summ } },
        { text: '農業集落境界', data: { id: "kyoukai", layer: LayersMvt.kyoukaiObj, opacity: 1, summary: LayersMvt.kyoukaiSumm } },
        { text: '医療圏',
          children: [
            { text: '一次医療圏', data: { id: "iryouken1zi", layer: LayersMvt.iryouken1ziObj, opacity: 1, summary: LayersMvt.iryouken1ziSumm } },
            { text: '二次医療圏', data: { id: "iryouken2zi", layer: LayersMvt.iryouken2ziObj, opacity: 1, summary: LayersMvt.iryouken2ziSumm } },
            { text: '三次医療圏', data: { id: "iryouken3zi", layer: LayersMvt.iryouken3ziObj, opacity: 1, summary: LayersMvt.iryouken3ziSumm } },
          ]},
        { text: '振興山村地域',
          children: [
            { text: 'S41振興山村地域', data: { id: "sansonS41", layer: LayersMvt.sansonS41Obj, opacity: 1, summary: LayersMvt.sansonS41Summ } },
            { text: 'S50振興山村地域', data: { id: "sansonS50", layer: LayersMvt.sansonS50Obj, opacity: 1, summary: LayersMvt.sansonS50Summ } },
            { text: 'H28振興山村地域', data: { id: "sansonH28", layer: LayersMvt.sansonH28Obj, opacity: 1, summary: LayersMvt.sansonH28Summ } },
          ]},
        { text: '特定農山村地域',
          children: [
            { text: 'H28特定農山村地域', data: { id: "tokuteiH28", layer: LayersMvt.tokuteiH28Obj, opacity: 1, summary: LayersMvt.tokuteiSumm } },
          ]},
        { text: '過疎地域',
          children: [
            { text: 'S45過疎地域', data: { id: "kasoS45", layer: LayersMvt.kasoS45Obj, opacity: 1, summary: LayersMvt.kasoS45Summ } },
            { text: 'S60過疎地域', data: { id: "kasoS60", layer: LayersMvt.kasoS60Obj, opacity: 1, summary: LayersMvt.kasoS60Summ } },
            { text: 'H29過疎地域', data: { id: "kasoH29", layer: LayersMvt.kasoH29Obj, opacity: 1, summary: LayersMvt.kasoH29Summ } },
          ]},
        { text: '農地',
          children: [
            { text: '全国農地', data: { id: "hude00", layer: LayersMvt.hude00Obj, opacity: 1, summary: LayersMvt.hude01Summ } },
            { text: '01北海道', data: { id: "hude01", layer: LayersMvt.hude01Obj, opacity: 1, summary: LayersMvt.hude01Summ } },
            { text: '東北',
              children: [
                { text: '02青森県', data: { id: "hude02", layer: LayersMvt.hude02Obj, opacity: 1, summary: LayersMvt.hude02Summ } },
                { text: '03岩手県', data: { id: "hude03", layer: LayersMvt.hude03Obj, opacity: 1, summary: LayersMvt.hude03Summ } },
                { text: '04宮城県', data: { id: "hude04", layer: LayersMvt.hude04Obj, opacity: 1, summary: LayersMvt.hude04Summ } },
                { text: '05秋田県', data: { id: "hude05", layer: LayersMvt.hude05Obj, opacity: 1, summary: LayersMvt.hude05Summ } },
                { text: '06山形県', data: { id: "hude06", layer: LayersMvt.hude06Obj, opacity: 1, summary: LayersMvt.hude06Summ } },
                { text: '07福島県', data: { id: "hude07", layer: LayersMvt.hude07Obj, opacity: 1, summary: LayersMvt.hude07Summ } },
              ]},
            { text: '関東',
              children: [
                { text: '08茨城県農地', data: { id: 'hude08', layer: LayersMvt.hude08Obj, opacity: 1, summary: LayersMvt.hude08Summ } },
                { text: '09栃木県農地', data: { id: 'hude09', layer: LayersMvt.hude09Obj, opacity: 1, summary: LayersMvt.hude09Summ } },
                { text: '10群馬県農地', data: { id: 'hude10', layer: LayersMvt.hude10Obj, opacity: 1, summary: LayersMvt.hude10Summ } },
                { text: '11埼玉県農地', data: { id: 'hude11', layer: LayersMvt.hude11Obj, opacity: 1, summary: LayersMvt.hude11Summ } },
                { text: '12千葉県農地', data: { id: 'hude12', layer: LayersMvt.hude12Obj, opacity: 1, summary: LayersMvt.hude12Summ } },
                { text: '13東京都農地', data: { id: 'hude13', layer: LayersMvt.hude13Obj, opacity: 1, summary: LayersMvt.hude13Summ } },
                { text: '14神奈川県農地', data: { id: 'hude14', layer: LayersMvt.hude14Obj, opacity: 1, summary: LayersMvt.hude14Summ } },
              ]},
            { text: '中部',
              children: [
                { text: '15新潟県農地', data: { id: 'hude15', layer: LayersMvt.hude15Obj, opacity: 1, summary: LayersMvt.hude15Summ } },
                { text: '16富山県農地', data: { id: 'hude16', layer: LayersMvt.hude16Obj, opacity: 1, summary: LayersMvt.hude16Summ } },
                { text: '17石川県農地', data: { id: 'hude17', layer: LayersMvt.hude17Obj, opacity: 1, summary: LayersMvt.hude17Summ } },
                { text: '18福井県農地', data: { id: 'hude18', layer: LayersMvt.hude18Obj, opacity: 1, summary: LayersMvt.hude18Summ } },
                { text: '19山梨県農地', data: { id: 'hude19', layer: LayersMvt.hude19Obj, opacity: 1, summary: LayersMvt.hude19Summ } },
                { text: '20長野県農地', data: { id: 'hude20', layer: LayersMvt.hude20Obj, opacity: 1, summary: LayersMvt.hude20Summ } },
                { text: '21岐阜県農地', data: { id: 'hude21', layer: LayersMvt.hude21Obj, opacity: 1, summary: LayersMvt.hude21Summ } },
                { text: '22静岡県農地', data: { id: 'hude22', layer: LayersMvt.hude22Obj, opacity: 1, summary: LayersMvt.hude22Summ } },
                { text: '23愛知県農地', data: { id: 'hude23', layer: LayersMvt.hude23Obj, opacity: 1, summary: LayersMvt.hude23Summ } },
              ]},
            { text: '近畿',
              children: [
                { text: '24三重県農地', data: { id: 'hude24', layer: LayersMvt.hude24Obj, opacity: 1, summary: LayersMvt.hude24Summ } },
                { text: '25滋賀県農地', data: { id: 'hude25', layer: LayersMvt.hude25Obj, opacity: 1, summary: LayersMvt.hude25Summ } },
                { text: '26京都府農地', data: { id: 'hude26', layer: LayersMvt.hude26Obj, opacity: 1, summary: LayersMvt.hude26Summ } },
                { text: '27大阪府農地', data: { id: 'hude27', layer: LayersMvt.hude27Obj, opacity: 1, summary: LayersMvt.hude27Summ } },
                { text: '28兵庫県農地', data: { id: 'hude28', layer: LayersMvt.hude28Obj, opacity: 1, summary: LayersMvt.hude28Summ } },
                { text: '29奈良県農地', data: { id: 'hude29', layer: LayersMvt.hude29Obj, opacity: 1, summary: LayersMvt.hude29Summ } },
                { text: '30和歌山県農地', data: { id: 'hude30', layer: LayersMvt.hude30Obj, opacity: 1, summary: LayersMvt.hude30Summ } },
              ]},
            { text: '中国',
              children: [
                { text: '31鳥取県農地', data: { id: 'hude31', layer: LayersMvt.hude31Obj, opacity: 1, summary: LayersMvt.hude31Summ } },
                { text: '32島根県農地', data: { id: 'hude32', layer: LayersMvt.hude32Obj, opacity: 1, summary: LayersMvt.hude32Summ } },
                { text: '33岡山県農地', data: { id: 'hude33', layer: LayersMvt.hude33Obj, opacity: 1, summary: LayersMvt.hude33Summ } },
                { text: '34広島県農地', data: { id: 'hude34', layer: LayersMvt.hude34Obj, opacity: 1, summary: LayersMvt.hude34Summ } },
                { text: '35山口県農地', data: { id: 'hude35', layer: LayersMvt.hude35Obj, opacity: 1, summary: LayersMvt.hude35Summ } },
              ]},
            { text: '四国',
              children: [
                { text: '36徳島県農地', data: { id: 'hude36', layer: LayersMvt.hude36Obj, opacity: 1, summary: LayersMvt.hude36Summ } },
                { text: '37香川県農地', data: { id: 'hude37', layer: LayersMvt.hude37Obj, opacity: 1, summary: LayersMvt.hude37Summ } },
                { text: '38愛媛県農地', data: { id: 'hude38', layer: LayersMvt.hude38Obj, opacity: 1, summary: LayersMvt.hude38Summ } },
                { text: '39高知県農地', data: { id: 'hude39', layer: LayersMvt.hude39Obj, opacity: 1, summary: LayersMvt.hude39Summ } },
              ]},
            { text: '九州',
              children: [
                { text: '40福岡県', data: { id: "hude40", layer: LayersMvt.hude40Obj, opacity: 1, summary: LayersMvt.hude40Summ } },
                { text: '41佐賀県', data: { id: "hude41", layer: LayersMvt.hude41Obj, opacity: 1, summary: LayersMvt.hude41Summ } },
                { text: '42長崎県', data: { id: "hude42", layer: LayersMvt.hude42Obj, opacity: 1, summary: LayersMvt.hude42Summ } },
                { text: '43熊本県', data: { id: "hude43", layer: LayersMvt.hude43Obj, opacity: 1, summary: LayersMvt.hude43Summ } },
                { text: '44大分県', data: { id: "hude44", layer: LayersMvt.hude44Obj, opacity: 1, summary: LayersMvt.hude44Summ } },
                { text: '45宮崎県', data: { id: "hude45", layer: LayersMvt.hude45Obj, opacity: 1, summary: LayersMvt.hude45Summ } },
                { text: '46鹿児島県', data: { id: "hude46", layer: LayersMvt.hude46Obj, opacity: 1, summary: LayersMvt.hude46Summ } },
                { text: '47沖縄県', data: { id: "hude47", layer: LayersMvt.hude47Obj, opacity: 1, summary: LayersMvt.hude47Summ } },
              ]},
          ]},
        { text: '用途地域',
          children: [
            { text: 'H23用途地域', data: { id: "youtoH23", layer: LayersMvt.youtoH23Obj, opacity: 1, summary: LayersMvt.youtoH23Summ } },
            { text: 'R01用途地域', data: { id: "youtoR01", layer: LayersMvt.youtoR01Obj, opacity: 1, summary: LayersMvt.youtoR01Summ } },
          ]},
      ]},
    { text: '海面上昇シミュレーション　　　　',
      children: [
        // { text: '海面上昇シミュ5Mdem', data: { id: 'flood5m', layer: flood5Obj, opacity: 1, summary: floodSumm, component: {name: 'flood5m', values:[]}} },
        { text: '海面上昇シミュ（色別標高図風）', data: { id: 'flood10m', layer: flood10Obj, opacity: 1, summary: floodSumm, component: {name: 'flood10m', values:[]}} },
        { text: '海面上昇シミュ（詳細）', data: { id: 'flood15', layer: flood15Obj, opacity: 1, summary: floodSumm, component: {name: 'flood15', values:[]}} },
        { text: '海面上昇シミュ（シンプル）', data: { id: 'flood10m2', layer: floodSinpleObj, opacity: 1, summary: floodSumm, component: {name: 'floodSimple', values:[]}} },
      ]
    },
    { text: 'ハザードマップ',
      children: [
        { text: '宮崎県',
          children: [
            { text: '宮崎県南海トラフ地震津波浸水想定', data: { id: 'miyazakinantora', layer: LayersMvt.nantoraObj, opacity: 1, summary: LayersMvt.nantoraSumm } },
            { text: '宮崎県南海トラフ地震震度分布', data: { id: 'miyazakinantorashindo', layer: LayersMvt.nantoraShindoObj, opacity: 1, summary: LayersMvt.nantoraShindoSumm } },
            { text: '宮崎県南海トラフ地震液状化可能性', data: { id: 'miyazakinantoraekijyoka', layer: LayersMvt.nantoraEkijyokaObj, opacity: 1, summary: LayersMvt.nantoraShindoSumm } },
            { text: '宮崎県日向灘地震津波浸水想定', data: { id: 'hyugatsunami', layer: LayersMvt.hyugaTsunamiObj, opacity: 1, summary: LayersMvt.hyugaTsunamiSumm } },
            { text: '宮崎県日向灘地震震度分布', data: { id: 'hyugashindo', layer: LayersMvt.hyuganadaShindoObj, opacity: 1, summary: LayersMvt.hyuganadaShindoSumm } },
            { text: '宮崎県日向灘地震津波到達時間', data: { id: 'hyugatotatsu', layer: LayersMvt. hyuganadaTsunamiTotatsu, opacity: 1, summary: LayersMvt.hyuganadaTsunamiTotatsuSumm } },
          ]},
        { text: '洪水浸水想定（想定最大規模）', data: { id: 'shinsuishin', layer: shinsuishinObj, opacity: 1, summary: shinsuishinSumm } },
        { text: '洪水浸水想定（計画規模）', data: { id: 'shinsuishinK', layer: shinsuishinKObj, opacity: 1, summary: shinsuishinKSumm } },
        { text: '津波浸水想定', data: { id: 'tunami', layer: tsunamiObj, opacity: 1, summary: tunamiSumm } },
        { text: '浸水継続時間(想定最大規模)', data: { id: 'keizoku', layer: keizokuObj, opacity: 1, summary: keizokuSumm } },
        { text: '高潮浸水想定', data: { id: 'takasio', layer: takasioObj, opacity: 1, summary: takasioSumm } },
        { text: 'ため池決壊による浸水想定区域', data: { id: 'tameike', layer: tameikeObj, opacity: 1, summary: tameikeSumm } },
        { text: '家屋倒壊等氾濫想定区域（氾濫流）', data: { id: 'toukai', layer: toukaiObj, opacity: 1, summary: toukaiSumm } },
        { text: '筑後川浸水推定図2023/7/11', data: { id: 'sinsuisuitei', layer: sinsuisuiteiObj, center:[130.61658037551376, 33.34398451546858], zoom:13, opacity: 1, summary: stdSumm } },
        { text: '地形区分に基づく液状化の発生傾向図', data: { id: 'ekizyouka', layer: ekizyoukaObj, opacity: 1, summary: ekizyouka0Summ } },
        { text: '土砂災害',
          children: [
            { text: '<i class="fa-solid fa-layer-group"></i>土砂災害全て', data: { id: 'dosyasaigai', layer: dosyaSaigaiObj, opacity: 1,summary:dosyaSaigaiSumm} },
            { text: '土砂災害警戒区域(土石流)', data: { id: 'dosya', layer: dosyaObj, opacity: 1, summary: dosyaSumm } },
            { text: '土石流危険渓流', data: { id: 'doseki', layer: dosekiObj, opacity: 1, summary: dosekiSumm } },
            { text: '急傾斜地崩壊危険箇所', data: { id: 'kyuukeisya', layer: kyuukeisyaObj, opacity: 1, summary: kyuukeisyaSumm } },
            { text: '地すべり危険箇所', data: { id: 'zisuberi', layer: zisuberiObj, opacity: 1, summary: zisuberiSumm } },
            { text: '雪崩危険箇所', data: { id: 'nadare', layer: nadareObj, opacity: 1, summary: nadareSumm } },
          ]},
        { text: '自然災害伝承碑',
          children: [
            { text: '自然災害伝承碑（全て）', data: { id: "densyou", layer: LayersMvt.densyouObj, opacity: 1, summary: stdSumm } },
            { text: '自然災害伝承碑（洪水）', data: { id: "densyouflood", layer: LayersMvt.densyouFloodObj, opacity: 1, summary: stdSumm } },
            { text: '自然災害伝承碑（土砂災害）', data: { id: "densyousediment", layer: LayersMvt.densyouSedimentObj, opacity: 1, summary: stdSumm } },
            { text: '自然災害伝承碑（高潮）', data: { id: "densyouhightide", layer: LayersMvt.densyouHightideObj, opacity: 1, summary: stdSumm } },
            { text: '自然災害伝承碑（地震）', data: { id: "densyouearthquake", layer: LayersMvt.densyouEarthquakeObj, opacity: 1, summary: stdSumm } },
            { text: '自然災害伝承碑（津波）', data: { id: "densyouetsunami", layer: LayersMvt.densyouTsunamiObj, opacity: 1, summary: stdSumm } },
            { text: '自然災害伝承碑（火山災害）', data: { id: "densyovolcano", layer: LayersMvt.densyouVolcanoObj, opacity: 1, summary: stdSumm } },
            { text: '自然災害伝承碑（そのほか）', data: { id: "densyovoother", layer: LayersMvt.densyouOtherObj, opacity: 1, summary: stdSumm } },
          ]},
        { text: 'デジタル標高地形図',
          children: [
            { text: '宮崎2012/9月', data: { id: "dsmmiyazaki", layer: dsmMiyazakiobj, opacity: 1, summary: stdSumm } },
          ]},
        // { text: '大規模盛土造成地', data: { id: 'morido', layer: moridoObj, opacity: 1, summary: moridoSumm } },
        // { text: '避難施設', data: { id: 'hinan', layer: LayersMvt.hinanObj, opacity: 1, summary: LayersMvt.hinanSumm } },
        { text: '道路冠水想定箇所', data: { id: 'kansui', layer: LayersMvt.kansui00Obj, opacity: 1, summary: stdSumm } },
        { text: '事前通行規制区間', data: { id: 'kiseikukan', layer: LayersMvt.kiseikukan00Obj, opacity: 1, summary: stdSumm } },
        { text: '指定緊急避難場所(洪水)', data: { id: 'hinan01', layer: LayersMvt.hinanzyo01Obj, opacity: 1, summary: stdSumm } },
        { text: '<span style="font-size: smaller;">指定緊急避難場所(崖崩れ、土石流及び地滑り)</span>', data: { id: 'hinan02', layer: LayersMvt.hinanzyo02Obj, opacity: 1, summary: stdSumm } },
        { text: '指定緊急避難場所(地震)', data: { id: 'hinan04', layer: LayersMvt.hinanzyo04Obj, opacity: 1, summary: stdSumm } },
        { text: '指定緊急避難場所(津波)', data: { id: 'hinan05', layer: LayersMvt.hinanzyo05Obj, opacity: 1, summary: stdSumm } },
        { text: '指定緊急避難場所(大規模な火事)', data: { id: 'hinan06', layer: LayersMvt.hinanzyo06Obj, opacity: 1, summary: stdSumm } },
        { text: '<span style="font-size: smaller;">平成23年東北地方太平洋沖地震　津波浸水範囲</span>', data: { id: 'h23tunami', layer: h23tunamiObj, opacity: 1, summary: h23tunamiSumm} },
        { text: '地すべり地形分布図', data: { id: 'zisuberi9', layer: zisuberi9Obj, opacity: 1, summary: zisuberi9Summ} },
        { text: '地震危険度測定調査(東京都)',
          children: [
            { text: '総合危険度ランク', data: { id: "tokyoZisin", layer: LayersMvt.tokyoZisinObj, opacity: 1, summary: LayersMvt.tokyoZisinSumm } },
            { text: '災害時活動困難係数', data: { id: "tokyoZisin2", layer: LayersMvt.tokyoZisin2Obj, opacity: 1, summary: LayersMvt.tokyoZisin2Summ } },
          ]},
        { text: '今後30年間震度6以上の確率', data: { id: 'jisin', layer: jisinObj, opacity: 1, summary: jisinSumm } },
        { text: '北海道太平洋沿岸の津波浸水想定', data: { id: "hokkaidouTunamiT", layer: LayersMvt.hokkaidouTunamiTObj, opacity: 1, summary: LayersMvt.hokkaidouTunamiTSumm } },
        { text: '北海道日本海沿岸の津波浸水想定', data: { id: "hokkaidouTunami", layer: LayersMvt.hokkaidouTunamiObj, opacity: 1, summary: LayersMvt.hokkaidouTunamiSumm } },
        { text: 'R05大規模盛土造成地', data: { id: 'zosei', layer: LayersMvt.zoseiObj, opacity: 1, summary: LayersMvt.zoseiSumm } }
      ]},
    { text: '遺跡、文化財等',
      children: [
        { text: '日本遺産', data: { id: "nihonisan", layer: LayersMvt.nihonisanObj, opacity: 1, summary: LayersMvt.nihonisanSumm } },
        // { text: '日本遺産(ヒートマップ)', data: { id: "nihonisanheatmap", layer: LayersMvt.nihonisanheatmapObj, opacity: 1, summary: LayersMvt.nihonisanheatmapSumm } },
        { text: '国指定文化財等データベース', data: { id: "bunkazaidb", layer: LayersMvt.bunkazaidbObj, opacity: 1, summary: LayersMvt.bunkazaidbSumm } },
        { text: '全国旧石器時代遺跡', data: { id: "kyuusekki", layer: LayersMvt.kyuusekki0Obj, opacity: 1, summary: LayersMvt.kyuusekkiSumm } },
        // { text: '全国旧石器時代遺跡(ヒートマップ)', data: { id: "kyuusekkihm", layer: LayersMvt.kyuusekkiHmObj, opacity: 1, summary: LayersMvt.kyuusekkiSumm } },
        // { text: '全国縄文・弥生集落遺跡', data: { id: "yayoiiseki", layer: LayersMvt.yayoiisekiObj, opacity: 1, summary: LayersMvt.yayoiisekiSumm } },
        { text: '北海道埋蔵文化財包蔵地', data: { id: "hokkaidoumaibun", layer: LayersMvt.hokkaidoumaibunObj, opacity: 1, summary: LayersMvt.hokkaidoumaibunSumm } },
        { text: '東京都文化財', data: { id: "tokyobunkazai", layer: LayersMvt.tokyobunkazaiObj, opacity: 1, summary: LayersMvt.tokyobunkazaiSumm } },
        { text: '富山県埋蔵文化財', data: { id: "toyamamaibun", layer: LayersMvt.toyamamaibunObj, opacity: 1, summary: LayersMvt.toyamamaibunSumm } },
        { text: '岡山県埋蔵文化財', data: { id: "okayamamai", layer: LayersMvt.okayamamaiiObj, opacity: 1, summary: LayersMvt.okayamamaiSumm } },
        { text: '熊本県遺跡', data: { id: "kumamotomai", layer: LayersMvt.kumamotomaiObj, opacity: 1, summary: LayersMvt.kumamotomaiSumm } },
        { text: '土木学会選奨土木遺産', data: { id: "dobokuisan", layer: LayersMvt.dobokuisanObj, opacity: 1, summary: LayersMvt.dobokuisanSumm } },
        { text: '延喜式神名帳式内社(神社)', data: { id: "jinjya", layer: LayersMvt.jinjyaObj, opacity: 1, summary: LayersMvt.jinjyaSumm } },
      ]},
    { text: '道、鉄道等',
      children: [
      ]},
    { text: 'その他',
      children: [
        { text: 'OpenStreetMap', data: { id: 0, layer: osmObj, opacity: 1, summary: osmSumm } },
        { text: '2021土地利用細分メッシュ(100m)', data: { id: "tochiriyosaibun", layer: LayersMvt.mesh100mTochiriyoObj, opacity: 1, summary: LayersMvt.mesh1kmObjSumm } },
        // { text: 'test', data: { id: "kouzuimesyu9syu", layer: LayersMvt.fgbObj, opacity: 1, summary: LayersMvt.kozuiMesh9syuSumm} },
        { text: '一等三角点', data: { id: "itto", layer: LayersMvt.ittosankakutenObj, opacity: 1, summary: LayersMvt.ittosankakutenSumm } },
        { text: 'ウィキメディア・コモンズ', data: { id: "wiki", layer: LayersMvt.wikiObj, opacity: 1, summary: LayersMvt.wikiSumm } },
        { text: '気象庁予報区（一次細分区域等 ）', data: { id: "yohouku1", layer: LayersMvt.yohouku1Obj, opacity: 1, summary: LayersMvt.yohoukuSumm } },
        { text: '夜の明かり', data: { id: "japanLight", layer: LayersMvt.japanLightObj, opacity: 1, summary: LayersMvt.japanLightSumm } },
        { text: '河川中心線', data: { id: "suiro", layer: LayersMvt.suiroObj, opacity: 1, summary: LayersMvt.suiroSumm } },
        { text: '竜巻', data: { id: "tatumakiH23", layer: LayersMvt.tatumakiH23Obj, opacity: 1, summary: LayersMvt.tatumakiH23Summ } },
        { text: 'ダム', data: { id: "damh26", layer: LayersMvt.damh26Obj, opacity: 1, summary: LayersMvt.damh26Summ } },
        { text: '湖沼', data: { id: "kosyouH17", layer: LayersMvt.kosyouH17Obj, opacity: 1, summary: LayersMvt.kosyouH17Summ } },
        // { text: '法務省地図', data: { id: "houmusyou", layer: houmusyouObj, opacity: 1, summary: houmusyouSumm } },
      ]},
  ];
// let cnt = 0
// function aaa () {
//   Layers.forEach(value => {
//     // console.log(value)
//     if (!value.children) cnt++
//     function bbb (v1) {
//       if (v1.children) {
//         v1.children.forEach(v2 => {
//           // console.log(v2)
//           if (!v2.children) cnt++
//           if (v2.children) bbb(v2)
//         })
//       }
//     }
//     bbb(value)
//   })
// }
// aaa()
// console.log('背景' + cnt + '件')


