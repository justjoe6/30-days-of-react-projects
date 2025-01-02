#Cata Data Project

Fetch Cats Data:
Below is the asynchronous fetch cats data function which uses the API (https://api.thecatapi.com/v1/breeds) and retrieves data such as cat weight and lifespan which is
used in the Home component which can be seen later on and stores it in the catData state. If the fetch request fails then the error is caught and printed onto the console.
The useEffect ensures that the data is loaded when the page is first loaded and sets the isLoaded state to true to trigger a rerender so the data is visible.
```
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
  useEffect(() => {
    fetchCatsData({setCatData}).then(()=>setLoad(true))
  }, []); 
```
Fetch Cat Images:
This function works similar to the previous one, but retrieves an image from the API (https://api.thecatapi.com/v1/images/search?breed_id=abys) which changes everytime
the page is loaded then sets the catImg state to the url of that iamge and sets the image height and width state to height and width of that image divided by two.
The useEffect ensures that the data is loaded when the page is first loaded and sets the imgLoaded state to true to trigger a rerender so the image is visible.
```
  const fetchCatImg = async () => {
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
  useEffect(() => {
    fetchCatImg({setCatImg,setImgHeight,setImgWidth}).then(()=>setImgLoad(true))
  }, []);
```
CatData Component:
In the first lines of this function we use the catData that we loaded in earlier and reduce it to determine the total combined possible lifespan and total weight. 
Then the component returns the image along with all the data (height and weight) that was retrieved divided by two times the length since this is because we are given
a span for weight and lifespan meaning we get two numbers the minimum and maximum.
```
const CatData = ({catData,catImg,imgHeight,imgWidth}) => {
  const totalYears = catData.reduce((acc,data)=>acc+parseInt(data["life_span"].split(" ")[0])+parseInt(data["life_span"].split(" ")[2]),0)
  const t = parseInt(catData[0]["weight"]["imperial"].split("  ")[0])+parseInt(catData[0]["weight"]["imperial"].split("  ")[2])/2
  catData.shift()
  const totalWeight = catData.reduce((acc,data)=>acc+parseInt(data["weight"]["imperial"].split(" ")[0])+parseInt(data["weight"]["imperial"].split(" ")[2]),0)+t

  return (
    <>
    <h2>Cata Data</h2>
    <img style={{width:imgWidth,height:imgHeight}} src={catImg} alt="Cat"/>
    <p>There are {catData.length} cat breeds</p>
    <p>Average cat weight is {(totalWeight/(catData.length*2)).toFixed(2)} lbs and the average lifespan is {(totalYears/(catData.length*2)).toFixed(2)}</p>
    </>
  )
}
```

Home Component:
Here in the home component we have all the states we've used so far along with this we return a header tag containing HOMEPAGE along with the catData component if 
the image and data has been loaded otherwise we return a paragraph tag containing Loading...
```
  const [catData,setCatData] = useState([])
  const [catImg,setCatImg] = useState("")
  const [imgHeight,setImgHeight] = useState(0)
  const [imgWidth,setImgWidth] = useState(0)
  const [isLoaded,setLoad] = useState(false)
  const [imgLoaded,setImgLoad] = useState(false)
  return (
    <>
    <h1>HOMEPAGE</h1>
    {! isLoaded || !imgLoaded ? <p>Loading....</p> : <CatData catData={catData} catImg={catImg} imgHeight={imgHeight} imgWidth={imgWidth}/>}
    </>
```

#Countries Project

Fetch Countries:
Similar to previous fetch requests here we pull data from the API (https://restcountries.com/v3.1/all) once the data is loaded we set the countriesLoad state to true and store
the data in two different states. This is because since we can filter countries through the search bar we want to have a separate state for filtered countries so we do not lose
the data about all countries.
```
  const fetchCountries = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all")
    const data = await response.json()
    setCountries(data)
    setData(data)
    setCountriesLoad(true)
  }
  useEffect(()=>{
    try{
      fetchCountries()
    }
    catch(err){
      console.log("ERROR: ",err)
    }
  },[])
```

Handling User Input(Search Bar):
If the value in the search box is empty then we just set the countries state to all of the data from the API call. The check languages function takes in the languages of a country along with the value the user inputted into the search bar and returns whether or not what is inputted into the search bar matches with any of the countries languages. This function is used when filtering countries since the search bar allows searching for countries based on languages, capital, and name. So for the filteredCountries variable we use the checkLanguages function along with if the value inputted matches the capital or name of the country to decide if the country should be filtered or not. 
```
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
```

getLanguages & getCurrencies Functions:
These functions are used to retrieve the currencies and languages stored in every country object and returns them as a string ready to be displayed on the page.
```
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
```

Top Populated Countries Function:
First we create an object containing the world population and we then sort all the filtered countries using the popCompFunc enabling us to sort based of the population element of each country object then we reverse the sorted list so that the highest populated countries are at the start. We then return the top 10 populated countries of the filtered countries within a div tag containing the population number of the country within a paragraph tag and a bar whose size depends on the population size of the country.
```
  function popCompFunc(a,b){
    if (a["population"]<b["population"]) {
      return -1
    } else if (a["population"] > b["population"]) {
      return 1
    }
    return 0
  }
  const topPopulated = () => {
    const world ={name:{common:"World"},population:7693165599}
    const sortedCountries = [...countries,world].sort(popCompFunc).reverse()
    if(sortedCountries.length <= 10){
      return sortedCountries.map((country)=><div><p key={country["name"]}>{country["name"]["common"]}</p><div style={{height:20,width:Math.max(country["population"]/7000000,5),backgroundColor:"orange"}}></div><p>{country["population"].toLocaleString()}</p></div>)
    }

    const subArray = sortedCountries.slice(0,10)
    return subArray.map((country)=><div><p key={country["name"]}>{country["name"]["common"]}</p><div style={{height:20,width:Math.max(country["population"]/7000000,5),backgroundColor:"orange"}}></div><p>{country["population"].toLocaleString()}</p></div>)

  }
```

topLanguages Function:
In this function we first create the languageMap which is used as we iterate through the filteredCountries to keep track of the number of countries that speak each language (The keys are the language name and the value is number of countries that speak that language). Then we create a list of tuples which whos first value is the number of countries that speak the language and the second value is the name of the language. This is to make sorting easier since we can sort this list based of that first value. We then reverse and grab the top 10 countries if there are 10 otherwise we just use the whole list and we create the html structure for each language along with the bar representing how frequent the language is used.
```
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
```
Countries Component Return:
Here we return the HTML for the countries page along with the map method calls creating the html structure for each country displayed in the page and buttons to toggle between top languages and top populations at the bottom of the page
```
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
```
#Twitter Project

postTweet Function:
```
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
```
LoadTweets component:

```
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
```

```
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
```

```
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
```

```
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
```
