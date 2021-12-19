import React, { useState, useEffect } from "react";

import stocks from "../data.json";
import "./Main.scss";

import { v4 as uuidv4 } from 'uuid';

import {AiOutlineDelete} from "react-icons/ai";
import {MdOutlineAddBox} from "react-icons/md";
import {AiOutlineEdit} from "react-icons/ai";
import {MdArrowDropDown} from "react-icons/md";
import {MdArrowDropUp} from "react-icons/md";


   // Here, we are making our own stocks data with previous json by adding a unique nano id to all of them
const temp = [];
let stocksData = stocks.stocksData;
let i=0;
while (i < stocksData.length) {
    let id=uuidv4();
    let splitData = stocksData[i][0].split("::");
    temp.push([id, splitData[0], stocksData[i][1], stocksData[i][2]]);
    i++;
}


function Main() {

    // everytime we sort the data, "sort" is changed so that useEffect would render after that
    const [sort, setSort] = useState(false);

   // new data Array will be "ourData" with unique nanoids
    const [ourArr, setOurArr] = useState(temp);     
    
    // everytime some key is pressed in search input BaseAudioContext, it will update "searchVal" string
    const [searchVal, setSearchVal] = useState("");  

    // matching data consists of all the data-arrays from ourArr values which are having their names with values entered in search box
    const [matchingVal, setMatchingVal] = useState([]);

    // currArr is the current array with the stock data which user has shortlisted
    const [currArr, setCurrArr] = useState([]);

    // A boolean value, by default bool is true and if user searches something, it will be true
    const [bool, setBool] = useState(true);

    // upon every change in input box search value, useEffect triggers and updates "matchingVal" array
    useEffect(()=>{

        searchVal===""?setBool(true):setBool(false);

        let checking = ourArr.filter(el=>el[1].toLowerCase().includes(searchVal.toLowerCase()));

        setMatchingVal(checking);

    },[searchVal, sort]);



   // before adding to the currArr, each data will be checked with its id if it is already present in currArr or not
    const verifyOnce=(id)=>{
        for (let i=0;i<currArr.length;i++){
            if (id===currArr[i][0][0]){return false}
        }
        return true;
    }


// Add to the currArr function. In order to add the data, (i)-> make bool-false, (ii)-> verify if it is already present, act on bool, (iii)-> do the action, show response

    const addFunction=(id)=>{
        let bool = false;

        const val = ourArr.filter((e)=>{
            if (e[0] === id && verifyOnce(id) === true){   
                bool = true;
                // console.log(e);
                return e;
            }
        })

        if(bool===true){
            setCurrArr([...currArr, val]);
            return;

        }
        else{
            alert("Check your list, already there...");
            return;
        }

    }

    const deleteFunction=(id)=>{
        const satchet = currArr.filter((e)=>{
            if (id!==e[0][0]){
                return e[0];
            }
        })
        setCurrArr(satchet);
    }



    return (
        <div className="_wrapper">
            <div className="_searchBox">
                <input type="text"  placeholder="Type stock name" className="_input" value={searchVal} onChange={(e)=>{setSearchVal(e.target.value)}}/>
            </div>

            {bool?currArr.length <= 0 ? <div className="_addStocks"><h1>Please add some stocks first</h1></div> : <>
                    <div className="_contentWrapper">
                        <div className="_name">
                            <h2>Gaurav</h2>
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <p cursor="pointer" onClick={()=>{
                                    
                                    // sorting function 

                                    let pramp=currArr.sort((a,b)=>{return a[0][2]-b[0][2]});
                                    setCurrArr(pramp);
                                    setSort(!sort);
                                }}>Price <MdArrowDropUp color="blue" size="20px"/></p>
                                <p cursor="pointer" onClick={()=>{
                                    let pramp=currArr.sort((a,b)=>{return b[0][2]-a[0][2]});
                                    setCurrArr(pramp);
                                    setSort(!sort);
                                }}>Price <MdArrowDropDown  color="red" size="20px"/></p>
                                <AiOutlineEdit size="45px" className="_img" alt="Edit" />
                                <AiOutlineDelete color="red" size="45px" className="_img" alt="Edit" />
                                
                            </div>
                        </div>
                        <hr/>
                        {currArr.map(e => {
                            return (
                                <div key={e[0][0]}>
                                    <div className="_results">
                                        <div>
                                            <h2 style={{color:(e[0][2]-e[0][3])<0?"red":"blue"}}>{e[0][1]}</h2>
                                            <p className="_NSE">NSE</p>
                                        </div>

                                        <div className="_credentials">
                                            
                                            <AiOutlineDelete color="red" size="45px" className="_deleteButton" 
                                            onClick={() =>{
                                                deleteFunction(e[0][0])
                                            }}/>
                                            <div style={{ textAlign: "right" }}>
                                                <h3 style={{ color: (e[0][2] - e[0][3]) < 0 ? "red" : "blue" }}>{e[0][2]}</h3>
                                                <p>{(e[0][2] - e[0][3]) >0 ? <MdArrowDropUp color="blue" size="35px"/>:<MdArrowDropDown color="red" size="35px"/>}{  ((e[0][2]-e[0][3])/e[0][3]).toFixed(3)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
                            )
                        })}
                    </div>
                </> :
                matchingVal <= 0 ? <div className="_addStocks"><h1>No such stock, please check your initials and try again</h1></div> : 
                    <div className="_suggestionBox">
                        {matchingVal.map(e => {
                            return (
                                <div key={`key:${e[0]}`}>
                                    <div className="_suggstChild">
                                        <div>
                                            <h3 style={{ color: (e[2] - e[3]) < 0 ? "red" : "blue" }}>{e[1]}</h3>
                                            <p style={{ color: "black" }}>NSE</p>
                                        </div>
                                        <div style={{ display: "flex", flexDirection:"row", alignItems: "center" }}>
                                            {verifyOnce(e[0])?<MdOutlineAddBox className="_addButton" color="aqua" size="40px" onClick={() => {
                                                addFunction(e[0])
                                            }} alt="add" />:<AiOutlineDelete color="red" size="40px" className="_delete" 
                                            onClick={() =>{
                                                deleteFunction(e[0])
                                            }}/>}
                                            
                                            <div style={{ textAlign: "right" }}>
                                                <h4 style={{ color: (e[2] - e[3]) < 0 ? "red" : "blue" }}>{e[2]}</h4>
                                                <p>{(e[2] - e[3]) >0 ? <MdArrowDropUp color="blue" size="35px"/>:<MdArrowDropDown color="red" size="35px"/>}{((e[2] - e[3]) / e[3]).toFixed(3)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
                            )
                        })}
                    </div>
            }
        </div>
    )
}

export default Main;