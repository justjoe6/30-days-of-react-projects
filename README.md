Fetch Cats Data:
Below is the asynchronous fetch cats data function which uses the API (https://api.thecatapi.com/v1/breeds) and retrieves data such as cat weight and lifespan which is
used in the Home component which can be seen later on and stores it in the catData state. If the fetch request fails then the error is caught and printed onto the console.
The useEffect ensures that the data is loaded when the page is first loaded and sets the isLoaded state to true to trigger a rerender so the data is visible
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
The useEffect ensures that the data is loaded when the page is first loaded and sets the imgLoaded state to true to trigger a rerender so the image is visible
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
