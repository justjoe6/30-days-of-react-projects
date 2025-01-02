import React, { useState,useEffect } from 'react'
import { FiEdit } from "react-icons/fi"
import { FaRegTrashCan } from "react-icons/fa6"
import { FaRegComment } from "react-icons/fa"
import { FaRegHeart } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"
import { FaHeart } from "react-icons/fa";
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Routes,
} from 'react-router-dom'

const fetchCatsData = async ({setCatData}) => {
  try{
  const response = await fetch('https://api.thecatapi.com/v1/breeds')
  const data = await response.json()
  setCatData(data)
  }
  catch(err){
    console.log("ERROR: ",err)
  }
}
const fetchCatImg = async ({setCatImg,setImgHeight,setImgWidth}) => {
  try{
  const response = await fetch('https://api.thecatapi.com/v1/images/search?breed_id=abys')
  const data = await response.json()
  setCatImg(data[0]["url"])
  setImgHeight(Math.floor(data[0]["height"]/2))
  setImgWidth(Math.floor(data[0]["width"]/2))
  }
  catch(err){
    console.log("ERROR: ",err)
  }
}

const Home = () => {
  const [catData,setCatData] = useState([])
  const [catImg,setCatImg] = useState("")
  const [imgHeight,setImgHeight] = useState(0)
  const [imgWidth,setImgWidth] = useState(0)
  const [isLoaded,setLoad] = useState(false)
  const [imgLoaded,setImgLoad] = useState(false)
  useEffect(() => {
    fetchCatsData({setCatData}).then(()=>setLoad(true))
  }, []); 
  useEffect(() => {
    fetchCatImg({setCatImg,setImgHeight,setImgWidth}).then(()=>setImgLoad(true))
  }, []); 
  return (
    <>
    <h1>HOMEPAGE</h1>
    {! isLoaded || !imgLoaded ? <p>Loading....</p> : <CatData catData={catData} catImg={catImg} imgHeight={imgHeight} imgWidth={imgWidth}/>}
    </>
  )
}

const CatData = ({catData,catImg,imgHeight,imgWidth}) => {
  const totalYears = catData.reduce((acc,data)=>acc+parseInt(data["life_span"].split(" ")[0])+parseInt(data["life_span"].split(" ")[2]),0)
  catData.shift()
  const totalWeight = catData.reduce((acc,data)=>acc+parseInt(data["weight"]["imperial"].split(" ")[0])+parseInt(data["weight"]["imperial"].split(" ")[2]),0)

  return (
    <>
    <h2>Cata Data</h2>
    <img style={{width:imgWidth,height:imgHeight}} src={catImg} alt="Cat"/>
    <p>There are {catData.length} cat breeds</p>
    <p>Average cat weight is {(totalWeight/catData.length).toFixed(2)} lbs and the average lifespan is {(totalYears/catData.length).toFixed(2)}</p>
    </>
  )
}




