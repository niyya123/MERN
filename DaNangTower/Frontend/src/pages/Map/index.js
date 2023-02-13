import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import esriConfig from "@arcgis/core/config.js";
 import styles from './Map.module.scss';
 import Map from "@arcgis/core/Map";
 import SceneView from "@arcgis/core/views/SceneView";
 import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
 import Graphic from "@arcgis/core/Graphic";
import esriRequest from "@arcgis/core/request";
import Slice from "@arcgis/core/widgets/Slice";
import SlicePlane from "@arcgis/core/widgets/Slice/SlicePlane";
import LayerList from "@arcgis/core/widgets/LayerList";
import classNames from 'classnames/bind';
import { userRequest } from "../../utils/request";
import { TitleTab } from "../../utils/GenerateTitle";
const cx = classNames.bind(styles);
function DrawMap (
) {
    TitleTab("Mô hình tòa nhà")
    const [isDeletedMainBuilding,setIsDeletedMainBuilding]=useState(true);
    const [isDeletedNovotel,setIsDeletedNovotel]=useState(true);
    const mapDiv = useRef(null);
    const host = 'http://localhost:5000'
    const createGraphicPolygon = (data,{ size, colorMaterial, haveOutline = true, haveEdges = false }) => {
        return new Graphic({
            geometry: data,
            type: 'simple',
            symbol: {
            type: 'polygon-3d',
            symbolLayers: [{
                type: 'extrude',
                size: size,
                material: {
                    color: colorMaterial,
                    outline: {
                        color: haveOutline ? [255, 255, 255] : [255, 255, 255, 0],
                        width: 10,
                    },
                },
                edges: {
                    type: 'solid',
                    color: haveEdges ? [50, 50, 50, 0.5] : [50, 50, 50, 0],
                },
                },],
            },
        });
    };

    const createGraphicLine = (data, { width }) => {
        return new Graphic({
            geometry: data,
            type: 'simple',
            symbol: {
                type: 'line-3d',
                symbolLayers: [{
                    type: 'path',
                    profile: 'circle',
                    width: width,
                    material: {
                        color: [50, 52, ]
                    },
                },],
            },
        });
    };

    var createGraphicFloor5_34_Glass = function (data, option = {}) {
        return new Graphic({
            geometry: data,
            symbol: data.symbol,
            attributes: data,
            popupTemplate: data.popupTemplate,
            size: 20,
        });
    };

const json_options = {
                query: {
                    f: 'json',
                },
                responseType: 'json',
            };
        // File link = Request path
            const polygonFileMainBuildingList = [
                {
                    fileLink: '/entrance',
                    option: {
                      size: 14,
                      colorMaterial: [177, 176, 199, 1],
                    },
                },
                {
                    fileLink: '/entrance_top',
                        option: {
                            size: 4.5,
                            colorMaterial: [205, 133, 63, 1],
                        },
                },
                {
                    fileLink: '/entrance_columns',
                    option: {
                        size: 9,
                        colorMaterial: [207, 207, 207, 1],
                    },
                },
                {
                    fileLink: '/eaves',
                    option: {
                        size: 0.5,
                        colorMaterial: [181, 181, 181, 1],
                    },
                },
                {
                    fileLink: '/floor_1-3_right',
                    option: {
                        size: 13.5,
                        colorMaterial: [7, 58, 148, 0.8],
                    },
                },
                {
                    fileLink: '/floor_1-3_left',
                    option: {
                        size: 13.5,
                        colorMaterial: [248, 248, 255, 1],
                        haveOutline: false,
                    },
                },
                {
                    fileLink: '/floor_1-3_columns',
                    option: {
                        size: 14,
                        colorMaterial: [241, 241, 249, 1],
                        haveEdges: true,
                    },
                },
                {
                    fileLink: '/floor_2-3',
                    option: {
                        size: 9.5,
                        colorMaterial: [205, 133, 63, 1],
                    },
                },
                {
                    fileLink: '/floor_2',
                    option: {
                        size: 5,
                        colorMaterial: [248, 248, 255, 1],
                    },
                },
                {
                    fileLink: '/floor_1-3_roof',
                    option: {
                        size: 0.5,
                        colorMaterial: [192, 192, 192],
                    },
                },
                {
                    fileLink: '/floor_roof_c',
                    option: {
                        size: 1,
                        colorMaterial: [248, 248, 255],
                        haveOutline: false,
                    },
                },
                {
                    fileLink: '/floor_4',
                    option: {
                        size: 1,
                        colorMaterial: [248, 248, 255, 1],
                    },
                },
                {
                    fileLink: '/floor_4_columns',
                    option: {
                        size: 19.5,
                        colorMaterial: [248, 248, 255, 1],
                    },
                },
                {
                    fileLink: '/floor_5_34',
                    option: {
                        size: 0.5,
                        colorMaterial: [192, 192, 192, 1],
                    },
                }
         ];
         const polygonFileNovotelBuildingList =[
            {
                fileLink: '/novotel_bot_build',
                option: {
                    size: 155,
                    colorMaterial: [34, 165, 205, 1],
                },
            },
            {
                fileLink: '/novotel_build',
                option: {
                    size: 15,
                    colorMaterial: [192, 192, 192, 1],
                },
            },
            {
                fileLink: '/novotel_evea',
                option: {
                    size: 0.5,
                    colorMaterial: [192, 192, 192, 1],
                },
            },
            {
                fileLink: '/novotel_floor_1-5_ver',
                option: {
                    size: 130,
                    colorMaterial: [192, 192, 192, 1],
                },
            },
            {
                fileLink: '/novotel_floor_5-34_ver',
                option: {
                    size: 155,
                    colorMaterial: [220, 123, 38, 1],
                },
            },
            {
            fileLink: '/novotel_floor_5_34',
                option: {
                    size: 20,
                    colorMaterial: [192, 192, 192, 1],
                },
            },
            {
                fileLink: '/novotel_wall-midd',
                option: {
                    size: 0.5,
                    colorMaterial: [0,0, 0, 1],
                },
            }
         ];
            const lineFileList = [
                {
                    fileLink: '/line columns',
                    option: { width: 0.4 },
                },
                {
                    fileLink: '/line',
                    option: { width: 0.3 },
                },
            ];
    
    useEffect(() => {
       
        
        if (mapDiv.current) {
            
    // Vẽ nền
const map = new Map({
    basemap: 'topo-vector',
    // ground: 'world-elevation',
    layers: [], //end layers geojsonLayer
});
    userRequest().get('building/getDeletedBuilding/main_Building').then((res)=>{
        if(!res.data[0].isDeleted){
            polygonFileMainBuildingList.forEach((polygon) => {
                esriRequest(host + "/api/body/getBodies" + polygon.fileLink, json_options).then(function (response) {
                    var graphicsLayer = new GraphicsLayer();
                     response.data.faces.forEach(function (data) {
            
                       graphicsLayer.add(createGraphicPolygon(data, polygon.option));
                     });
                    map.add(graphicsLayer);
                });
            });
            // Vẽ line
            lineFileList.forEach((line) => {
                esriRequest(host + "/api/body/getLines" + line.fileLink, json_options).then(function (response) {
                    var graphicsLayer = new GraphicsLayer();
                    response.data.faces.forEach(function (data) {
                      graphicsLayer.add(createGraphicLine(data, line.option));
                    });
                    map.add(graphicsLayer);
                });
            });
            
            // Vẽ kính
            esriRequest(host + '/api/body/getBodies/floor_5-34_glass', json_options).then(
                function (response) {
                    //console.log(response);
                    var graphicsLayer = new GraphicsLayer();
                    response.data.faces.forEach(function (data) {
                        //console.log(data);
                      graphicsLayer.add(createGraphicFloor5_34_Glass(data));
                    });
                    map.add(graphicsLayer);
                    //console.log("111111");
                }
            );
            
        }
    })
    

    userRequest().get('building/getDeletedBuilding/Novotel_Building').then((res)=>{
       if(!res.data[0].isDeleted){
        polygonFileNovotelBuildingList.forEach((polygon) => {
            esriRequest(host + "/api/body/getBodies" + polygon.fileLink, json_options).then(function (response) {
                var graphicsLayer = new GraphicsLayer();
              //  console.log(response);
                //console.log(response.data.faces);
                 response.data.faces.forEach(function (data) {
        
                   graphicsLayer.add(createGraphicPolygon(data, polygon.option));
                 });
                map.add(graphicsLayer);
            });
        });
    }
       
    })
        let viewNode = document.getElementById("viewDiv");
        const view = new SceneView({
            container: viewNode,
            map: map,
            camera: {
                position: [108.22288513183594, 16.071764175013556, 200],
                heading: 0,
                tilt: 80,
            },
        });
                
        view.popup.defaultPopupTemplateEnabled = true;
        const sliceButton = document.getElementById("slice");
        const resetPlaneBtn = document.getElementById("reset-plane-btn");
        const clearPlaneBtn = document.getElementById("clear-plane-btn");
        const sliceOptions = document.getElementById("slice-option");
        const excludedLayers = [];
        const plane = new SlicePlane({
            position: {
                latitude: 16.071764175013556,
                longitude: 108.22288513183594,
                z: 417.75
            },
            tilt: 32.62,
            width: 29,
            height: 29,
            heading: 0.466
        });
    
        let sliceWidget = null;
        let doorsLayer = null;
        let sliceTiltEnabled = true;
        const menu1 = document.getElementById("slice");
        // view.ui.add(menu1, "top-right");
        // const slice = new Slice({
        //     view: view
        // });
    
        // view.ui.add(slice, {
        //     position: "top-right"
        // });
        setSliceWidget();
        function setSliceWidget() {
            sliceWidget = new Slice({
              view: view,
              container: "sliceContainer"
            });
             view.ui.add(sliceWidget, {
            position: "top-right"
        });
            sliceWidget.viewModel.excludedLayers.addMany(excludedLayers);
            sliceTiltEnabled = true;
            sliceWidget.viewModel.tiltEnabled = sliceTiltEnabled;
            sliceWidget.viewModel.shape = plane;
            sliceWidget.viewModel.watch("state", (value) => {
              if (value === "ready") {
                clearPlaneBtn.style.display = "none";
              } else {
                clearPlaneBtn.style.display = "inherit";
              }
            });
          }
    
    
        resetPlaneBtn.addEventListener("click", () => {
            document.getElementById("tilt-enabled").checked = true;
            sliceTiltEnabled = true;
            sliceWidget.viewModel.tiltEnabled = sliceTiltEnabled;
            sliceWidget.viewModel.shape = plane;
        });
    
        clearPlaneBtn.addEventListener("click", () => {
            // sliceWidget.viewModel.clear();
            sliceWidget.viewModel.clear();
        });
    
        document.getElementById("tilt-enabled")
        .addEventListener("change", (event) => {
            sliceTiltEnabled = event.target.checked;
            sliceWidget.viewModel.tiltEnabled = sliceTiltEnabled;
        });
    
        document.getElementById("color").addEventListener("change", (event) => {
            if (event.target.checked) {
                // A renderer can be set on a BuildingComponentSublayer
                doorsLayer.renderer = {
                    type: "simple", // autocasts as new UniqueValueRenderer()
                    symbol: {
                        type: "mesh-3d", // autocasts as new MeshSymbol3D()
                        symbolLayers: [{
                            type: "fill", // autocasts as new FillSymbol3DLayer()
                            material: {
                                color: "red"
                            }
                        }]
                    }
                };
            } else {
                doorsLayer.renderer = null;
            }
        });
    
        const layerList = new LayerList({
            view: view
        });
      }}, []);
    
   
return(
   
<div id="viewDiv" className={cx("viewDiv")} ref={mapDiv} > 
<div id="menu" className={cx("esri-widget")}>
    <input type="checkbox" id="color"/>
    <label htmlFor="color">
        Display all doors with a red color
    </label>
    <div id="slice-container"></div>
    <div id="slice-option">
        <button className="esri-button esri-button--secondary"
                id="reset-plane-btn" type="button"
                title="Reset slice plane">
            Reset slice plane
        </button>
        <button className="esri-button esri-button--secondary"
                id="clear-plane-btn" type="button"
                title="Clear slice plane">
            Clear slice
        </button>
        <input type="checkbox" id="tilt-enabled" checked/>
        <label htmlFor="tilt-enabled">Allow tilt on slice plane</label>
    </div>
   
</div>

</div>)
}
export default DrawMap;