# Cata Data Project
<img width="959" alt="cataData" src="https://github.com/user-attachments/assets/eb9e5957-b128-418d-8f96-df6ac67cc5bc" />

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

# Countries Project
<img width="959" alt="countries1" src="https://github.com/user-attachments/assets/fe1daed1-57e8-443a-b004-aa97096c0a06" />

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
<img width="946" alt="countries2" src="https://github.com/user-attachments/assets/46922b1a-9685-474a-a6ba-2879c43e0b5a" />
<img width="944" alt="countries3" src="https://github.com/user-attachments/assets/8595fd63-e6c0-4447-a86f-d8ee608b2b8f" />

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
<img width="806" alt="countries4" src="https://github.com/user-attachments/assets/2c438033-7349-4384-ba5d-0b7a0a1963c7" />

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
<img width="707" alt="countries5" src="https://github.com/user-attachments/assets/7db1100e-b283-45f8-b240-2160dcd46692" />

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
# Twitter Project(Rabbit)
<img width="943" alt="rabbit" src="https://github.com/user-attachments/assets/6fb99ec0-3a8c-4791-a0a5-7d3ee366e7f6" />

postTweet Function:
First we ensure that the currTweet(User input) is greater than 0 otherwise we dont add the tweet to our state containing all tweets and this is done to prevent empty tweets. We also create a tweet object (tweetObj) which will contain the current date, currTweet, an empty array of comments, and tempComm which is used to store the value of a comment being written. Lastly, we add the tweet object to our state containing all tweets, we reset the word count to 250 and we set currTweet state to an empty string to reset the user input box.
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
In the LoadTweets component we have helper functions such as removeTweet which filters out and removes a tweet from the tweets state, we have likeTweet which adds a tweet to the likedPosts state updating it and unlikeTweet which does the same as removeTweet but with the likedPosts state. Theres also editTweet which adds the tweet to the editingTweets state which will change the html structure to make a text area appear to update a tweet. Lastly we have saveChanges which is used to update the text within the tweet with the new value, then removes the tweet from the editingTweets state and resets the tweet objects edit member in the case of future edits.
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
Comments:
Here we create a new tweet object with an updated comments array containing the new comment then using the map method we iterate through tweets and replace the corresponding tweet with its updated version and we then set the tweets state to the updated list of tweets and reset tempComm member in tweet for future comments. Finally we have the handleCommentBtn function and this takes into account whether or not the tweet is in the loadComments state or not and if it is then it removes it so no comments are shown and otherwise it adds it to the state that way comments are shown. In other words if the comment button is already pressed and comments are visible then by pressing it again it would hide comments.
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
Here is where we map each tweet object to its corresponding html structure at the top we have the tweet header which contains the profile pic with the username next to it. Below that we have the conditional which determines whether the actual tweet text is shown or a text area to edit the tweet is shown which depends on if the edit tweet button is pressed. When the edit button is pressed two more buttons appear the save button which calls the saveChanges function and discard button which removes the tweet object from the editingTweets state showing the original tweet text again. We also have onMouseEnter and onMouseLeave for each icon(edit,delete,comment,like) so they highlight when the mouse is over them and unhighlight when the mouse is no longer on them. The delete icon when pressed calls removeTweet, the like icon is replaced with a filled in heart when pressed and adds the tweet object to the likedPosts state and when pressed again its replaced with the outline of a heart and the tweet object is removed from the likedPosts state. Lastly when the comment icon is clicked on we call the function handleCommentBtn which adds the tweet object to the loadComments state which in turn loads in any comments below that tweet, however theres a conditional such that if theres no comments a text is displayed saying "No Comments" then below that is a text area to type in a comment along with two buttons one to discard the current comment and one to post the comment.
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
At the end of the Twitter component we return the html containing the LoadTweets component and above it we have the textarea for user input onChange we update the currTweet state and there's the post button next to it which onClickc calls our postTweet function.
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