const Countries = () => {
  const [countries,setCountries]=useState([])
  const [loadData,setData]=useState([])
  const [countriesLoaded,setCountriesLoad]=useState(false)
  const [topMetric,setTopMetric]=useState(false)

  const fetchCountries = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const data = await response.json()
    setCountries(data)
    setData(data)
    setCountriesLoad(true)
  }

  const handleUserInput = (e) => {

    if(e.target.value===""){
      setCountries(loadData)
      return
    }
    const checkLanguages = (languages,inp) => {
      let ret_val= false
      Object.entries(languages).forEach(([k,v]) => ret_val = ret_val || v.toLowerCase().includes(inp.toLowerCase()))
      return ret_val
    }
    const filteredCountries = loadData.filter((country)=>(country["languages"] && checkLanguages(country["languages"],e.target.value)) || country["name"]["common"].toLowerCase().includes(e.target.value.toLowerCase()) || (country["capital"] && country["capital"][0].toLowerCase().includes(e.target.value.toLowerCase())))
    setCountries(filteredCountries)
  }

  useEffect(()=>{
    try{
      fetchCountries()
    }
    catch(err){
      console.log("ERROR: ",err)
    }
  },[])

  const getLanguages = (languages) => {
    if(!languages){
      return
    }
    return Object.entries(languages).map(([k,v]) => v+" ")
  }

  const getCurrencies = (currencies) => {
    if(!currencies){
      return
    }
    const curr = Object.entries(currencies).map(([k,v]) => v)[0]
    return curr["name"] + "(" +curr["symbol"]+")"
  }
  
  function popCompFunc(a,b){
    if (a["population"]<b["population"]) {
      return -1
    } else if (a["population"] > b["population"]) {
      return 1
    }
    return 0
  }

  const countriesButtonStyles = {backgroundColor:'orange',color:'white',borderRadius:4,border:"none",padding:8,marginRight:10}
  const topPopulated = () => {
    const world ={name:{common:"World"},population:7693165599}
    const sortedCountries = [...countries,world].sort(popCompFunc).reverse()
    if(sortedCountries.length <= 10){
      return sortedCountries.map((country)=><div><p key={country["name"]}>{country["name"]["common"]}</p><div style={{height:20,width:Math.max(country["population"]/7000000,5),backgroundColor:"orange"}}></div><p>{country["population"].toLocaleString()}</p></div>)
    }

    const subArray = sortedCountries.slice(0,10)
    return subArray.map((country)=><div><p key={country["name"]}>{country["name"]["common"]}</p><div style={{height:20,width:Math.max(country["population"]/7000000,5),backgroundColor:"orange"}}></div><p>{country["population"].toLocaleString()}</p></div>)

  }
  function tupleCmpFn(a,b){
    if(a[0]<b[0]){
      return -1
    }
    else if(a[0]>b[0]){
      return 1
    }
    return 0
  }
  const topLanguages = () => {
    let languageMap={}
    countries.forEach((country)=>{
      if(country["languages"]){
        Object.entries(country["languages"]).forEach(([k,v]) => {
          if( v in languageMap){languageMap[v]+=1}
          else{languageMap[v]=1}
        })
      }
    })
  
   const fixTuples = Object.entries(languageMap).map(([k,v])=>[v,k])
   const ret_val = fixTuples.sort(tupleCmpFn).reverse()
   if (ret_val <= 10){
    return ret_val.map((val)=><div><p key={val[1]}>{val[1]}</p><div style={{height:20,width:Math.max(val[0]*10,5),backgroundColor:"orange"}}></div><p>{val[0]}</p></div>)
   }
   return ret_val.slice(0,10).map((val)=><div><p key={val[1]}>{val[1]}</p><div style={{height:20,width:Math.max(val[0]*10,5),backgroundColor:"orange"}}></div><p>{val[0]}</p></div>)
  }
  

  return (<>
  <h1>Countries</h1>  
  <h2>There are {countries.length} countries</h2>
  <div style={{display:"flex",flexDirection:"column"}}>
  <input onChange={handleUserInput} style={{width:300}} type="text" placeholder='Search countries by name, capital, or language'></input>
  <button style={{width:100,marginTop:10,marginBottom:10,marginLeft:100}} onClick={()=>{window.scrollTo({top: document.body.scrollHeight-1100,behavior: 'smooth',})}}>\/</button>
  </div>
  {countriesLoaded && countries.map((country)=><div key={country["name"]["common"]}>
    <img src={country["flags"]["png"]} alt="flag"/>
    <p>{country["name"]["common"]}</p>
    <p>Capital: {country["capital"]}</p>
    <p>Languages: {getLanguages(country["languages"])}</p>
    <p>Population: {country["population"]}</p>
    <p>Currencies: {getCurrencies(country["currencies"])}</p></div>)}
    <div>
      <div><button style={countriesButtonStyles} onClick={()=>setTopMetric(false)}>Population</button><button style={countriesButtonStyles} onClick={()=>setTopMetric(true)}>Languages</button></div>
      <h3>{!topMetric ? "Most Populated Countries" : "Most Spoken Languages"}</h3>
      {countriesLoaded && <>{!topMetric && topPopulated()} {topMetric && topLanguages()}</>}
    </div>
  </>)



}


const Twitter = () => {
  const [tweets,setTweets]=useState([])
  const [wordCount,setWordCount]=useState(250)
  const [currTweet,setCurrTweet]=useState("")
  const [editHover,setEditHover]=useState([])
  const [deleteHover,setDeleteHover]=useState([])
  const [commentHover,setCommentHover]=useState([])
  const [likeHover,setLikeHover]=useState([])
  const [likedPosts,setLikedPosts]=useState([])
  const [editingTweets,setEditingTweets]=useState([])
  const [loadComments,setLoadComments]=useState([])

  const tweetContainer = {
    border:"2px solid lightgray",
    width:500,
    maxWidth:500,
  }
  const postButtonStyle = {
    backgroundColor:"blue",
    color:"white",
    borderRadius:7,
    height:40,
    width:70,
    marginLeft:10,
    marginRight:10,
    cursor:"pointer"
  }
  const saveAndDiscardBtns = {
    backgroundColor:"blue",
    color:"white",
    borderRadius:7,
    height:25,
    width:"fit-content",
    marginRight:5
  }
  const tweetHeaderStyle={
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    height:"fit-content",
    paddingTop:10,
    paddingBottom:10
  }
  const commentHeaderStyle={
    display:"flex",
    flexDirection:"row",
    alignItems:"center",
    height:"fit-content",
    paddingTop:10,
    paddingBottom:10,
    marginLeft:15
  }
  const postTweet = () => {
    if(currTweet.length < 1){
      return
    }
    const date = new Date()
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const tweetObj = {
      tweet:currTweet,
      date: month+"/"+day+"/"+year,
      edit:"",
      comments:[],
      tempComm:""
    }
    setTweets(prevTweets => [...prevTweets,tweetObj])
    setCurrTweet("")
    setWordCount(250)

  }
  const LoadTweets = () => {
    const removeTweet = (delTweet) => {
      setTweets(tweets.filter((item)=>item!==delTweet))
    }
    const likeTweet = (likedTweet) => {
      setLikedPosts(prevList => [...prevList,likedTweet])
    }
    const unlikeTweet = (unlikedTweet)=>{
      setLikedPosts(likedPosts.filter((item)=>item!==unlikedTweet))
    }
    const editTweet = (tweet) => {
      setEditingTweets(prevList=>[...prevList,tweet])
    }
    const saveChanges = (tweet) => {
      tweet.tweet=tweet.edit
      setEditingTweets(editingTweets.filter((item)=>item!==tweet))
      tweet.edit=""
    }
    const addComments = (tweet) => {
      const commInd = tweets.indexOf(tweet)
      const updatedTweet = {
        ...tweet, 
        comments: [...tweet.comments, tweet.tempComm]
      };
      const updatedTweets = tweets.map((item, i) => 
        i === commInd ? updatedTweet : item
      );
      setTweets(updatedTweets)
      tweet.tempComm=""
      setLoadComments((prevList)=>[...prevList,updatedTweet])
    }
    const handleCommentBtn = (tweet) => {
      if(loadComments.includes(tweet)){
        setLoadComments(loadComments.filter((item)=>item!==tweet))
        return
      }
      setLoadComments((prevList)=>[...prevList,tweet])
    }

    return tweets.map((tweetObj)=><div key={tweetObj} style={{marginLeft:20,marginRight:20,maxWidth:500}}>
    <div style={tweetHeaderStyle}><CgProfile size={35}/><p style={{marginTop:0,marginBottom:0,marginLeft:5,fontSize:12,color:"gray"}}>@username</p></div>
    
    {editingTweets.includes(tweetObj) ? <div>
      <textarea onChange={(e)=>tweetObj.edit=e.target.value} maxLength={250} type="text"  placeholder="" style={{height:60,width:"100%",resize:"none",overflowY:"auto",msOverflowX:"hidden"}}></textarea>
      <div>
        <button onClick={()=>saveChanges(tweetObj)} style={saveAndDiscardBtns}>Save</button><button style={saveAndDiscardBtns} onClick={()=>{setEditingTweets(editingTweets.filter((item)=>item!==tweetObj)); tweetObj.edit=""}}>Discard</button></div></div> : 
        <p style={{marginTop:0,marginLeft:5,maxWidth:500,wordWrap:"break-word"}}>{tweetObj.tweet}</p>}

    <div style={{display:"flex",justifyContent:'space-between'}}>
      <div style={{marginLeft:2,width:45,display:"flex",justifyContent:"space-between"}}>
        <FiEdit onMouseEnter={()=>setEditHover((prevList)=>[...prevList,tweetObj])} onMouseLeave={()=>setEditHover(editHover.filter((item)=>item!==tweetObj))} onClick={()=>editTweet(tweetObj)} style={{ cursor: 'pointer',color:(editHover.includes(tweetObj) ? "blue" : "black")}}/> 
        <FaRegTrashCan onMouseEnter={()=>setDeleteHover((prevList)=>[...prevList,tweetObj])} onMouseLeave={()=>setDeleteHover(deleteHover.filter((item)=>item!==tweetObj))} style={{ cursor: 'pointer',color:(deleteHover.includes(tweetObj) ? "red" : "black")}} onClick={()=>removeTweet(tweetObj)}/></div> 
      <div style={{marginLeft:5,width:45,display:"flex",justifyContent:"space-between"}}>
        <FaRegComment onClick={()=>handleCommentBtn(tweetObj)} onMouseEnter={()=>setCommentHover((prevList)=>[...prevList,tweetObj])} onMouseLeave={()=>setCommentHover(commentHover.filter((item)=>item!==tweetObj))} style={{ cursor: 'pointer', color:(commentHover.includes(tweetObj) ? "blue" : "black")}}/> 
        {likedPosts.includes(tweetObj) ? <FaHeart style={{color:"red",cursor:"pointer"}} onClick={()=>unlikeTweet(tweetObj)}/> :<FaRegHeart onClick={()=>likeTweet(tweetObj)} onMouseEnter={()=>setLikeHover((prevList)=>[...prevList,tweetObj])} onMouseLeave={()=>setLikeHover(likeHover.filter((item)=>item!==tweetObj))} style={{ cursor: 'pointer',color:(likeHover.includes(tweetObj) ? "red" : "black")}}/>}</div> {tweetObj.date}</div>
      {loadComments.includes(tweetObj) && ( tweetObj.comments.length > 0 ? tweetObj.comments.map((comment)=>
      <><div style={commentHeaderStyle}><CgProfile size={25}/><p style={{marginTop:0,marginBottom:0,marginLeft:5,fontSize:8,color:"gray"}}>@username</p></div>
      <p key={comment} style={{marginTop:0,marginLeft:20,maxWidth:500,wordWrap:"break-word"}}>{comment}</p></>) : 
      <p>No Comments</p>)}
      {loadComments.includes(tweetObj) && <div><textarea onChange={(e) => tweetObj.tempComm = e.target.value} maxLength={250} type="text"  placeholder="Enter Comment" style={{height:60,width:"100%",resize:"none",overflowY:"auto",msOverflowX:"hidden"}}></textarea><button onClick={()=>addComments(tweetObj)} style={saveAndDiscardBtns} >Comment</button><button style={saveAndDiscardBtns} onClick={()=>setLoadComments(loadComments.filter((item)=>item!==tweetObj))}>Discard</button></div>}
    </div>)
  }
  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100vh" }}>
    <div style={tweetContainer}>
      <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}><textarea style={{height:60,width:"100%",resize:"none",overflowY:"auto",msOverflowX:"hidden",marginLeft:20,borderRadius:7}} maxLength={250} type="text" value={currTweet} placeholder="Enter Text" onChange={(e)=>{setCurrTweet(e.target.value); setWordCount(250-e.target.value.length)}}></textarea><button style={postButtonStyle} onClick={()=>postTweet()}>Post</button></div>
      <p style={{display:"flex",flexDirection:"row",justifyContent:"right",alignItems:"center",marginTop:0,marginBottom:0,marginRight:80,color:"blue"}}>{wordCount}</p>
      <LoadTweets/>
    </div>
    </div>
  )
}

const NavBar = () => {
  return (
    <ul>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/countries">Countries</NavLink></li>
      <li><NavLink to="/rabbit">Rabbit</NavLink></li>
    </ul>

  )
}


const App = () => {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path='/countries' element={<Countries/>} />
        <Route exact path='/rabbit' element={<Twitter/>} />
      </Routes>
    </Router>
)
}

const rootElement = document.getElementById('root')

ReactDOM.render(<App/>, rootElement)